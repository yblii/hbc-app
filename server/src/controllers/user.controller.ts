import * as UserService from '../services/user.service'
import type { Request, Response } from 'express';

/**
 * @openapi
 * /webhooks/user-created:
 *   post:
 *     summary: Auth0 webhook for user creation
 *     description: Handles Auth0 webhook to sync newly created users to the database
 *     tags:
 *       - Webhooks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auth0Id:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Webhook received, user created
 *       403:
 *         description: Invalid webhook secret
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update current user
 *     description: Update the current user's profile information (firstName, lastName)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the current user's profile information
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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