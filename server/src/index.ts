import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import router from './routes';

dotenv.config();

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));
app.use(express.json());

const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE!,
    issuerBaseURL:process.env.AUTH0_DOMAIN!,
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});