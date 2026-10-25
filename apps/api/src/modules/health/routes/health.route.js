import express from 'express';
import { healthCheck, readyCheck } from '../controllers/health.controller.js';

const router = express.Router();

router.get('/', healthCheck);
router.get('/ready', readyCheck);

export default router;
