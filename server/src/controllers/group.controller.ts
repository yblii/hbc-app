import type { Request, Response } from "express";
import * as GroupService from '../services/group.service';

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Get all groups
 *     description: Retrieve a list of all groups
 *     tags:
 *       - Groups
 *     responses:
 *       200:
 *         description: List of all groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       500:
 *         description: Server error
 */
export async function getGroups(req: Request, res: Response) {
    try {
        const groups = await GroupService.getGroups();
        return res.json(groups);
    } catch(error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({ error: "Failed to fetch groups" });
    }
}

/**
 * @openapi
 * /groups:
 *   post:
 *     summary: Create a new group
 *     description: Create a new group with the current user as creator
 *     tags:
 *       - Groups
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 */
export async function createGroup(req: Request, res: Response) {
    try {
        const userId = req.userId!;

        const group = await GroupService.createGroup(userId);
        const loc = `/groups/${group.id}`;

        // sends 201 CREATED and location of group resource
        res.location(loc).status(201).send(group);
    } catch(error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ error: "Failed to create group" });
    }
}

/**
 * @openapi
 * /groups/{groupId}/join:
 *   post:
 *     summary: Join a group
 *     description: Add the current user to a group
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group to join
 *       - in: header
 *         name: userId         
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user joining the group
 *     responses:
 *       200:
 *         description: Successfully joined the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Invalid group ID
 *       500:
 *         description: Server error
 */
export async function addToGroup(req: Request, res: Response) {
    const userId = req.userId!;

    const { groupId: rawGroupId } = req.params;
    if (!rawGroupId) {
        return res.status(400).json({ error: "Group ID is required" });
    }

    const groupId = parseInt(rawGroupId, 10);

    if (isNaN(groupId)) {
        return res.status(400).json({ error: "Group ID must be a number" });
    }
    
    try {
        const group = await GroupService.addToGroup(userId, groupId);
        return res.status(200).json(group);
    } catch(error) {
        console.error('Error joining group:', error);
        return res.status(500).json({ error: "Failed to join group" });
    }
}

/**
 * @openapi
 * /groups/{groupId}/leave:
 *   post:
 *     summary: Leave a group
 *     description: Remove the current user from a group
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group to leave
 *       - in: header
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user leaving the group
 *     responses:
 *       200:
 *         description: Successfully left the group
 *       400:
 *         description: Invalid group ID
 *       500:
 *         description: Server error
 */
export async function removeFromGroup(req: Request, res: Response) {
    const userId = req.userId!;

    const { groupId: rawGroupId } = req.params;
    if (!rawGroupId) {
        return res.status(400).json({ error: "Group ID is required" });
    }

    const groupId = parseInt(rawGroupId, 10);

    if (isNaN(groupId)) {
        return res.status(400).json({ error: "Group ID must be a number" });
    }

    try {
        const response = await GroupService.removeFromGroup(userId, groupId);
        return res.status(200).json(response);
    } catch(error) {
        console.error('Error leaving group:', error);
        return res.status(500).json({ error: "Failed to leave group" });
    }
}