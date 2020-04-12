import mongoose from 'mongoose';
import express from 'express';

const articlesRouter = express.Router();
const Articles = mongoose.model('Articles');


const readListCallback = (req, res, next) => {
  return Articles.find()
    .sort({ createdAt: 'descending' })
    .then((articles) => res.json({ articles: articles.map(article => article.toJSON()) }))
    .catch((next) => {console.log(next)});
}

const paramCallback = (req, res, next, id) => {
  return Articles.findById(id, (err, article) => {
    if(err) {
      return res.sendStatus(404);
    } else if(article) {
      req.article = article;
      return next();
    }
  }).catch(next);
}

const readOneCallback = (req, res, next) => {
  return res.json({
    article: req.article.toJSON(),
  });
}

const deleteCallback = (req, res, next) => {
  return Articles.findByIdAndRemove(req.article._id)
    .then(() => res.sendStatus(200))
    .catch(next);
}

const createCallback = (req, res, next) => {
  const { body } = req;

  if(!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required',
      },
    });
  }

  if(!body.author) {
    return res.status(422).json({
      errors: {
        author: 'is required',
      },
    });
  }

  if(!body.body) {
    return res.status(422).json({
      errors: {
        body: 'is required',
      },
    });
  }

  const finalArticle = new Articles(body);
  return finalArticle.save()
    .then(() => res.json({ article: finalArticle.toJSON() }))
    .catch(next);
}

const updateCallback = (req, res, next) => {
  const { body } = req;

  if(typeof body.title !== 'undefined') {
    req.article.title = body.title;
  }

  if(typeof body.author !== 'undefined') {
    req.article.author = body.author;
  }

  if(typeof body.body !== 'undefined') {
    req.article.body = body.body;
  }

  return req.article.save()
    .then(() => res.json({ article: req.article.toJSON() }))
    .catch(next);
}

articlesRouter.param('id', paramCallback);
articlesRouter.get('/:id', readOneCallback);
articlesRouter.delete('/:id', deleteCallback);
articlesRouter.get('/', readListCallback);
articlesRouter.post('/', createCallback);
articlesRouter.patch('/:id', updateCallback);

export default articlesRouter;