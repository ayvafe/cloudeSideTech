import React from 'react';
import axios from 'axios'
import ReactDOM from 'react-dom';
import UserPage from './components/user/User';
import SignInPage from './components/signIn/signInPage';
import SignUpPage from './components/signUp/signUpPage';
import notFoundPage from './components/notFoundPage';
import socket from 'socket.io-client';
import SocketContext from './socket_context';
import { Route, Switch,  BrowserRouter as Router } from 'react-router-dom'
import * as Utilities from './utils/utilities.js';

const wsURL = [process.env.REACT_APP_SERVER_HOST, ":", process.env.REACT_APP_SERVER_PORT].join('');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wsConnected : false,
      token : '',
      user : {},
      logedIn : false,
    }
  }

  updateValue = (key, val) => {
    this.setState({[key]: val});
    if(key === 'user') {
      this.io.emit("email", val.email);
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevState.user !== this.state.user) {
      this.io = socket(wsURL)
      this.setIOEventHandlers();
    }
  }

  componentDidMount() {
    Utilities.isLoggedIn()
      .then(r => {
        if(r === true) {
          this.getUserInfo();
        } else {
          this.setState({ logedIn : false})
        }
      })
      .catch(() => {
        console.error('Error while authentification checking');
      })
  }

  setIOEventHandlers= () => { 
    this.io.on('connect', () => {
      console.log('WebSocket client connected')
      this.setState({wsConnected : true})
    });

    this.io.onclose = () => {
      console.log('WebSocket client disconnected')
      this.io = socket(wsURL)
      this.setState({ wsConnected : false })
    }

    this.io.onerror = error => {
      try {
        this.io = socket(wsURL)
        this.setState({ wsConnected : false })

      } catch(e) {
        console.log("WebSocket Error : " + e.message);
      }
    }
  }

  getUserInfo = () => {
    const url = [process.env.REACT_APP_SERVER_HOST, ":", process.env.REACT_APP_SERVER_PORT,"/login_with_token"].join('')
    const  t = localStorage.getItem('messenger-token')

    axios.get( url, { headers: { authorization : t }})
      .then(resp => {
        if(resp.data && resp.data.user) {
          resp = resp.data;
          this.updateValue("user", resp.user);
          this.setState({ logedIn : true })
        }
      })
      .catch(err => {
        console.log("Error to login", err)
      })
  }

  render() {
    return (
      <SocketContext.Provider  value={{
                                updateValue: this.updateValue,
                                io : this.io,
                                state : this.state,
                              }}>
        <Router>
          <Switch>
            <Route exact path="/" component={SignInPage}/>
            <Route path="/login" component={SignInPage}/>
            <Route path="/user" component={UserPage}/>
            <Route path="/signUp" component={SignUpPage}/>
            <Route path="*" component={notFoundPage} />
          </Switch>
        </Router>
      </SocketContext.Provider>
    );
  }
}

export default App;

ReactDOM.render(<App/>, document.getElementById("root"))
