import type { Request, Response } from "express";
import * as GroupService from '../services/group.service';

export async function getGroups(req: Request, res: Response) {
    try {
        const groups = await GroupService.getGroups();
        return res.json(groups);
    } catch(error) {
        console.error('Error fetching groups:', error);
        return res.status(500).json({ error: "Failed to fetch groups" });
    }
}

// Creates a group and adds the user who requested it to the group
// Sends url of new group and full entity
export async function createGroup(req: Request, res: Response) {
    try {
        const userId = req.userId!;

        const group = await GroupService.createGroup(userId);
        const loc = `/groups/${group.id}`;

        // sends 204 CREATED and location of group resource
        res.location(loc).status(201).send(group);
    } catch(error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ error: "Failed to create group" });
    }
}

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
        console.error('Error joining group:', error);
        return res.status(500).json({ error: "Failed to join group" });
    }
}