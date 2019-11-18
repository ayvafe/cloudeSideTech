import axios from 'axios'
import * as config from '../config.js';
const url = [config.serverUrl, ":", config.serverPort,"/check_token"].join('')

export const isLoggedIn = async () => {
  let t = localStorage.getItem('messenger-token');
  if(!t) {
    return false;
  }
  try {
    var res = await axios.get( url, { headers: { authorization : t }})
    if (!res.status === 200) {
      return false;
    }
    if(res.data && res.data.success) {
      return true;
    }
    return false;
  } catch (err) {
    console.log("Error to check token " + err);
    return false;
  }
};
