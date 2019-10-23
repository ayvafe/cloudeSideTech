import React from 'react';
import './User.css';
import Chat from '../../components/chat/Chat';
import Room from '../../components/room/Room';
import Roommates from '../../components/roommates/Roommates.js';
  
class User extends React.Component {
	constructor() {
		super();
		this.state = {
			currentRoomId : "",
			availableRooms : [],
			messages : []
		};
	}
	render() {
		return (
			<div className="User">
			<Room/>
			<Roommates/>
			<Chat />
			</div>
		);
	}
}

export default User;
