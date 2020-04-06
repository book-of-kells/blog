import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

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
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '', body: '', author: '' }
    /**
     * handleSubmit.bind() creates an identical handleSubmit function
     * that is bound to the specific Form component instance.
     * Within the bound handleSubmit function, the `this` object can refer to properties of the 
     * Form component instance, such as `this.props.onSubmitCreated` and `this.props.onSubmitEdited`.
     */
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    /*
     this.props.onSubmitEdited will
     1. dispatch 'SUBMIT_EDITED_ARTICLE' action to home reducer, which will
     2. set the home reducer state 
        a. state.home.articles set to all articles, including the updated article
        b. state.home.articleToEdit set to undefined
     3. map the home reducer state to component props 
        a. Home function's props.articles set to state.home.articles 
        b. Form component props.articleToEdit set to state.home.articleToEdit 
     */
    if(this.props.articleToEdit != undefined) {
      axios.patch(`http://localhost:8000/api/articles/${this.props.articleToEdit._id}`, { ...this.state })
        .then((res) => this.props.onSubmitEdited(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
    /*
     this.props.onSubmitCreated will
     1. dispatch 'SUBMIT_CREATED_ARTICLE' action to home reducer, which will
     2. set the home reducer state to all articles, including the newly created article
     3. map the home reducer state.articles to the Home function's props.articles
     */
      axios.post('http://localhost:8000/api/articles', { ...this.state })
        .then((res) => this.props.onSubmitCreated(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    }
  }

  handleChangeField(key, event) {
    this.setState({ [key]: event.target.value })
  }

  /** Re-setting state when props change used to be handled by
  * 
  * componentWillReceiveProps(nextProps) {
  *   if(nextProps.articleToEdit != undefined) {
  *     this.setState({ ...nextProps.articleToEdit })
  *   }
  * }
  * But since componentWillReceiveProps is unsafe, changed it to componentDidUpdate.
  */
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.articleToEdit == undefined && this.props.articleToEdit != undefined) {
      this.setState({ 
        title: this.props.articleToEdit.title,
        body: this.props.articleToEdit.body,
        author: this.props.articleToEdit.author
      })
    }
  }

  render() {
    return (
      <div className="col-12 col-lg-6 offset-lg-3">
        <input
          onChange={(ev) => this.handleChangeField('title', ev)}
          value={this.state.title}
          className="form-control my-3"
          placeholder="Article Title"
        />
        <textarea
          onChange={(ev) => this.handleChangeField('body', ev)}
          value={this.state.body}
          className="form-control my-3"
          placeholder="Article Body">
        </textarea>
        <input
          onChange={(ev) => this.handleChangeField('author', ev)}
          value={this.state.author}
          className="form-control my-3"
          placeholder="Article Author"
        />

        <button onClick={this.handleSubmit} className="btn btn-primary float-right">
          {this.props.articleToEdit ? 'Update' : 'Submit'}
        </button>
      </div>
    )
  }
}

/**
mapStateToProps
@param state the DefaultRootState that contains the combined reducers' states under their names e.g. "home" for the home reducer's state
@param ownProps? optional
@returns object mapping the connected component's props as keys to values of the DefaultRootState
  key: this (Home) component's props.articleToEdit 
  value: the home reducer's state.articleToEdit 
*/
const mapStateToProps = (state) => ({
  articleToEdit: state.home.articleToEdit,  // maps the home reducer's state.articleToEdit to this (Form) component's props.articleToEdit
})

/**
mapDispatchToProps
@param dispatch Store function that takes an Action (object representing "what changed" with a mandatory 'type' key) and returns home reducer's state
@param ownProps? optional
@returns mapping the connected component's prop functions as keys to values of dispatch functions that take Action parameters and return part of the home reducer's state
  key: this (Form) component's CRUD functions (onSubmitCreated, onSubmitEdited)
  value: the home reducer's dispatch actions/functions that take Action parameters and return home reducer's state 
*/
const mapDispatchToProps = (dispatch) => ({
  onSubmitCreated: data => dispatch({ type: 'SUBMIT_CREATED_ARTICLE', data }), /* returns state `articles` => Home function's props */
  onSubmitEdited: data => dispatch({ type: 'SUBMIT_EDITED_ARTICLE', data }),    /* returns state `articles` => Home props, `articleToEdit` => Form props */
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);