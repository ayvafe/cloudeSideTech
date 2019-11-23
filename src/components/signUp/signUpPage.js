import React from 'react';
import './signUpPage.css';
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
      errMessage : '',
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
  
  handleFirstnameFieldChange = (ev) => {
    this.setState({firstname : ev.target.value});
  }

  handleLastnameFieldChange = (ev) => {
    this.setState({lastname : ev.target.value});
  }

  handleEmailFieldChange = (ev) => {
    this.setState({email : ev.target.value});
  }

  handlePasswdFieldChange  = (ev) => {
    this.setState({password : ev.target.value});
  }
  
  sendSignUpRequest = () => { 
    if((this.checkData())) {
      const url = [process.env.REACT_APP_SERVER_HOST, ":", process.env.REACT_APP_SERVER_PORT,"/sign_up"].join('')
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
          if(resp.data && resp.data.token && resp.data.user) {
            resp = resp.data;
            localStorage.setItem('messenger-token', resp.token)
            this.props.value.updateValue("token", resp.token);
            this.props.value.updateValue("user", resp.user);
            this.props.value.updateValue("logedIn", true);
          } else if(resp.data && resp.data.title) {
            this.setState({errMessage : resp.data.title})
          } else {
            this.setState({errMessage : "Error to sign up"})
          }
        })
        .catch(err => {
          this.setState({errMessage : "Error to sign up"})
          console.error('Error while user login : ' + err);
        })
    }
  }
  
  checkData = () => { 
    const t = this.state; 
    if( t.password.length < 8 ) { 
      this.setState({errMessage : "Password should have more than 7 characters"})
      return false
    } else if ( t.email.length < 5 ) {
      this.setState({errMessage : "Please set correct email"})
      return false
    } else if ( t.lastname.length <= 1 ) {
      this.setState({errMessage : "Please set correct last name"})
      return false
    } else if ( t.firstname.length <= 1 ) {
      this.setState({errMessage : "Please set correct first name"})
      return false
    } else {
      this.setState({errMessage : ""})
      return true 
    }
  }

  render() {
    if (this.props.value.state.logedIn === true) {
      return <Redirect to='/user' />
    }
    return (
        <div className="sign-up-page">
          <div className="sign-up">
            <div className="sign-up-text">Sign Up</div>
            <div className="sign-up-error">{this.state.errMessage}</div>
          </div>
          <input type="firstname" value={this.state.firstname} placeholder="First name..." onChange={this.handleFirstnameFieldChange}/>
          <input type="lastname" value={this.state.lastname} placeholder="Last name..."  onChange={this.handleLastnameFieldChange}/>
          <input type="email" value={this.state.email} placeholder="Email"  onChange={this.handleEmailFieldChange}/>
          <div className="passwd">
            <input type={this.state.inputType} value={this.state.password} placeholder="Password" onChange={this.handlePasswdFieldChange}/>
            <span id="showhidePasword" className={this.state.showHideClass} onClick={this.showHidePassword}></span>
          </div>
          <div className="signup-botton" onClick={this.sendSignUpRequest}>SIGN UP</div>
        </div>
    );
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  { value => <SignUpPage {...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
