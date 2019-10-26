import React from 'react';
import TypeAndSend from '../../components/type_and_send_message/typeAndSendMessage';
import './Chat.css';

const URL = 'ws://192.168.10.162:5001'

class Chat extends React.Component {
	state = {
		senderId: 'Feya',
		messages: [],
		socket_connected : false,
	}

	ws = new WebSocket(URL)

	coomponentDidMount() {
		this.ws.onopen = () => {
			console.log('connected')
			this.setState({socket_connected : true})
		}

		this.ws.onmessage = evt => {
			const message = JSON.parse(evt.data)
			this.addMessage(message)
		}

		this.ws.onclose = () => {
			console.log('disconnected')
			this.setState({socket_connected : false})
			this.setState({
				ws: new WebSocket(URL),
			})
		}
		this.ws.onerror = error => {
			console.log(error.message);
		};
	}

	addMessage = message =>
		this.setState(state => ({ messages: [message, ...state.messages]}))

	submitMessage = messageString => {
		if(messageString !== undefined && messageString !== "") {
			const message = { senderId : this.state.senderId, text: messageString }
			if (this.state.socket_connected) {
				this.ws.send(JSON.stringify(message))
			}
			this.addMessage(message)
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
