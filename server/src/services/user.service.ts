import { prisma } from '../lib/prisma'

export async function createUser(email: string, auth0Id: string) {
    const user = await prisma.user.create({
        data: {
            email: email,
            auth0Id: auth0Id
        }
    });

    return user;
}

export async function patchUser(userId: string, firstName: string, lastName: string) {
    const updatedUser = await prisma.user.update({
        where: {
            auth0Id: userId
        },
        data: {
            firstName: firstName,
            lastName: lastName
        }
    });
    
    return updatedUser;
}

export async function getUser(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            auth0Id: userId
        }
    })

    return user;
}