import React from 'react';
import './Roommates.css';

let currentRoom = "Room 1"
const n = [ "1", "2", "3", "4"];

const Roommates = (props) => {
	return (
		<ul id="roommates-bar">
		<li>Current Room</li>
		<li>{currentRoom}</li>
		<li>Room members</li>
		{React.Children.map(n, i => 
			<li>Roommate {i}</li>)}
		</ul>
	)
}
export default Roommates;
