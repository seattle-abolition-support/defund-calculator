import React, { Component } from 'react';

import Batton from "./images/cop stuff/batton.svg"
import BigBadge from "./images/cop stuff/big-badge.svg"
import CopCar from "./images/cop stuff/cop-car.svg"
import GasMask from "./images/cop stuff/gas-mask.svg"
import Gun from "./images/cop stuff/gun.svg"
import Handcuffs from "./images/cop stuff/handcuffs.svg"
import Helicopter from "./images/cop stuff/helicopter.svg"
import Motorcycle from "./images/cop stuff/motorcycle.svg"
import Vest from "./images/cop stuff/vest.svg"
import WalkieTalkie from "./images/cop stuff/walkie-talkie.svg"

import Carrot from "./images/city stuff/carrot.svg"
import Crayon from "./images/city stuff/crayon.svg"
import MedicalWorker from "./images/city stuff/medical-worker.svg"
import PrideFlag from "./images/city stuff/pride-flag.svg"
import Rainbow from "./images/city stuff/rainbow.svg"
import RedApple from "./images/city stuff/red-apple.svg"
import SunWithFace from "./images/city stuff/sun-with-face.svg"
import TownHouses from "./images/city stuff/town-houses.svg"
import Tulip from "./images/city stuff/tulip.svg"
import WhiteCloud from "./images/city stuff/white-cloud.svg"

import Skyline0 from "./images/city stuff/skyline0.svg"
import Skyline1 from "./images/city stuff/skyline1.svg"
import Skyline2 from "./images/city stuff/skyline2.svg"
import Skyline3 from "./images/city stuff/skyline3.svg"
import Skyline4 from "./images/city stuff/skyline4.svg"


class Game extends React.Component {
  
    constructor(props) {
      super(props);
  
      // let copImages = [Batton, BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, Vest, WalkieTalkie];
      // let baseScale = [.5, .7, 1, 1.0, 1, .7, 1.1, 1.1, .5, .3];
      // let baseRotation = [180, 30, 30, 90, 180, 180, 45, 0, 0, 90  ];
  
      let copImages = [BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, WalkieTalkie];
      let baseScale = [.7, 1, 1.0, 1, .7, 1.1, 1.1, .3];
      let baseRotation = [30, 30, 90, 180, 180, 45, 0, 90  ];
  
      let cityImages = [Carrot, Crayon, MedicalWorker, PrideFlag, Rainbow, RedApple, TownHouses, Tulip]
      
  
      let skylineImages = [Skyline0, Skyline1, Skyline2, Skyline3, Skyline4];
  
      let spriteLayers = 5;
      let baseLayerCount = 9;
      let spriteData = [];
      let cityData = [];
      let skylineData = [];
      for (var i = 0; i < spriteLayers; i++) {
  
        var layerScale = 1 - ((i / spriteLayers) * .5);
        var layerCount = Math.floor(baseLayerCount / layerScale);
        for(var j = 0; j < layerCount; j++) {
          let imgIdx = Math.floor(Math.random() * copImages.length);
          let x = -10 + 120 * (j / layerCount);
          let y = 70 - 80 * (i / spriteLayers);
          let z = Math.floor(100 * ((spriteLayers - i) + Math.random()));
          let s = layerScale * 30 * baseScale[imgIdx];
  
          spriteData.push(
            {
              x: x,
              y: y,
              img: copImages[imgIdx],
              scale: s,
              rotation: 0,//Math.floor((Math.random() * baseRotation[imgIdx]) - (baseRotation[imgIdx] * .5))
              zindex: z
            }
          )
  
          let slx = 0;
          let sly = 70 - (60 * (i / spriteLayers));
          let slz = Math.floor(100 * (spriteLayers - i));
          let simage = skylineImages[i % skylineImages.length]
  
          skylineData.push(
            {
              img: simage,
              x: slx,
              y: sly,
              zindex: slz,
              scale: 100
            }
          )
  
        }
      }
  
      // reverse Z
      spriteData.sort((a, b) => {
        return a.zindex - b.zindex;
      });
  
      this.state = { spriteData: spriteData, skylineData: skylineData, spriteLayers: spriteLayers, cityData: cityData, cityImages: cityImages}
    }
  
    
  
    render() {    
      
  
      return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
          {this.state.spriteData.map((spriteData, index) => (
            <img src={spriteData.img}  style={{ position: "absolute", left: (spriteData.x ).toString() + "%",  top: (spriteData.y).toString() + "%",  width: spriteData.scale.toString() + "vmin", height: "auto", zIndex: (spriteData.zindex).toString(), transform: "rotate(" + spriteData.rotation + "deg)"}}  alt="" key={"copsprite_" + index}/>
         ))}
         {this.state.skylineData.map((skylineData, index) => (
            <img src={skylineData.img}  style={{ position: "absolute", left: (skylineData.x ).toString() + "%",  top: (skylineData.y).toString() + "%",  width: skylineData.scale.toString() + "%", height: "auto", zIndex: (skylineData.zindex).toString()}}  alt="" key={"skyline_" + index}/>
         ))}
         {this.state.cityData.map((cityData, index) => (
            <img src={cityData.img}  style={{ position: "absolute", left: (cityData.x ).toString() + "%",  top: (cityData.y).toString() + "%",  width: cityData.scale.toString() + "%", height: "auto", zIndex: (cityData.zindex).toString()}}  alt="" key={"citysprite_" + index}/>
         ))}
        </div>
      );
    }
  
  
    componentDidUpdate(prevProps, prevState) {
      console.log("game componentDidUpdate " + this.props.gameDefundCount);
      console.log(this.props);
      if(prevProps.gameDefundCount === 0 && this.props.gameDefundCount !== 0) {
        
  
  
        let spriteData = this.state.spriteData;
        for(var i = 0; i < this.props.gameDefundCount; i++) {
          spriteData.pop();
        }
        this.setState((state, props) => ({
          spriteData : spriteData
        }));
      }
      if(prevProps.gameFundCount == 0 && this.props.gameFundCount != 0)
      {
        let cityData = this.state.cityData;
        if(this.props.gameFundCount > 0) {
          let newCityItem = this.getNewCityItem();
          console.log("newCityItem " + newCityItem);
          cityData.push(newCityItem);
        }else{
          cityData.pop();
        }
        this.setState((state, props) => ({
          cityData : cityData
        }));
  
      }
    }
  
    getNewCityItem = () => {
  
  
      let img = this.state.cityImages[Math.floor(Math.random() * this.state.cityImages.length)];
  
      
      let zHack = this.state.spriteLayers - Math.floor((this.state.spriteLayers * (this.state.cityData.length / 50)) % this.state.spriteLayers);
  
      let x = Math.floor(Math.random() * 100);
      let y = Math.floor(80 - (1 - (zHack / this.state.spriteLayers)) * 60);
      
      let z = Math.floor(100 * (zHack + Math.random()));
  
      return {
          img: img,
          x: x,
          y: y,
          zindex: z,
          scale: 10
        };
    }
  }

  export default Game;