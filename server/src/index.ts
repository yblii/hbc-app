import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated//prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';

dotenv.config();

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter })

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

app.get('/', (req, res) => {
  res.send('Badminton Club API is running!');
});

// GET all groups with their players
app.get('/groups', async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            include: {
                players: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        res.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST creates a new group with user automatically added
app.post('/groups', jwtCheck, async (req, res) => {
    try {
        const userId = req.auth?.payload.sub;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const newGroup = await prisma.group.create({
            data: {
                
            }
        });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});