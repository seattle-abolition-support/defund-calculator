import React, {useEffect} from 'react';
import { useSpring, animated} from '@react-spring/web'
import {debugLog} from './DebugLog'

const CopSprite = (props) => {

    const {dismissed} = props;
    const {copSpriteFinished} = props;
    const {idx} = props;

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
        
        debugLog("in useEffect");
        if(dismissed) {
          debugLog("dismissed: ");
          set({ to: [{ left: "40%", bottom: "%40", width: "30%", opacity: 1},{opacity: 0}], loop: false, config: {duration: 400},  onRest: () => {debugLog("NEW AT REST"); copSpriteFinished(idx);}})
        

            
        }
    }, [dismissed, copSpriteFinished, idx, set]);


      return (<animated.img style={{position: "absolute", zIndex: props.zIndex, ...styles}} src={props.image}/>)

    

}

export default CopSprite