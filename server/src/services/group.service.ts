import { prisma } from '../lib/prisma';

export async function getGroups() {
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
    
    return groups;
}

export async function createGroup(userId: number) {
    const newGroup = await prisma.group.create({
        data: {
            players:{
                connect: { id: userId }
            }
        }
    });

    return newGroup;
}