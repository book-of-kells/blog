import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';

// import { Form } from '../../components/Article';
import { Article, ArticleFormHeader } from '../../components/Article';
/*
class ArticleFormHeader extends React.PureComponent {
  render() {
    return (
      <div className="row pt-5">
        <div className="col-12 col-lg-6 offset-lg-3">
          <h1 className="text-center">LightBlog</h1>
        </div>
        <Form />
      </div>
    )
  }
}
class Article extends React.PureComponent {
  render() {
    const { article, handleDelete, handleEdit } = this.props;
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
}
*/

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }
  componentDidMount() {
    axios('http://localhost:8000/api/articles')
      .then((res) => this.props.onLoad(res.data));
  }
  handleEdit(article) { 
    this.props.setEdit(article); 
  }
  async handleDelete(id) { 
    await axios.delete(`http://localhost:8000/api/articles/${id}`);
    return this.props.onDelete(id); 
  }
  render() {
    return (
      <div className="container">
        <ArticleFormHeader />
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            {this.props.articles.map((article) => {return <Article 
              key={article._id} 
              article={article}
              handleDelete={this.handleDelete}
              handleEdit={this.handleEdit} />
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  articles: state.home.articles,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);