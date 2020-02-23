
import express from 'express';
const router = express.Router();
import apiRouter from './api/index.js';

router.use('/api', apiRouter);

export default router;