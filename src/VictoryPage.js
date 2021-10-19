
import React from 'react';
import './App.css';

import VictoryRainbow from "./images/city stuff/rainbow.svg"
import VictorySunWithFace from "./images/city stuff/sun-with-face.svg"

class VictoryPage extends React.Component {
  

  render() {    

    return (
      <div className="VictoryScreen" >
        <div className="ShowMeTitle">VICTORY!</div>
        <div>
          <img src={VictorySunWithFace} alt="A sun with a face." style={{width: "75%"}}/>
          <p>CONGRATULATIONS!</p> 
          <p>YOU HAVE ABOLISHED THE SEATTLE POLICE DEPARTMENT!</p> 
          <p>JOIN THE EFFORT AT:</p>
          <p><a href="bit.ly/DefendTheDefund">bit.ly/DefendTheDefund</a></p>
          <img src={VictoryRainbow} alt="A rainbow."  style={{width: "75%"}}/>
        </div>
        <div className="VictoryReturnButton" onClick={() => this.props.toggleVictory()}>{this.props.data.UI.VictoryReturnText}</div>
        
      </div>
    );
  }
}

export default VictoryPage