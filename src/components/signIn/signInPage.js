import React from 'react';
import './signInPage.css';


class SignInPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputType : "password",
			showHideClass : "glyphicon glyphicon-eye-open",
			email : '',
			password : '',
			messageColor : '#818181',
			messageText : 'Enter your email and password to login into your account',
		};
		this.showHidePassword = this.showHidePassword.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.sendLoginRequest = this.sendLoginRequest.bind(this);
		this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this);
		this.handlePasswdFieldChange = this.handlePasswdFieldChange.bind(this);
	}
	showHidePassword () { 
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

	sendLoginRequest() {
	}

	handleEmailFieldChange	(event) {
		this.setState({email : event.target.value});
	}

	handlePasswdFieldChange (event) {
		this.setState({password : event.target.value});
	}

	handleLogin() { 
		if(this.state.password.length > 0 && this.state.email.length > 0) {
			this.sendLoginRequest();
		} else {
			this.setState({messageColor : 'red', messageText : "Please enter correct email/password to login"});
		}
	}

	render() {
		return (
			<div className="sign-in-page">
			<div className="sign-in-text">
			<div>Sign in</div>
			<div style={{color:this.state.messageColor}}>{this.state.messageText}</div>
				</div>
				<div className="email-and-passwd">
				<div>Email</div>
				<input type="email" value={this.state.email} onChange={this.handleEmailFieldChange}></input>
				<div> Password</div>
				<input type={this.state.inputType} value={this.state.password} onChange={this.handlePasswdFieldChange}/>
				<span id="showPasword" className={this.state.showHideClass} onClick={this.showHidePassword}></span>
				</div>
				<div className="sign-in-botton" onClick={this.handleLogin}>SIGN IN
				</div>
				</div>
			);
			}
	}

	export default SignInPage;
