export default (state={articles: []}, action) => {
  switch(action.type) {
    case 'HOME_PAGE_LOADED':
      return { ...state, articles: action.data.articles }
    case 'DELETE_ARTICLE':
      return { ...state, articles: state.articles.filter((article) => article._id !== action.id) }
    case 'SET_EDIT':
      return { ...state, articleToEdit: action.article }
    case 'SUBMIT_EDITED_ARTICLE':
      const updatedArticlesArray = state.articles.map((oldArticle) => oldArticle._id === action.data.article._id ? action.data.article : oldArticle )
      return { ...state, articleToEdit: undefined, articles: updatedArticlesArray }
    case 'SUBMIT_CREATED_ARTICLE':
      return { ...state, articles: ([action.data.article]).concat(state.articles) }
    default:
      return state;
  }
};