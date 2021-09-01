import React, {useEffect, useState, useRef} from 'react';
import { useSpring, animated, useSpringRef, useChain, config } from '@react-spring/web'



const BudgetCounter = (props) => {
    console.log("budget props")
    console.log(props);

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