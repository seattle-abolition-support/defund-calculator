

import React from 'react';
import './App.css';


class EasterEggPage extends React.Component {
  

  render() {    
    const d = this.props.data;
    let egg = d.EasterEggs[this.props.currentEasterEgg];
    console.log(d.EasterEggs);
    console.log("egg: " + egg);
    return (
      <div className="EasterEggScreen" >
        <div className="EasterEggTitle">{d.UI.EasterEggTitle}</div>
        
        <div className="EasterEggText">
          <p>{d.UI.EasterEggText}</p>
          <p>{egg.Logo}</p>
          {egg.Description}
          {egg.Links.map((link, index) => (
            <p><a href={link.Url} style={{textDecoration: "none"}} key={"LINK_" + index} target="_blank" rel="noreferrer">{link.Text}</a></p>
          ))}
        </div>
        <link rel="import" href={process.env.PUBLIC_URL + '/resources.html'}/>
        <div className="ReturnToDefundButton" onClick={() => this.props.toggleEasterEgg()}>{this.props.data.UI.ReturnToDefundText}</div>
        
      </div>
    );
  }
}

export default EasterEggPage