import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorHandler from 'errorhandler';
import mongoose from 'mongoose';
import morgan from 'morgan';

import ArticlesSchema from './models/Articles.js';
// const ArticlesSchema = models.Articles;
import router from './routes/index.js';

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/lightblog');
mongoose.set('debug', true);


app.use(router);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'LightBlog', 
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));

if(!isProduction) {
    app.use(errorHandler());
}
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});  

app.use((req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: isProduction ? {} : err,
        }
    })
});

const server = app.listen(8000, () => console.log('server started on port 8000'));
