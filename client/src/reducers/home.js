export default (state={articles: []}, action) => {
  console.log(`action.type: ${action.type}`);
  switch(action.type) {
    /** first three are for Home component */
    case 'HOME_PAGE_LOADED':
      return {
        ...state,
        articles: action.data.articles,
      };
    case 'DELETE_ARTICLE':
      return {
        ...state,
        articles: state.articles.filter((article) => article._id !== action.id),
      };
    case 'SET_EDIT':
      return {
        ...state,
        articleToEdit: action.article,
      };
    /** next two are for Form component */
    case 'SUBMIT_EDITED_ARTICLE':
      return {
        ...state,
        articleToEdit: undefined,
        articles: state.articles.map((article) => {
          if(article._id === action.data.article._id) {
            return {...action.data.article,}
          }
          return article;
        }),
      }
    case 'SUBMIT_CREATED_ARTICLE':
      return {
        ...state,
        articles: ([action.data.article]).concat(state.articles),
      }
    default:
      return state;
  }
};