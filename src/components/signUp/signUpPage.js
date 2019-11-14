import React from 'react';
import './signUpPage.css';
import * as config from '../../config.js';
import SocketContext from '../../socket_context';
import { Redirect} from 'react-router-dom'

class SignUpPage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      inputType : "password",
      showHideClass : "glyphicon glyphicon-eye-open",
      email : '',
      password : '',
      firstname : '',
      lastname : '',
      logedIn : false,
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
  
  handleFirstnameFieldChange = event => {
    this.setState({firstname : event.target.value});
  }

  handleLastnameFieldChange = event => {
    this.setState({lastname : event.target.value});
  }

  handleEmailFieldChange = event => {
    this.setState({email : event.target.value});
  }

  handlePasswdFieldChange  = event => {
    this.setState({password : event.target.value});
  }
  
  sendSignUpRequest = () => { 
    if((this.checkData())) {
      const url = [config.serverUrl, ":", config.serverPort,"/sign_up"].join('')
      const body = {
        password : this.state.password, 
        email : this.state.email, 
        lastname : this.state.lastname,
        firstname : this.state.firstname
      }

      fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type" : 'application/json'
        },
      })
        .then(res => res.json())
        .then(resp => {
          localStorage.setItem('messenger-token', resp.token)
          this.props.value.updateValue("token", resp.token);
          this.props.value.updateValue("user", resp.user);
          this.setState({logedIn : true})
        })
        .catch(err => {
          console.error('Error while user login : ' + err);
        })
    }
  }
  
  checkData = () => { 
    const t = this.state; 
    if(t.password.length < 10 || t.email.length < 5
      || t.lastname.length <= 0 || t.firstname.length <= 0) {
      return false
    }

    return true 
  }

  render() {
    return (
      !this.state.logedIn ? (
        <div className="sign-up-page">
          <div className="sign-up-text">Sign Up</div>
          <input type="text" value={this.state.lastname} placeholder="Firstname..." onChange={this.handleFirstnameFieldChange}/>
          <input type="text" value={this.state.firstname} placeholder="Lastname..."  onChange={this.handleLastnameFieldChange}/>
          <input type="email" value={this.state.email} placeholder="Email"  onChange={this.handleEmailFieldChange}/>
          <div className="passwd">
            <input type={this.state.inputType} value={this.state.password} placeholder="Password" onChange={this.handlePasswdFieldChange}/>
            <span id="showhidePasword" className={this.state.showHideClass} onClick={this.showHidePassword}></span>
          </div>
          <div className="signup-botton" onClick={this.sendSignUpRequest}>SIGN UP</div>
        </div>
      ) : (
        <Redirect to='/user' />
      )
    );
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  { value => <SignUpPage {...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
