import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Article, ArticleFormHeader } from '../../components/Article';

/**
 * @props:
 *    onLoad(data)
 *    onDelete(articleId)
 *    setEdit(article)
 *    articles
 */
class Home extends React.PureComponent {

  constructor(props) {
    super(props);

    // todo: bind() called on handleDelete and handleEdit because 
    // they are both mapped to dispatch actions??
    /**
     * For a given function, creates a bound function that has the same body as the original function.
     * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
     * param thisArg An object to which the this keyword can refer inside the new function.
     * param argArray A list of arguments to be passed to the new function.
     */
    // bind(this: Function, thisArg: any, ...argArray: any[]): any;
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    /**
     * this.props.onLoad will
     * 1. dispatch 'HOME_PAGE_LOADED' action to home reducer, which will
     * 2. set the articles home reducer state to all articles
     * 3. map the home reducer state.articles to this Home component props.articles
     */
    axios('http://localhost:8000/api/articles')
      .then((res) => this.props.onLoad(res.data));
  }
  
  handleEdit(article) { 
    /**
     * this.props.setEdit will
     * 1. dispatch 'SET_EDIT' action to home reducer, which will
     * 2. set the articleToEdit home reducer state to this article, which will
     * 3. map the home reducer state.articleToEdit to the Form component props.articleToEdit
     */
    this.props.setEdit(article);
  }
  
  async handleDelete(id) { 
    /**
     * this.props.onDelete will
     * 1. dispatch 'DELETE_ARTICLE' action to home reducer, which will
     * 2. set the articles home reducer state to all articles except the one with this id
     * 3. map the home reducer state.articles to this Home component props.articles
     */
    await axios.delete(`http://localhost:8000/api/articles/${id}`);
    this.props.onDelete(id);
  }
  
  render() {
    return (
      <div className="container">
        <ArticleFormHeader /> {/* This contains the Form component */}
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">{
            this.props.articles.map((article) => {
              return <Article key={article._id} 
                              article={article} 
                              handleDelete={this.handleDelete} 
                              handleEdit={this.handleEdit} />
            })
          }</div>
        </div>
      </div>
    );
  }
}

/**
mapStateToProps
@param state the DefaultRootState that contains the combined reducers' states under their names e.g. "home" for the home reducer's state
@param ownProps? optional
@returns object mapping the connected component's props as keys to values of the DefaultRootState
  key: this (Home) component's props.articles 
  value: the home reducer's state.articles 
*/
const mapStateToProps = (state) => ({
  articles: state.home.articles, // maps the home reducer's state.articles to this (Home) component's props.articles
});

/**
mapDispatchToProps
@param dispatch Store function that takes an Action (object representing "what changed" with a mandatory 'type' key) and returns part of the home reducer's state
@param ownProps? optional
@returns mapping the connected component's prop functions as keys to values of dispatch functions that take Action parameters and return part of the home reducer's state
  key: this (Home) component's CRUD functions (onLoad, onDelete, setEdit)
  value: the home reducer's dispatch actions/functions that take Action parameters and return home reducer's state 
*/
const mapDispatchToProps = (dispatch) => ({ 
  onLoad: (data) => dispatch({ type: 'HOME_PAGE_LOADED', data }), /* returns state      `articles` => Home props */
  onDelete: (id) => dispatch({ type: 'DELETE_ARTICLE', id }),     /* returns state      `articles` => Home props */
  setEdit: (article) => dispatch({ type: 'SET_EDIT', article }),  /* returns state `articleToEdit` => Form props */
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);