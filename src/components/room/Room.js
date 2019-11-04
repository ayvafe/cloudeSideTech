import React from 'react';
import * as config from '../../config.js';
import './Room.css';


const n = [ "1", "2", "3", "4"];

class Room extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}
	onClick (event) { 
		fetch(config.changeRoomRequestUrl + '&roomId=' + event.target.value + '&userId=' + this.props.userId + '&accessToken=' + this.props.accesToken)
			.then(res => res.json())
			.then(result => this.setState({ currentRoomId : result.currentRoom }))
	}

	render() {
		return (
			<ul id="room-bar">
			<li>Available Rooms</li>
			{React.Children.map(n, i => 
				<li onClick={this.onClick}>Room {i}</li>)}

			</ul>
		)
	}
}

export default Room;
