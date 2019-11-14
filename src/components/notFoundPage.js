import React from 'react';
import './notFoundPage.css';

class notFoundPage extends React.Component {
  render() {
    return (
      <div className="not-found-page">
        <div className="not-found-img"></div>
        <div className="not-found-text">Page not found : Error 404</div>
      </div>
    );
  }
}

export default notFoundPage 
