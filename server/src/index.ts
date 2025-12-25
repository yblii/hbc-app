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

const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE!,
    issuerBaseURL:process.env.AUTH0_DOMAIN!,
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

app.use(cors());
app.use(express.json());

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

app.post('/groups', async (req, res) => {
    try {
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