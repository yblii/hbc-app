import { Router } from "express";
import groupRouter from "./group.routes";
import userRouter from "./users.routes";
import { attatchUser } from "../middleware/attatchUser";

const router = Router();

router.use('/groups', attatchUser, groupRouter);
router.use('/users', userRouter);

export default router;