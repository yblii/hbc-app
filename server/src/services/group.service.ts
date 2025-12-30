import { group } from 'node:console';
import { prisma } from '../lib/prisma';

// returns all groups in ascending order by the time they joined the queue
export async function getGroups() {
    const groups = await prisma.group.findMany({
        include: {
            players: {
                select: {
                    id: true,
                    firstName: true,
                }
            }
        },
        orderBy: {
            queueJoinTime: 'asc'
        }
    });
    
    return groups;
}

// Creates a new group and automatically adds the given user to the group
// Returns: created Group with player
// Parameters: User's auth0Id
export async function createGroup(authId: string) {
    const newGroup = await prisma.group.create({
        data: {
            players:{
                // connects user with given auth0Id to group
                connect: { auth0Id: authId }
            }
        },
        include: {
            players: true
        }
    });

    return newGroup;
}

// Given a user's id and group id, adds user to given group
// Returns: user and group
export async function addToGroup(authId: string, groupId: number) {
    return await prisma.$transaction(async (tx) => {
        const group = await tx.group.findUnique({
            where: {
                id: groupId
            },
            include: {
                _count: {
                    select: {
                        players: true
                    }
                }
            }
        })

        if(!group) {
            throw new Error("GroupNotFound");
        }

        if(group._count.players >= 4) {
            throw new Error("GroupFull");
        }

        const updatedUser = await tx.user.update({
            where: {
                auth0Id: authId
            },
            data: {
                group: {
                    connect: {
                        id: groupId
                    }
                }
            },
            include: {
                group: true
            }
        })

        return updatedUser;
    })
}

// Given a user's id, removes user from their group
// Returns: user and group
export async function removeFromGroup(authId: string, groupId: number) {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: {
                auth0Id: authId
            },
            select: {
                id: true,
                groupId: true
            }
        });

        if(!user || !user.groupId) {
            throw new Error("UserNotInGroup");
        }

        if(user.groupId !== groupId) {
            throw new Error("WrongGroup");
        }

        await tx.user.update({
            where: { id: user.id },
            data: {
                group: { disconnect: true }
            }
        });

        const remainingMembers = await tx.user.count({
            where: { groupId: groupId }
        });

        if (remainingMembers === 0) {
            await tx.group.delete({ where: { id: groupId } });
            return { 
                type: 'DELETED', 
                groupId: groupId
            };
        }

        // Scenario B: Group still exists (fetch fresh data to be safe)
        const updatedGroup = await tx.group.findUnique({
            where: { id: groupId },
            include: { players: true }
        });

        return { 
            type: 'UPDATED', 
            group: updatedGroup 
        };
    }) 

}