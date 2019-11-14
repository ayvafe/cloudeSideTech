import axios from 'axios'

export const isLoggedIn = () => {
  let t = localStorage.getItem('chat-board-react-token');
  if(!!t) {
    return false;
  }
  axios.get('/check_token', {
    "authorization" : t
  })
    .then(response => {
      return true;
    })
    .catch(error => {
      console.log("Error to check token");
      return false;
    });
  return false;
}
