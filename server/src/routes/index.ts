import { Router } from "express";
import groupRouter from "./group.routes";

const router = Router();

router.use('/groups', groupRouter);

export default router;