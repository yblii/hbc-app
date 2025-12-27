import { Router } from "express";
import * as GroupController from '../controllers/group.controller';

const groupRouter = Router();

groupRouter.get('/', GroupController.getGroups);
groupRouter.post('/', GroupController.createGroup);

export default groupRouter;
