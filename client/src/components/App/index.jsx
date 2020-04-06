import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

import { Home } from '../../components';
import { Login } from '../../components/Home/Login';

// import Protected from './Protected';

const App = (props) => {
  const onAuthRequired = () => { 
    props.history.push('/login');
  }
  /* return (
     <Switch>
       <Route exact path="/" component={Home} />
     </Switch>
   )
  */

  return (
    <Security issuer='https://dev-734965.okta.com/oauth2/default'
        clientId='0oa2zv53kgvMPss7q4x6'
        redirectUri={window.location.origin + '/implicit/callback'}
        onAuthRequired={onAuthRequired}
        pkce={true} >
      <Route exact path="/" component={Home} />
      {/* <SecureRoute path='/protected' component={Protected} /> */}
      <Route path='/login' render={() => <Login issuer='https://dev-734965.okta.com/oauth2/default' />} />
      <Route path='/implicit/callback' component={LoginCallback} />
    </Security>
  )
}

export default withRouter(App);
