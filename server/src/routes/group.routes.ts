import { Router } from "express";
import * as GroupController from '../controllers/group.controller';

const groupRouter = Router();

groupRouter.get('/', GroupController.getGroups);
groupRouter.post('/', GroupController.createGroup);
groupRouter.post('/:groupId/join', GroupController.addToGroup);
groupRouter.post('/:groupId/leave', GroupController.removeFromGroup);

export default groupRouter;
