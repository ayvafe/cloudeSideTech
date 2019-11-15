import axios from 'axios'
import * as config from '../config.js';
const url = [config.serverUrl, ":", config.serverPort,"/check_token"].join('')

export const isLoggedIn = () => {
  let t = localStorage.getItem('chat-board-react-token');
  if(!t) {
    return false;
  }
  axios.get( url, {
    "authorization" : t
  })
    .then(response => {
      return true;
    })
    .catch(error => {
      console.log("Error to check token " + error);
      return false;
    });
  return false;
}
