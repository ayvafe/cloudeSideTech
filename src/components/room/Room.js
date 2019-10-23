import React from 'react';
import './Room.css';


const n = [ "1", "2", "3", "4"];

const Room = (props) => {
	return (
		<ul id="room-bar">
		<li>Available Rooms</li>
		{React.Children.map(n, i => 
			<li>Room {i}</li>)}
		</ul>
	)
}
export default Room;
