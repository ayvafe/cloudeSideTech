import React from 'react';
import Chat from '../../components/chat/Chat';
import Room from '../../components/room/Room';
import Roommates from '../../components/roommates/Roommates.js';
import './User.css';
import * as Utilities from '../../utils/utilities.js';
import { Redirect} from 'react-router-dom'

class User extends React.Component {
  state = {
    logedIn : true,
  }
  
  componentDidMount() {
    this.timeout = setTimeout(() => {
      if (!Utilities.isLoggedIn()) {
        this.setState({logedIn : false});
      }
    }, 60 * 5 * 1000);
  }

  render() {
    return (
      this.state.logedIn ? (
        <div className="User">
          <Chat />
          <Room />
          <Roommates />
        </div>
      ) : (
        clearTimeout(this.timeout),
        <Redirect to='/' />
      )
    )
  }
}

export default User 
