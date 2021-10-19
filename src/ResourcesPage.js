

import React from 'react';
import './App.css';



class ResourcesPage extends React.Component {
  

  render() {    
    const d = this.props.data;
    


    return (
      <div className="ResourcesScreen" >
        <div className="ShowMeTitle">RESOURCES</div>
        {d.Resources.map((resource, index) => (
          <div key={"resources_" + index} className="ResourceButton">
              <p key={"resourceTitle_" + index}>{resource.Title}</p>     
              {resource.Links.map((link, linkindex) => (
                <p key={"resourcelink_" + index + "_" + linkindex} className="ResourceLink" ><a href={link.Url} style={{textDecoration: "none"}} target="_blank" rel="noreferrer">{link.Text}</a></p>
              ))}   
          </div> 
        ))}

        <div className="ReturnToDefundButton" onClick={() => this.props.toggleResources()}>{this.props.data.UI.ReturnToDefundText}</div>
      </div>
    );
  }
}

export default ResourcesPage