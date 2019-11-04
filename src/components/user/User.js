import React from 'react';
import Chat from '../../components/chat/Chat';
import Room from '../../components/room/Room';
import Roommates from '../../components/roommates/Roommates.js';
import './User.css';

class User extends React.Component {
	constructor(props) {
		console.log("AAAAA" + JSON.stringify(props.match))
		super(props);
	}
	render() {
		return (
			<div className="User">
			  <Chat senderId={this.props.userId} currentRoomId={this.props.currentRoomId}/>
			  <Room/>
			  <Roommates/>
			</div>
		);
	}
}

export default User;
