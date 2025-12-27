import { Router } from 'express';
import * as WebhookController from '../controllers/webhook.controller';

const webhookRouter = Router();
webhookRouter.post('/user-created', WebhookController.handleUserCreation);

export default webhookRouter;