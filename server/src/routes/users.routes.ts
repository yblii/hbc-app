import { Router } from "express";
import * as UserController from '../controllers/user.controller';

const userRouter = Router();
userRouter.patch('/me', UserController.updateCurrentUser);
userRouter.get('/me', UserController.getCurrentUser);

export default userRouter;