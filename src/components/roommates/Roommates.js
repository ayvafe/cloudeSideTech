import React from 'react';
import './Roommates.css';
import SocketContext from '../../socket_context';

class Roommates extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      roommates : []
    }
	}
	
  io = this.props.value.io;

  componentDidMount() {
    this.getRommatesList = () => { 
      this.io.emit('roommates', "");
      this.io.on('roommates', function(r) {
        this.setState({roommates : r})
      });
    }
  }

  render() {
    return (
      <ul id="roommates-bar">
      <li>Current Room</li>
      <li>{this.props.value.user.currentRoomId}</li>
      <li>Roommates</li>
      {(this.state.roommates).map((roommate, index) =>
        <li>roommate.info</li>
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
