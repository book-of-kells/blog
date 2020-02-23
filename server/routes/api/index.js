import express from 'express';
import articlesRouter from './articles.js'; 
const apiRouter = express.Router();

apiRouter.use('/articles', articlesRouter);

export default apiRouter;