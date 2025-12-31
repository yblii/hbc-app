import { prisma } from '../lib/prisma';

/**
 * Retrieves all groups from the database, ordered by their queue join time.
 * Includes a subset of player information (id, firstName) for each group.
 *
 * @returns A list of groups with their associated players.
 */
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

/**
 * Creates a new group and automatically adds the specified user to it.
 *
 * @param userId - The internal database ID of the user creating the group.
 * @returns The newly created group, including the player list.
 */
export async function createGroup(userId: number) {
    const newGroup = await prisma.group.create({
        data: {
            players:{
                // connects user with given auth0Id to group
                connect: { id: userId }
            }
        },
        include: {
            players: {
                select: {
                    id: true,
                    firstName: true,
                }
            }
        }
    });

    return newGroup;
}

/**
 * Adds a user to a specific group if the group exists and is not full.
 *
 * @param userId - The internal database ID of the user joining the group.
 * @param groupId - The ID of the group to join.
 * @returns The updated group including the player list.
 * @throws {Error} If the group is not found or is full (max 4 players).
 */
export async function addToGroup(userId: number, groupId: number) {
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

        return await tx.group.update({
            where: { id: groupId },
            data: {
                players: {
                    connect: { id: userId }
                }
            },
            include: {
                players: {
                    select: {
                        id: true,
                        firstName: true,
                    }
                }
            }
        });
    })
}

/**
 * Removes a user from a specific group.
 * If the group becomes empty after removal, the group is deleted.
 *
 * @param userId - The internal database ID of the user leaving the group.
 * @param groupId - The ID of the group the user is leaving.
 * @returns An object indicating whether the group was updated or deleted.
 * @throws {Error} If the user is not in the group or the group ID mismatches.
 */
export async function removeFromGroup(userId: number, groupId: number) {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: {
                id: userId
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