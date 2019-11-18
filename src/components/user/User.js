import React from 'react';
import Chat from '../../components/chat/Chat';
import Room from '../../components/room/Room';
import Roommates from '../../components/roommates/Roommates.js';
import './User.css';
import { Redirect} from 'react-router-dom'
import SocketContext from '../../socket_context';

class User extends React.Component {
  render() {
    return (
      this.props.value.state.logedIn ? (
        <div className="User">
          <Chat />
          <Room />
          <Roommates />
        </div>
      ) : (
        <Redirect to='/' />
      )
    )
  }
}

const nestedComponentWithSocket = props => (
  <SocketContext.Consumer>
  { value => <User{...props} value={value} />}
  </SocketContext.Consumer>
)

export default nestedComponentWithSocket
