import React from 'react';
import './Roommates.css';
import SocketContext from '../../socket_context';

class Roommates extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      roommates : [],
      currentRoomName : ""
    }
	}

  componentDidMount() {
    let io = this.props.value.io;
    io.emit('roommates', "");
    io.on('roommates', (r) => {
      this.setState({roommates : r})
    });

    io.emit('roomName', this.props.value.state.user.currentRoomId);
    io.on('roomName', (rm) => {
      this.setState({currentRoomName : rm})
    });
  }

  render() {
      (this.state.roommates).forEach((r) =>
        console.log("ROOMAAATE ", r)
      )
    return (
      <ul id="roommates-bar">
      <li>Current Room</li>
      <li>{this.state.currentRoomName}</li>
      <li>Roommates</li>
      {(this.state.roommates).map((r) =>
        <li>{r}</li>
      )}
      </ul>
    )
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {value => <Roommates{...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
