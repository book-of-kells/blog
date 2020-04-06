import React, { useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import { Article, ArticleFormHeader } from '../../components/Article';

/**
 * @props:
 *    onLoad(data)
 *    onDelete(articleId)
 *    setEdit(article)
 *    articles
 */
const Home = (props) => {
  const { authState, authService } = useOktaAuth();
  /*
  var authState;
  var authService;
  if(useOktaAuth() != undefined) {
    const result = useOktaAuth()
    authState = result.authState;
    authService = result.authService;
    console.log(`authService ${authService}`)
  } */

  if (authState && authState.isPending) { 
    return <div>Loading...</div>;
  }

  const button = authState && authState.isAuthenticated && authService && authService.login ?
    <button onClick={() => {authService.logout()}}>Logout</button> :
    <button onClick={() => {authService.login()}}>Login</button>;


  useEffect(() => {
    /**
     * props.onLoad will
     * 1. dispatch 'HOME_PAGE_LOADED' action to home reducer, which will
     * 2. set the articles home reducer state to all articles
     * 3. map the home reducer state.articles to Home function's props.articles
     */
    axios('http://localhost:8000/api/articles')
      .then((res) => props.onLoad(res.data));
  }, [])
  
  const handleEdit = (article) => { 
    /**
     * props.setEdit will
     * 1. dispatch 'SET_EDIT' action to home reducer, which will
     * 2. set the articleToEdit home reducer state to this article, which will
     * 3. map the home reducer state.articleToEdit to the Form component props.articleToEdit
     */
    props.setEdit(article)
  };
  
  const handleDelete = async (id) => { 
    /**
     * props.onDelete will
     * 1. dispatch 'DELETE_ARTICLE' action to home reducer, which will
     * 2. set the articles home reducer state to all articles except the one with this id
     * 3. map the home reducer state.articles to this Home function's props.articles
     */
    await axios.delete(`http://localhost:8000/api/articles/${id}`);
    props.onDelete(id);
  };
  
  return authState && authState.isAuthenticated ? (
    <div className="container">
      <ArticleFormHeader /> {/* This contains the Form component */}
      <div className="row pt-5">
        <div className="col-12 col-lg-6 offset-lg-3">{
          props.articles.map((article) => {
            return <Article key={article._id} 
                            article={article} 
                            handleDelete={handleDelete} 
                            handleEdit={handleEdit} />
          })
        }</div>
      </div>
    </div>
  ) : (
    <div>
      <Link to='/'>Home</Link><br/>
      {/* <Link to='/login'>Login</Link><br/> */}
      <Link to='/protected'>Protected</Link><br/>
      {button}
    </div>
  );
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
  articles: state.home.articles, // maps the home reducer's state.articles to Home function's props.articles
});

/**
mapDispatchToProps
@param dispatch Store function that takes an Action (object representing "what changed" with a mandatory 'type' key) and returns part of the home reducer's state
@param ownProps? optional
@returns mapping the connected component's prop functions as keys to values of dispatch functions that take Action parameters and return part of the home reducer's state
  key: Home function's CRUD functions (onLoad, onDelete, setEdit)
  value: the home reducer's dispatch actions/functions that take Action parameters and return home reducer's state 
*/
const mapDispatchToProps = (dispatch) => ({ 
  onLoad: (data) => dispatch({ type: 'HOME_PAGE_LOADED', data }), /* returns state      `articles` => Home props */
  onDelete: (id) => dispatch({ type: 'DELETE_ARTICLE', id }),     /* returns state      `articles` => Home props */
  setEdit: (article) => dispatch({ type: 'SET_EDIT', article }),  /* returns state `articleToEdit` => Form props */
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
