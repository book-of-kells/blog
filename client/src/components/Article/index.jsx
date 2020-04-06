import React from 'react';
import moment from 'moment';

import Form from './Form';

export const ArticleFormHeader = (props) => {
    return (
      <div className="row pt-5">
        <div className="col-12 col-lg-6 offset-lg-3">
          <h1 className="text-center">LightBlog</h1>
        </div>
        <Form />
      </div>
    )
}

/**
 * @props:
 *    handleDelete(articleId)
 *    handleEdit(article)
 *    article
 */
export const Article = (props) => {
    const { article, handleDelete, handleEdit } = props;
    return (
      <div className="card my-3" >
        <div className="card-header">{article.title}</div>
        <div className="card-body">
          {article.body}
          <p className="mt-5 text-muted">
            <b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}
          </p>
        </div>
        <div className="card-footer">
          <div className="row">
          <button onClick={() => handleEdit(article)} className="btn btn-primary mx-3">                        
            Edit
          </button>
          <button onClick={() => handleDelete(article._id)} className="btn btn-danger">                        
            Delete
          </button>
          </div>
        </div>
      </div>
    )
}