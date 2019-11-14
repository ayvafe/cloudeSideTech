import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import * as Utilities from './utilities'
import withErrorHandler from './hoc/withErrorHandler'
import withLoader from './hoc/withLoader'
import SocketContext from './socket-context'
import * as io from 'socket.io-client'

const socket = io(process.env.REACT_APP_API_BASE_URL, {
  secure: true,
  rejectUnauthorized: false,
  path: '/chat/socket.io'
})

class App extends Component {

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <Switch>
          <Route exact path="/" component={SignInPage} sendToken={this.getUserToken.bind(this)}/>
          <Route exact path="/login" component={SignInPage} sendToken={this.getUserToken.bind(this)} />
          <Route path="/user" component={UserPage} token={this.state.token} io={this.io}/>
        </Switch>
      </SocketContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(App))
