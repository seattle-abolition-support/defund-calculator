import React from 'react';
import { useSpring, animated, config } from '@react-spring/web'

const MoneySprite = (props) => {
    
    const [styles] = useSpring(() => ({

            from: {opacity: 0, left: "40%", bottom: props.bottom, width: "10%"},
            to: [{opacity: 1, left: "40%", bottom: props.bottom, width: "25%"}, {delay: 0, left: "10%", bottom: "-50%", config: {duration: 200}, onRest: () => {console.log("MONEY AT REST"); props.moneySpriteFinished(props.idx);}}],
            
            //config: {duration: 300},
            delay: 300,
            config: config.wobbly
            
        }))

     // return springs.map(styles => <animated.img style={{position: "absolute", ...styles}} />)
     return <animated.img style={{position: "absolute", zIndex: 1, ...styles}} src={props.image}/>
}

export default MoneySprite