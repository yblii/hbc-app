import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import router from './routes';
import webhookRouter from './routes/webhooks.routes';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HBC App API',
      version: '1.0.0',
      description: 'A project to help manage Husky Badminton Club',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: [
    path.join(__dirname, './controllers/*.ts'),
    path.join(__dirname, './routes/*.ts'),
    path.join(__dirname, '../docs/*.yaml'),
  ], 
};
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
});

app.use(cors(corsOptions));
app.use(express.json());

const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE!,
    issuerBaseURL:process.env.AUTH0_DOMAIN!,
    tokenSigningAlg: 'RS256'
});

app.use('/api', checkJwt, router);
app.use('/webhooks', webhookRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});