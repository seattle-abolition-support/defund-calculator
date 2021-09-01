import React, {useEffect, useState, useRef} from 'react';
import { useSpring, animated, useSpringRef, useChain, config } from '@react-spring/web'

const CitySprite = (props) => {
    
    const [styles,set] = useSpring(() => ({

            from: { opacity: 0, left: "40%", bottom: props.bottom, width: "10%"},
            to: [{opacity: 1, left: "40%", bottom: props.bottom, width: "25%", config: {duration: 200}}, {delay: 500, config: {duration: 400}, width: "5%", left: "40%", bottom: props.bottom, onRest: () => {console.log("MONEY AT REST"); props.moneySpriteFinished(props.idx);}}],
            
            delay: 300,
            config: config.wobbly
            
        }))

     // return springs.map(styles => <animated.img style={{position: "absolute", ...styles}} />)
     return <animated.img style={{position: "absolute", zIndex: .5, ...styles}} src={props.image}/>
}

export default CitySprite