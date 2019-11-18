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

  componentDidMount() {
    const url = [config.serverUrl, ":", config.serverPort,"/rooms_list"].join('')

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type" : 'application/json'
      },
    })
      .then(res => res.json())
      .then(resp => {
        this.setState({rooms : resp.rooms})
      })
      .catch(err => {
        this.setState({rooms : []})
        console.error('Error while user login : ' + err);
      });
  }

  onClick  = event => { 
    if(event.target.id) {
      this.props.value.io.emit('joinRoom', event.target.id);
      this.props.value.io.emit('roomName', event.target.id);
      this.props.value.io.emit('roommates', "");
      this.props.value.updateValue("user.currentRoomId", event.target.id);
    }
  }

  render() {
    if(!this.state.rooms || !this.state.rooms.length || this.state.rooms.length <= 0) {
      return (
        <ul id="room-bar">
        <li>Available Rooms</li>
        </ul>
      )
  }
  return (
    <ul id="room-bar">
    <li>Available Rooms</li>
    <ul>
      {(this.state.rooms).map((room, index) =>
        <li key={room._id ? room._id : ''} id={room._id ? room._id : ''} onClick={(e) => this.onClick(e)}>{room.name ? room.name : ''}</li>
      )}
    </ul>
    </ul>
  )}
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  {value => <Room{...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket 
