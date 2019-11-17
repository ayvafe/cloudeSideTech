import React from 'react';
import TypeAndSend from '../../components/type_and_send_message/typeAndSendMessage';
import SocketContext from '../../socket_context';
import './Chat.css';


class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    let io = this.props.value.io;
    io.onmessage = evt => {
      let message = (JSON.parse(evt.data));
      message = JSON.parse(message.utf8Data);
      this.addMessage(message)
    }

    this.props.value.io.on('is_online', function(username) {
      const message = { name : "" , text : username }
      this.addMessage(message)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.user.currentRoomId !== this.props.value.user.currentRoomId ) {
      this.setState({messages : []});
    }
  }

  addMessage = message => {
    this.setState(state => ({ messages: [...state.messages, message]}))
  }

  submitMessage = messageString => {
    if(messageString !== undefined && messageString !== "") {
      const message = { name : this.props.value.user.firstname + this.props.value.user.lastname, text: messageString }
      if (this.props.value.wsConnected === true) {
        this.props.value.io.emit("message", JSON.stringify(message))
        this.addMessage(message)
      }
    }
  }

  messagesRendering = () => {
    if(this.state.messages && this.state.messages.length && this.state.messages.length > 0) {
      return (
        (this.state.messages).map((message, index) =>
          <div key={index} className="message">
          <div className="message-username">{message.name ? message.name : '' }</div>
          <div className="message-content"><p>{message.text ? message.text : ''}</p></div>
          </div>
        ))
    }
    return null;
  }

  render() {
    return (
      <div className="chat">
      <div className="messages-list">
      {this.messagesRendering()}
      </div>
      <TypeAndSend  onSubmitMessage={this.submitMessage}/>
      </div>
    )
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {value => <Chat {...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
