import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from '../../components/user/User';
import SignInPage from '../../components/signIn/signInPage';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
  
const routing = (
  <Router>
    <Switch>  
          <Route exact path="/" component={SignInPage} />  
          <Route exact path="/login" component={SignInPage} />  
          <Route path="/user" component={UserPage} />  
    </Switch>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))
