import express from 'express';
import { healthRoutes } from '../modules/health/index.js';
import { todoRoutes } from '../modules/todo/index.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/todos', todoRoutes);

export default router;
