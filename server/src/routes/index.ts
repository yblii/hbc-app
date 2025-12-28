import { Router } from "express";
import groupRouter from "./group.routes";
import userRouter from "./users.routes";

const router = Router();

router.use('/groups', groupRouter);
router.use('/users', userRouter);

export default router;