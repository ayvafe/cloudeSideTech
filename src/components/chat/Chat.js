import React from 'react';
import TypeAndSend from '../../components/type_and_send_message/typeAndSendMessage';
import './Chat.css';
import * as config from '../../config.js';

const URL = 'ws://192.168.1.25:8080'

class Chat extends React.Component {
	state = {
		senderId: 'Feya',
		messages: [],
		socket_connected : false,
		messagesCount : 100,
	}

	ws = new WebSocket(URL)

	componentDidMount() {
		this.ws.onopen = () => {
			console.log('WebSocket client connected')
			this.setState({socket_connected : true})
		}

		this.ws.onmessage = evt => {
			let message = (JSON.parse(evt.data));
			message = JSON.parse(message.utf8Data);
			this.addMessage(message)
		}

		this.ws.onclose = () => {
			console.log('WebSocket client disconnected')
			this.setState({
				ws : new WebSocket(URL),
				socket_connected : false
			})
		}

		this.ws.onerror = error => {
			try {
				this.setState({
					ws : new WebSocket(URL),
					socket_connected : false
				})

			} catch(e) {
				console.log("WebSocket Error : " + e.message);
			}
		};

		this.getMessages = () => {
			fetch(config.getMessagesUrl + '&userId=' + this.props.userId + '&lastMessagesCount=' + this.messagesCount + '&accessToken=' + this.props.accesToken)
				.then(res => res.json())
				.then(result => this.setState({ messages : result}))
		}

	}

	addMessage = message =>
		this.setState(state => ({ messages: [...state.messages, message]}))

	submitMessage = messageString => {
		if(messageString !== undefined && messageString !== "") {
			const message = { senderId : this.state.senderId, text: messageString }
			if (this.state.socket_connected === true) {
				this.ws.send(JSON.stringify(message))
				this.addMessage(message)
			}
		}
	}

	render() {
		return (
			<div className="chat">
			<div className="messages-list">
			{(this.state.messages).map((message, index) =>
				<div key={index} className="message">
				<div className="message-username">{message.senderId}</div>
				<div className="message-content"><p>{message.text}</p></div>
				</div>
			)}
			</div>
			<TypeAndSend  onSubmitMessage={this.submitMessage}/>
			</div>
		)
	}
}

export default Chat
