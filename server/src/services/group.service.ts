import type { Prisma } from '../../generated/prisma/browser';
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
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { groupId: true }
        });
        
        let cleanup = null;
        if(user?.groupId) {
            cleanup = await _disconnectAndCleanup(userId, user.groupId, tx);
        }

        const newGroup = await tx.group.create({
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

        return { group: newGroup, cleanup };
    })
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
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: { groupId: true }
        });

        const group = await tx.group.findUnique({
            where: { id: groupId },
            include: { 
                players: { select: { id: true, firstName: true } } 
            }
        })

        if(!group) { throw new Error("GroupNotFound") };
        if(group.players.length >= 4) { throw new Error("GroupFull"); }

        let cleanup = null;
        if(user?.groupId) {
            // If already in this group, just return the current state
            if(user.groupId === groupId) { 
                return { group, cleanup: null }; 
            }
            // Otherwise, leave the old group first
            cleanup = await _disconnectAndCleanup(userId, user.groupId, tx);
        }

        const updatedGroup = await tx.group.update({
            where: { id: groupId },
            data: {
                players: { connect: { id: userId } }
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

        return { group: updatedGroup, cleanup };
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

        if(!user || !user.groupId) { throw new Error("UserNotInGroup");}
        if(user.groupId !== groupId) { throw new Error("WrongGroup"); }

        return _disconnectAndCleanup(user.id, groupId, tx);
    }) 
}

async function _disconnectAndCleanup(userId: number, groupId: number, tx: Prisma.TransactionClient) {
    // 1. Disconnect the user
    await tx.user.update({
        where: { id: userId },
        data: { groupId: null }
    });

    // 2. Atomically delete the group ONLY if it has no players left
    const { count } = await tx.group.deleteMany({
        where: {
            id: groupId,
            players: { none: {} }
        }
    });

    if (count > 0) {
        return { type: 'DELETED', groupId };
    }

    // 3. If not deleted, return the updated group state
    const group = await tx.group.findUnique({
        where: { id: groupId },
        include: {
            players: { select: { id: true, firstName: true } }
        }
    });

    return { type: 'UPDATED', group };
}