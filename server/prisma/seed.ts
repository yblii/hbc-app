import { PrismaClient } from '../generated//prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting seed...')

  // 1. CLEANUP: Wipe the database so we start fresh every time
  // (Order matters! Delete relations first)
  await prisma.user.deleteMany()
  await prisma.group.deleteMany()
  await prisma.court.deleteMany()
  console.log('🧹 Database cleared.')

  // 2. COURTS: Create the 4 physical courts
  await prisma.court.createMany({
    data: [
      { id: 1}, // Hardcoding IDs is handy for dev
      { id: 2},
      { id: 3},
      { id: 4},
    ],
  })
  console.log('🏸 Created 4 Courts.')

  // 3. PASSWORDS: Hash a default password for everyone
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 4. USERS: Create an Officer and some Members
  // We use 'create' here to let Prisma handle the relations
  
  // -- The Officer --
  await prisma.user.create({
    data: {
      email: 'officer@badminton.club',
      name: 'Chief Officer',
      password: hashedPassword,
      role: 'OFFICER',
      isPaid: true,
    },
  })

  // -- A Group playing on Court 1 --
  await prisma.group.create({
    data: {
      // Connect to Court 1
      court: { connect: { id: 1 } },
      
      // Create players and add them to this group instantly
      players: {
        create: [
          {
            email: 'player1@uw.edu',
            name: 'Alice',
            password: hashedPassword,
            isPaid: true,
          },
          {
            email: 'player2@uw.edu',
            name: 'Bob',
            password: hashedPassword,
            isPaid: true,
          },
        ],
      },
    },
  }) 
  
  // -- A Group Waiting in the Queue --
  await prisma.group.create({
    data: {
      players: {
        create: [
          { email: 'new1@uw.edu', name: 'Charlie', password: hashedPassword },
          { email: 'new2@uw.edu', name: 'David', password: hashedPassword },
        ],
      },
    },
  })

  console.log('👥 Created Users and Groups.')
  console.log('✅ Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })