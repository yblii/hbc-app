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