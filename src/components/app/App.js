import React from 'react';
import ReactDOM from 'react-dom';
import UserPage from '../../components/user/User';
import SignInPage from '../../components/signIn/signInPage';
import SignUpPage from '../../components/signUp/signUpPage';
import notFoundPage from '../../components/notFoundPage';
import socket from 'socket.io-client';
import SocketContext from '../../socket_context';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import * as config from '../../config.js';
import * as Utilities from '../../utils/utilities.js';

const wsURL = [config.serverUrl, ":", config.serverPort].join('');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wsConnected : false,
      token : '',
      user : {},
    }
  }

  updateValue = (key, val) => {
    this.setState({[key]: val});
    if(key === 'user') {
      this.io.emit("email", val.email);
    }
  }

  io = socket(wsURL, {
    secure: true,
    rejectUnauthorized: false,
  })

  componentDidMount() {
    this.io.onopen = () => {
      console.log('WebSocket client connected')
      this.setState({wsConnected : true})
    }

    this.io.onclose = () => {
      console.log('WebSocket client disconnected')
      this.io = socket(wsURL, {
        secure: true,
        rejectUnauthorized: false,
      })
      this.setState({
        socket_connected : false
      })
    }

    this.io.onerror = error => {
      try {
        this.io = socket(wsURL, {
          secure: true,
          rejectUnauthorized: false,
        })
        this.setState({
          wsConnected : false
        })

      } catch(e) {
        console.log("WebSocket Error : " + e.message);
      }
    }
  }

  render() {
    return (
      <SocketContext.Provider  value={{
                                state: this.state, 
                                updateValue: this.updateValue,
                                io : this.io,
                                token : this.state.token,
                                wsconnected : this.state.wsConnected,
                                user : this.state.user,
                                history : this.history,
                              }}>
        <Router>
          <Switch>
            <Route exact path="/" render={() => (
              Utilities.isLoggedIn() ? (
              <Redirect to='/user' />
              ) : (
              <SignInPage/>
              )
              )} 
            />
            <Route exact path="/login" render={() => (
              Utilities.isLoggedIn() ? (
              <Redirect to='/user' />
              ) : (
              <SignInPage/>
              )
              )} 
            />
            <Route path="/user" render={() => (
              !Utilities.isLoggedIn() ? (
              <Redirect to='/login' />
              ) : (
              <UserPage/>
              )
              )} 
            />
            <Route path="/signUp" render={() => (
              Utilities.isLoggedIn() ? (
              <Redirect to='/user' />
              ) : (
              <SignUpPage/>
              )
              )} 
            />
            <Route path="*" component={notFoundPage} />
          </Switch>
        </Router>
      </SocketContext.Provider>
    );
  }
}

export default App;

ReactDOM.render(<App/>, document.getElementById("root"))
