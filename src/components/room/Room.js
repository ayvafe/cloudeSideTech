import React from 'react';
import SocketContext from '../../socket_context';
import './Room.css';
import * as config from '../../config.js';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms : []
    }
  }

  getRooms = () => { 
    const url = [config.serverUrl, ":", config.serverPort,"/rooms_list"].join('')

    fetch(url, {
      method: "GET",
      "Content-Type" : 'application/json'
    })
      .then(res => res.json())
      .then(resp => {
        this.setState({rooms : resp.rooms})
      })
      .catch(err => {
        console.error('Error while user login : ' + err);
      })
  }

  onClick  = event => { 
    this.props.value.io.emit('joinRoom', event.target.id);
    this.props.value.updateValue("user.currentRoomId", event.target.id);
  }

  render() {
    return (
      <ul id="room-bar">
        <li>Available Rooms</li>
        {(this.state.rooms).map((room, index) =>
          <li key={room.id} id={room.id} onClick={() => this.onClick()}>{room.id}</li>
        )}
      </ul>
    )}
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {value => <Room{...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
