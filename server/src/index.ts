import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated//prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter })

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Badminton Club API is running!');
});

app.get('/groups', async (req, res) => {
  const groups = await prisma.group.findMany();
  res.json(groups);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});