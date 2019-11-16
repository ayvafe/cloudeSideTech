import axios from 'axios'
import * as config from '../config.js';
const url = [config.serverUrl, ":", config.serverPort,"/check_token"].join('')

export const isLoggedIn = async () => {
  let t = localStorage.getItem('messenger-token');
  if(!t) {
    return false;
  }
  try {
    let res = await axios.get( url, {
      "authorization" : t
    })
    return true;
  } catch (err) {
    console.log("Error to check token " + err);
    return  false;
  }
};
