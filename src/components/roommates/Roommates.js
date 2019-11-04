import React from 'react';
import './Roommates.css';
import * as config from '../../config.js';

class Roommates extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			roommates : ["Roommates loading..."],
			done: false,
			currentRoomId : "",
		};
	}

	componentDidMount() {
		this.getRoommates = () => {
			fetch(config.getRoommatesUrl + '&userId=' + this.props.userId + '&accessToken=' + this.props.accesToken)
				.then(res => res.json())
				.then(result => this.setState({ roommates : result.roomMembers, done: true }))
		}

		this.getCurrentRoom = () => {
			fetch(config.getCurrentRoomUrl + '&userId=' + this.props.userId + '&accessToken=' + this.props.accesToken)
				.then(res => res.json())
				.then(result => this.setState({ currentRoomId : result.currentRoom }))
		}

	}

	render() {
		return (
			<ul id="roommates-bar">
			<li>Current Room</li>
			<li>{this.state.currentRoomId}</li>
			<li>Room members</li>
			{React.Children.map(this.state.roommates, i => 
				<li>{i}</li>)}
			</ul>
		)
	}
}

export default Roommates;
