import React, {useEffect, useState, useRef} from 'react';
import { useSpring, animated, useSpringRef, useChain, config } from '@react-spring/web'


const CopSprite = (props) => {
    const [init, updateInit] = useState(true);
    const [dismissed, updateDismissed] = useState(false);

    const [styles,set] = useSpring(() => ({
        
        
        transform: "scale(" + (props.dir * -1) + ", 1)",
         
        from: { left: props.initialLeft,  bottom: props.bottom, width: "20%", opacity: 1},
        to: { left: props.leftEnd},
        loop: false,
        config: { duration: props.initialDuration},
        onRest: (result, spring) => set({ 
            from: { left: props.leftStart,  bottom: props.bottom},
            to: { left: props.leftEnd},
            loop: false,
            config: { duration: props.baseDuration},
        }),
    }));



    useEffect(() => {
        
        console.log("in useEffect");
       
        if(props.dismissed) {
          console.log("dismissed: ");
          console.log(props);
          set({ to: { left: "40%", bottom: "%50", width: "30%", opacity: 1}, loop: false, config: {duration: 400},  onRest: () => {console.log("NEW AT REST"); props.copSpriteFinished(props.idx);}})
        

            
        }
      }, [props.dismissed, props.copSpriteFinished, set]);

      return (<animated.img style={{position: "absolute", zIndex: props.zIndex, ...styles}} src={props.image}/>)

    

}

export default CopSprite