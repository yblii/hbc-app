import * as UserService from '../services/user.service'
import type { Request, Response } from 'express';

// Webhook handling syncing user registration with Auth0 to database
export async function handleUserCreation(req: Request, res: Response) {
    // ensure that request is coming from Auth0
    const secretRecieved = req.headers['x-webhook-secret'];
    const mySecret = process.env.AUTH0_WEBHOOK_SECRET;

    if(secretRecieved !== mySecret) {
        return res.status(403).json({ error: 'Invalid secret' });
    }

    const { auth0Id, email } = req.body;

    try {
        await UserService.createUser(email, auth0Id);
        console.log(`User ${email} synced to database`);

        res.status(201).send('Webhook received, user created');
    } catch(error) {
        console.error("Webhook error: " + error);
        res.status(500).json({ error: error });
    }
}

export async function updateCurrentUser(req: Request, res: Response) {
    const { firstName, lastName } = req.body;

    const userId = req.auth?.payload.sub;

    if(!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await UserService.patchUser(userId, firstName, lastName);
        return res.status(200).json(user);
    } catch(err) {
        console.error("Error updating user:" + err);
        res.status(500).json({ error: err });
    }
}

export async function getCurrentUser(req: Request, res: Response) {
    const userId = req.auth?.payload.sub;

    if(!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await UserService.getUser(userId);

        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch(err) {
        console.error('Error getting user:' + err);
        res.status(500).json({ error: err });
    }
}