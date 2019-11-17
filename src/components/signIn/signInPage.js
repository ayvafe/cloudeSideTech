import React from 'react';
import './signInPage.css';
import * as config from '../../config.js';
import SocketContext from '../../socket_context';
import { Redirect } from 'react-router-dom'

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType : "password",
      showHideClass : "glyphicon glyphicon-eye-open",
      email : '',
      password : '',
      messageText : 'Enter your email and password to login into your account',
      activeClass : false, 
      logedIn : false,
      signUpClicked : false, 
    };
  }

  showHidePassword = () => {
    if(this.state.inputType === 'password') {
      this.setState({
        inputType : 'text',
        showHideClass : "glyphicon glyphicon-eye-close",
      })
    } else {
      this.setState({
        inputType : 'password',
        showHideClass : "glyphicon glyphicon-eye-open",
      })
    }
  }

  sendLoginRequest = () => {
    const url = [config.serverUrl, ":", config.serverPort,"/login"].join('')
    const body = {password : this.state.password, email : this.state.email}

    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type" : 'application/json'
      },
    })
      .then(res => res.json())
      .then(resp => {
        if(resp.data && resp.data.token && resp.data.user) {
          resp = resp.data;
          this.setState({ logedIn : true })
          localStorage.setItem('messenger-token', resp.token)
          this.props.value.updateValue("token", resp.token);
          this.props.value.updateValue("user", resp.user);
        } else if(resp.data && resp.data.title) {
          this.setState({messageText : resp.data.title})
        } else {
          this.setState({messageText : "Error to login"})
        }
      })
      .catch(err => {
        this.setState({messageText : "Error to login"})
        console.error('Error while user login : ' + err);
      })
  }

  handleEmailFieldChange = event => {
    this.setState({email : event.target.value});
  }

  handlePasswdFieldChange  = event => {
    this.setState({password : event.target.value});
  }

  handleSignUp = () => { 
    this.setState({signUpClicked : true});
  }

  handleLogin = () => { 
    const t = this.state; 
    if( t.password.length < 8 ) { 
      this.setState({messageText : "Password should have more than 7 characters", activeClass : true})
    } else if ( t.email.length < 5 ) {
      this.setState({messageText : "Please set correct email", activeClass : true})
    } else {
      this.setState({messageText : ""})
      this.sendLoginRequest();
    }
  }

  renderFunction() {
  }

  render() {
    if (this.state.logedIn === true) {
      return <Redirect to='/user' />
    } else if(this.state.signUpClicked === true) {
      return <Redirect to='/signUp' />
    }
    return ( 
      <div className="sign-in-page">
       <div className="sign-in-text">
         <div>Sign in</div>
         <div className={this.state.activeClass ? "sign-in-message-active": "sign-in-message"}>{this.state.messageText}</div>
       </div>
       <div className="email-and-passwd">
         <div>Email</div>
         <input type="email" value={this.state.email} onChange={this.handleEmailFieldChange}/>
         <div> Password</div>
         <input type={this.state.inputType} value={this.state.password} onChange={this.handlePasswdFieldChange}/>
         <span id="showPasword" className={this.state.showHideClass} onClick={this.showHidePassword}></span>
       </div>
       <div className="bottons">
         <div className="sign-in-botton" onClick={this.handleLogin}>SIGN IN</div>
         <div className="sign-up-botton" onClick={this.handleSignUp}>SIGN UP</div>
       </div>
     </div>
    )
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {value => <SignInPage{...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
