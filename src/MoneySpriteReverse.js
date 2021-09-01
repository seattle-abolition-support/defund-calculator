import React, {useEffect, useState, useRef} from 'react';
import { useSpring, animated, useSpringRef, useChain, config } from '@react-spring/web'

const MoneySpriteReverse = (props) => {
    
    const [styles,set] = useSpring(() => ({

            from: { left: "10%", bottom: "-50%", width: "10%", },
            to: [{opacity: 1, left: "40%", bottom: props.bottom, width: "25%", }, {opacity: 0, left: "40%", bottom: props.bottom, onRest: () => {console.log("MONEY AT REST"); props.moneySpriteFinished(props.idx);}}],
            
            //config: config.wobbly
            config: {duration: 300}
            
        }))

     // return springs.map(styles => <animated.img style={{position: "absolute", ...styles}} />)
     return <animated.img style={{position: "absolute", zIndex: 1, ...styles}} src={props.image}/>
}

export default MoneySpriteReverse