import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  
  // Store current value in ref
  useEffect(() => {
      ref.current = value;  
  }, [value]); // Only re-run if value changes
  
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

/**
 * @props:
 *    onSubmitCreated(data)
 *    onSubmitEdited(data)
 *    articleToEdit
 * 
 * @state:
 *    title
 *    body
 *    author
 */
function Form(props) {
  const [formFields, setFormFields] = useState({ title: '', body: '', author: '' });
  // Get the previous value (was passed into hook on last render)
  const prevArticleToEdit = usePrevious(props.articleToEdit);

  const handleSubmit = () => {
    /*
    props.onSubmitEdited will
    1. dispatch 'SUBMIT_EDITED_ARTICLE' action to home reducer, which will
    2. set the home reducer state 
      a. state.home.articles set to all articles, including the updated article
      b. state.home.articleToEdit set to undefined
    3. map the home reducer state to function props 
      a. Home function props.articles set to state.home.articles 
      b. Form function props.articleToEdit set to state.home.articleToEdit 
    */  
    if(props.articleToEdit != undefined) {
      axios.patch(`http://localhost:8000/api/articles/${props.articleToEdit._id}`, { ...formFields })
        .then((res) => props.onSubmitEdited(res.data))
        .then(() => setFormFields({ title: '', body: '', author: '' }));
    } else {
    /*
     props.onSubmitCreated will
     1. dispatch 'SUBMIT_CREATED_ARTICLE' action to home reducer, which will
     2. set the home reducer state to all articles, including the newly created article
     3. map the home reducer state.articles to the Home function props.articles
     */
      axios.post('http://localhost:8000/api/articles', { ...formFields })
        .then((res) => props.onSubmitCreated(res.data))
        .then(() => setFormFields({ title: '', body: '', author: '' }));
    }
  }

  const handleChangeField = (key, event) => {
    setFormFields({...formFields, [key]: event.target.value })
  };

  /**
  * Reset state when props change
  */
  useEffect(() => {
    if(prevArticleToEdit == undefined && props.articleToEdit != undefined) {
      setFormFields({
        title: props.articleToEdit.title,
        body: props.articleToEdit.body,
        author: props.articleToEdit.author        
      })
    }
  }, [props.articleToEdit]);

  return (
    <div className="col-12 col-lg-6 offset-lg-3">
      <input
        onChange={(ev) => handleChangeField('title', ev)}
        value={formFields.title}
        className="form-control my-3"
        placeholder="Article Title"
      />
      <textarea
        onChange={(ev) => handleChangeField('body', ev)}
        value={formFields.body}
        className="form-control my-3"
        placeholder="Article Body">
      </textarea>
      <input
        onChange={(ev) => handleChangeField('author', ev)}
        value={formFields.author}
        className="form-control my-3"
        placeholder="Article Author"
      />

      <button onClick={handleSubmit} className="btn btn-primary float-right">
        {props.articleToEdit ? 'Update' : 'Submit'}
      </button>
    </div>
  )
}

/**
mapStateToProps
@param state the DefaultRootState that contains the combined reducers' states under their names e.g. "home" for the home reducer's state
@param ownProps? optional
@returns object mapping the connected component's props as keys to values of the DefaultRootState
  key: Form function's props.articleToEdit 
  value: the home reducer's state.articleToEdit 
*/
const mapStateToProps = (state) => ({
  articleToEdit: state.home.articleToEdit
})
/**
mapDispatchToProps
@param dispatch Store function that takes an Action (object representing "what changed" with a mandatory 'type' key) and returns home reducer's state
@param ownProps? optional
@returns mapping the connected component's prop functions as keys to values of dispatch functions that take Action parameters and return part of the home reducer's state
  key: Form function's CRUD functions (onSubmitCreated, onSubmitEdited)
  value: the home reducer's dispatch actions/functions that take Action parameters and return home reducer's state 
*/
const mapDispatchToProps = (dispatch) => ({
  onSubmitCreated: data => dispatch({ type: 'SUBMIT_CREATED_ARTICLE', data }), /* returns state `articles` => Home props */
  onSubmitEdited: data => dispatch({ type: 'SUBMIT_EDITED_ARTICLE', data }),    /* returns state `articles` => Home props, `articleToEdit` => Form props */
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
