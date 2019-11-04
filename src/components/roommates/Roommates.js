import React from 'react';
import * as config from '../../config.js';
import './Roommates.css';


const n = [ "1", "2", "3", "4"];

class Room extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      rommatesList : [],
    }
	}

	getRommatesList = event => { 
		fetch(config.getRoommatesListURL + '&roomId=' + event.target.value + '&userId=' + this.props.userId + '&accessToken=' + this.props.accesToken)
			.then(res => res.json())
			.then(result => this.setState({ currentRoomId : result.currentRoom }))
	}

	render() {
		return (
			<ul id="roommates-bar">
			  <li>Current Room</li>
			  <li>{this.props.currentRoom}</li>
			  <li>Roommates</li>
			  {React.Children.map(n, i => 
				    <li>Roomates {i}</li>)
        }
			</ul>
		)
	}
}

export default Room;
