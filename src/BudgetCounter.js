import React from 'react';
import { useSpring, animated } from '@react-spring/web'
import {debugLog} from './DebugLog'


const BudgetCounter = (props) => {
    debugLog("budget props")
    debugLog(props);

    const styles = useSpring({

            from: {budget: 0},
            to: {budget: props.budget},
            
            config: {duration: 300},
           // config: {duration: 500}
            //config: config.wobbly
        })


     //return <animated.div style={styles}>{"$" + Math.floor(styles.budget).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</animated.div>
     return <animated.span style={styles}>{styles.budget.to(number => number.toLocaleString())}</animated.span>

}

export default BudgetCounter