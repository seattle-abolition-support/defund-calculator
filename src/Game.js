import React from 'react';

import CopSprite from './CopSprite'
import MoneySprite from './MoneySprite'
import MoneySpriteReverse from './MoneySpriteReverse'
import CitySprite from './CitySprite'

// import Batton from "./images/cop stuff/batton.svg"
import BigBadge from "./images/cop stuff/big-badge.svg"
import CopCar from "./images/cop stuff/cop-car.svg"
import GasMask from "./images/cop stuff/gas-mask.svg"
import Gun from "./images/cop stuff/gun.svg"
import Handcuffs from "./images/cop stuff/handcuffs.svg"
import Helicopter from "./images/cop stuff/helicopter.svg"
// import Motorcycle from "./images/cop stuff/motorcycle.svg"
// import Vest from "./images/cop stuff/vest.svg"
// import WalkieTalkie from "./images/cop stuff/walkie-talkie.svg"

import Carrot from "./images/city stuff/carrot.svg"
import MoneyWithWings from "./images/city stuff/money-with-wings.svg"
// import Crayon from "./images/city stuff/crayon.svg"
// import MedicalWorker from "./images/city stuff/medical-worker.svg"
// import PrideFlag from "./images/city stuff/pride-flag.svg"
// import Rainbow from "./images/city stuff/rainbow.svg"
// import RedApple from "./images/city stuff/red-apple.svg"
// import SunWithFace from "./images/city stuff/sun-with-face.svg"
// import TownHouses from "./images/city stuff/town-houses.svg"
// import Tulip from "./images/city stuff/tulip.svg"
// import WhiteCloud from "./images/city stuff/white-cloud.svg"

// import Skyline0 from "./images/city stuff/skyline0.svg"
// import Skyline1 from "./images/city stuff/skyline1.svg"
// import Skyline2 from "./images/city stuff/skyline2.svg"
// import Skyline3 from "./images/city stuff/skyline3.svg"
// import Skyline4 from "./images/city stuff/skyline4.svg"

import LevelUpImage from "./images/interface stuff/level-up.svg"

import temp from "./images/city-progression/01.gif"
console.log("temp")
console.log(temp)

function importAll(r) {
  return r.keys().map(r);
}


const tempProgressImages = importAll(require.context('./images/city-progression/', false, /\.(png|jpe?g|svg|gif)$/));
let cityProgressImages = [];
for(var i in tempProgressImages) {
  cityProgressImages.push(tempProgressImages[i].default);
}


class Game extends React.Component {
  

  
    constructor(props) {
      super(props);
  
      let leftStart = -35;
      let leftEnd = 100;
      let baseDuration = 3000;

      let spriteData = []
      for(var i = 0; i < 25; i++) {
        let img = "";
        let bottom = ""
        let dir = ""
        let zIndex = 0;

        switch(Math.floor(i / 5)) {
          case 0:
            img = CopCar
            bottom = "0%";
            dir = "-1";
            zIndex = -1;
            break;
          case 1:
            img = (i % 2 === 0) ? Gun : Handcuffs
            bottom = "20%"
            dir = "1";
            zIndex = "-2"
            break;
          case 2:
              img = BigBadge;
              bottom = "30%";
              dir = "-1";
              zIndex = "-3";
              break;
          case 3:
            img =  (i % 2 === 0) ? Handcuffs : GasMask
            bottom = "45%"
            dir = "1";
            zIndex = "-2"
            break;          
          case 4:
            img = Helicopter
            bottom = "70%"
            dir = "-1";
            zIndex = "-1";
            break;
        }

        let progress = (i % 5) / 5.0;
        let initialDuration = Math.floor((1 - progress) * baseDuration);

        let dLeft = Math.floor((leftEnd - leftStart) * progress);
        let initialLeft = (dir > 0) ? leftStart + dLeft : leftEnd - dLeft;  

        spriteData.push({
          image: img, 
          bottom: bottom, 
          zIndex: zIndex,
          dir: dir, 
          progress: progress, 
          initialDuration: initialDuration,
          initialLeft: initialLeft + "%",
          idx: i
        });
      }

      let moneySpriteData = [];

      this.state = { 
        progressIdx: 0, 
        progressImages: cityProgressImages, 
        spriteData: spriteData,
        baseDuration: baseDuration,
        leftStart: leftStart + "%",
        leftEnd: leftEnd + "%",
        copIdx: -1,
        moneySpriteData: moneySpriteData,
        moneyIdx : 0
      };
    }
  
    render() {    
      
  
      return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
         

        <img src={this.state.progressImages[this.state.progressIdx]} style={{position: "absolute", left: "0%", bottom: "0%", width: "100%", height: "auto", zIndex:"-100"}}/>

        {this.state.spriteData.map((data, index) => (
            <CopSprite key={"CopSprite_" + data.idx} 
            image={data.image} 
            idx={data.idx}
            dismissed = {(data.idx === this.state.copIdx) ? true : false}
            bottom={data.bottom} 
            zIndex={(data.idx === this.state.copIdx) ? 0 : data.zIndex} 
            dir={data.dir} 
            progress={data.progress}
            baseDuration={this.state.baseDuration}
            leftStart={(data.dir > 0) ? this.state.leftStart : this.state.leftEnd}
            leftEnd={(data.dir > 0) ? this.state.leftEnd : this.state.leftStart}
            initialDuration={data.initialDuration}
            initialLeft = {data.initialLeft}
            copSpriteFinished = {this.copSpriteFinished}
            />
        ))}
        
        {this.state.moneySpriteData.map((data, index) => (
          (data.type === "Money") ?
            <MoneySprite key={"MoneySprite_" + data.idx }
              idx={data.idx}
              image={data.image}
              bottom={data.bottom}
              moneySpriteFinished = {this.moneySpriteFinished}
            />
          : (data.type === "reverseMoney") ?

            <MoneySpriteReverse key={"MoneySprite_" + data.idx }
                idx={data.idx}
                image={data.image}
                bottom={data.bottom}
                moneySpriteFinished = {this.moneySpriteFinished}
              /> 
              :
              <CitySprite key={"MoneySprite_" + data.idx }
                idx={data.idx}
                image={data.image}
                bottom={data.bottom}
                moneySpriteFinished = {this.moneySpriteFinished}
              /> 

        ))}

        {this.props.showLevelUp ? 
          <img src={LevelUpImage} style={{position: "absolute", left: "0%", bottom: "20%", width: "100%", height: "auto", zIndex : 1000}}/> : null
        }
        </div>
      );
    }
  
    // Called after the update so that you can reset the state of things after rendering
    componentDidUpdate(prevProps, prevState) {
      
      console.log("game componentDidUpdate " + this.props.gameDefundCount);
      console.log(this.props);
      console.log("copIdx: " + this.state.copIdx);
      // If gameDefundCount was 0 but isn't now, pop cop data
      if(prevProps.gameDefundCount === 0 && this.props.gameDefundCount !== 0) {

        if(this.state.spriteData.length > 0) { 
          var copIdx = this.state.spriteData[Math.floor(Math.random() * this.state.spriteData.length)].idx


          console.log("Setting cop idx");
          this.setState((state, props) => ({
            //copIdx: this.state.copIdx + 1
            copIdx: copIdx
          }));
        }
      }

      // If gameFundCount was 0 but isn't now, add or remove some city items
      if(prevProps.gameFundCount === 0 && this.props.gameFundCount !== 0)
      {
 
        let progressIdx = this.state.progressIdx;
        progressIdx = (progressIdx + 1 < this.state.progressImages.length) ? progressIdx + 1 : progressIdx;




        let newMoneySpriteData = this.state.moneySpriteData;
        let newMoneyIdx = this.state.moneyIdx;
        newMoneySpriteData.push(
          {
            idx: this.state.moneyIdx,
            bottom: "50%",
            image: MoneyWithWings,
            type: "reverseMoney"
          }
          
        );

        newMoneyIdx = newMoneyIdx + 1;

        newMoneySpriteData.push(
          {
            idx: newMoneyIdx,
            bottom: "50%",
            image: Carrot,
            type: "citySprite"
          }
          
        );

        newMoneyIdx = newMoneyIdx + 1;

        
        this.setState((state, props) => ({
          progressIdx : progressIdx,
          moneySpriteData : newMoneySpriteData,
          moneyIdx: newMoneyIdx
        }));

      }

      

    }

    copSpriteFinished = (idx ) => {
      console.log("copSpriteFinished: " + idx);
      let sd = this.state.spriteData;
      let newSpriteData = [];
      for(var i = 0; i < sd.length; i++) {
        if(sd[i].idx !== idx) {
          newSpriteData.push(sd[i]);
        }
      }

      let newMoneySpriteData = this.state.moneySpriteData;
      let newMoneyIdx = this.state.moneyIdx;
      newMoneySpriteData.push(
        {
          idx: this.state.moneyIdx,
          bottom: "50%",
          image: MoneyWithWings,
          type: "Money"
        }
        
      );

      newMoneyIdx = newMoneyIdx + 1;

      this.setState((state, props) => ({
        spriteData : newSpriteData,
        moneySpriteData : newMoneySpriteData,
        moneyIdx: newMoneyIdx
      }));
    }

    moneySpriteFinished = (idx) => {
      console.log("moneySpriteFinished: " + idx);
      let newMoneySpriteData = [];

      for(var i = 0; i < this.state.moneySpriteData.length; i++) {
        let msd = this.state.moneySpriteData[i];
        if(msd.idx === idx) {
          // remove moneySprite drom list
        } else {
          newMoneySpriteData.push(msd);
        }
      }

      this.setState((state, props) => ({
        moneySpriteData : newMoneySpriteData,
      }));

    }

    defundCops = (count) => {

      

    }
  
    getNewCityItem = () => {
  
  
      
  
      
      // let zHack = (this.state.cityData.length % this.state.zLayerCount);
      // console.log("zHack: " + zHack);
      // console.log("state.cityLayers: " + this.state.cityLayers);
      // let layerImages = this.state.cityLayers[zHack];
      // let layerIdx = Math.floor(Math.random() * layerImages.length)
      // let imgIdx = layerImages[layerIdx];
      // let img = this.state.cityImages[imgIdx];
      // //let img = this.state.cityImages[Math.floor(Math.random() * this.state.cityImages.length)];

      // let x = Math.floor(Math.random() * 90);
      // let y = 90 * (zHack / this.state.zLayerCount); // skyline images use 40. trying to make city stuff go higher
      
      // //let z = Math.floor(100 * (zHack + Math.random()));
      // let skylineZ = Math.floor(100 * (this.state.zLayerCount - zHack)); // same as above for skyline z: 100 per layer
      // let zindex = skylineZ + Math.floor(Math.random() * 99); // random between layers
  
      // return {
      //     img: img,
      //     x: x,
      //     y: y,
      //     zindex: zindex,
      //     scale: 10
      //   };
    }
  }

  

  export default Game;