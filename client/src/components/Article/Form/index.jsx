import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import store from '../../../store';

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

    // bind() called on these methods since they are ?? (todo)
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /** re-setting state when props change used to be handled by
   * componentWillReceiveProps(nextProps) {
   *   if(nextProps.articleToEdit != undefined) {
   *     this.setState({ ...nextProps.articleToEdit })
   *   }
   * }
   * ... but since componentWillReceiveProps is unsafe, changed it to 
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

  handleSubmit() {  
    if(this.props.articleToEdit != undefined) {
      axios.patch(`http://localhost:8000/api/articles/${this.props.articleToEdit._id}`, { ...this.state })
        .then((res) => this.props.onSubmitEdited(res.data))  // this will 
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
      axios.post('http://localhost:8000/api/articles', { ...this.state })
        .then((res) => this.props.onSubmitCreated(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    }
  }

  handleChangeField(key, event) {
    this.setState({ [key]: event.target.value })
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
@param dispatch Store function that takes an Action (object representing "what changed" with a mandatory 'type' key) and returns part of the home reducer's state
@param ownProps? optional
@returns mapping the connected component's prop functions as keys to values of dispatch functions that take Action parameters and return part of the home reducer's state
  key: this (Form) component's CRUD functions (onSubmitCreated, onSubmitEdited)
  value: the home reducer's dispatch actions/functions that take Action parameters and return home reducer's state 
*/
const mapDispatchToProps = (dispatch) => ({
  onSubmitCreated: data => dispatch({ type: 'SUBMIT_CREATED_ARTICLE', data }), /* returns state `articles` => Home component props */
  onSubmitEdited: data => dispatch({ type: 'SUBMIT_EDITED_ARTICLE', data }),    /* returns state `articles` => Home props, `articleToEdit` => Form props */
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);