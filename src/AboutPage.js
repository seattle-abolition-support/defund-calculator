
import React from 'react';
import './App.css';

import { isMobile } from 'mobile-device-detect'

class AboutPage extends React.Component {
  

    render() {    
        //const d = this.props.data;

        return (
        <div className="AboutScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        
            <div className="ShowMeTitle">ABOUT</div>
            <div>
            <p>Some text here about how we arrived at different amounts for police budget / police officer defunding, and sources of information.</p>
            <p>Information on how PB works</p>
            <p>(info graphic and/or video?)</p>
            <p>Credits: Developed by PB Creators, Seattle Abolition Support / Defend the Defund</p>
            <p><a href="mailto: something">EMAIL</a></p>
            </div>
            <div className="ReturnToDefundButton" onClick={() => this.props.toggleAbout()}>{this.props.data.UI.ReturnToDefundText}</div>
            
            
            <div className="CitationContainer">
                <div>WORKS CITED</div>
                <div>POLICE</div>
                {this.props.data.PoliceFacts.map((pf, index) => (

                    <div key={"PoliceFact_" + index} className="CitationDiv">
                        {pf.Text}<br/>
                        Source: {pf.Citation}
                        <br/>
                    </div>
                ))}

                {this.props.data.Categories.map((cat, catIdx) => (
                    cat.Messages.map((message, messageIdx) => (
                        (message.Citation) ? 
                        <div key={cat.Name + "_Fact_" + messageIdx} className="CitationDiv">
                            {message.Text}<br/>
                            Source: {message.Citation}
                            <br/>
                        </div> :
                        null
                    ))
                ))}
            </div>
        </div>
        );
    }
}


export default AboutPage