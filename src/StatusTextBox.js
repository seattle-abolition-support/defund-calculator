import React from 'react';
import { useSpring, animated } from '@react-spring/web'
import {debugLog} from './DebugLog'


const StatusTextBox = (props) => {
    debugLog("status textbox props")
    debugLog(props);

    const styles = useSpring({

            from: {opacity: 1, color: '#ffff00'},
            to: {opacity: 1, color: '#000000'},
            
            
            
            reset: true,
            config: {duration: 500 },
           // config: {duration: 500}
            //config: config.wobbly
        })


     //return <animated.div style={styles}>{"$" + Math.floor(styles.budget).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</animated.div>
     //return <animated.span style={styles}>{styles.budget.to(number => number.toLocaleString())}</animated.span>

     return <animated.div className="StatusTextBox">     
        { (!props.citationOn) ?
            <animated.div className="StatusTextText" style={{
            shadowColor: 'black',
            shadowOpacity: 0.9,
            shadowOffset: {
              width: 2,
              height: 2
            },
            shadowRadius: 5,
            ...styles}}>
            {props.statusMessage.split("|").map((s, i) => (
                <div key={i} style={styles}>{s}</div>
            ))}

            </animated.div>
            :
            <div className="StatusTextText">
                {"Source: " + props.statusMessageCitation}
            </div>
            }
            { props.statusMessageCitation !== "" ? 
                <div style={{position: "absolute", right : "5px", bottom: "0px", color : "#3f65c1", cursor: "pointer" }} 
                    onMouseOver={() => props.toggleCitationOn()}
                    onMouseOut={() => props.toggleCitationOff()}
                >source</div>
                : null
            }
     </animated.div >
    
   

}

export default StatusTextBox