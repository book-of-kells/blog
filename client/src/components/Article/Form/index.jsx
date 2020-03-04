import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      author: '',
    }

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.articleToEdit && this.props.articleToEdit != prevProps.articleToEdit) {
      this.setState({
        title: this.props.articleToEdit.title,
        body: this.props.articleToEdit.body,
        author: this.props.articleToEdit.author,
      });
    }
  }

  handleSubmit(){
    /* const { onSubmit, articleToEdit, onEdit } = this.props; */
    const { title, body, author } = this.state;

    if(!this.props.articleToEdit) {
      return axios.post('http://localhost:8000/api/articles', {
        title,
        body,
        author,
      })
        .then((res) => this.props.onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    } else {
      return axios.patch(`http://localhost:8000/api/articles/${this.props.articleToEdit._id}`, {
        title,
        body,
        author,
      })
        .then((res) => this.props.onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '' }));
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
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

const mapDispatchToProps = (dispatch) => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_CREATED_ARTICLE', data }),
  onEdit: data => dispatch({ type: 'SUBMIT_EDITED_ARTICLE', data }),
});

const mapStateToProps = (state) => ({
  articleToEdit: state.home.articleToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);