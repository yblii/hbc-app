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

        res.status(200).send('Webhook received');
    } catch(error) {
        console.error("Webhook error: " + error);
        res.status(500).send('Server error');
    }
}