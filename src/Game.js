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

import LevelUpImage from "./images/interface stuff/level-up.svg"


class Game extends React.Component {
  
    // constructor(props) {
    //   super(props);
  
    //   // let copImages = [Batton, BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, Vest, WalkieTalkie];
    //   // let baseScale = [.5, .7, 1, 1.0, 1, .7, 1.1, 1.1, .5, .3];
    //   // let baseRotation = [180, 30, 30, 90, 180, 180, 45, 0, 0, 90  ];
  
    //   let copImages = [BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, WalkieTalkie];
    //   let baseScale = [.7, 1, 1.0, 1, .7, 1.1, 1.1, .3];
    //   let baseRotation = [30, 30, 90, 180, 180, 45, 0, 90  ];
  
    //   let cityImages = [Carrot, Crayon, MedicalWorker, PrideFlag, Rainbow, RedApple, TownHouses, Tulip]
      
  
    //   let skylineImages = [Skyline0, Skyline1, Skyline2, Skyline3, Skyline4];
  
    //   let zLayerCount = 5;
    //   let baseLayerCount = 9;
    //   let copData = [];
    //   let cityData = [];
    //   let skylineData = [];
    //   for (var i = 0; i < zLayerCount; i++) {
  
    //     var layerScale = 1 - ((i / zLayerCount) * .5);
    //     var layerCount = Math.floor(baseLayerCount / layerScale);
    //     for(var j = 0; j < layerCount; j++) {
    //       let imgIdx = Math.floor(Math.random() * copImages.length);
    //       let x = -10 + 120 * (j / layerCount);
    //       let y = 70 - 80 * (i / zLayerCount);
    //       let z = Math.floor(100 * ((zLayerCount - i) + Math.random()));
    //       let s = layerScale * 30 * baseScale[imgIdx];
  
    //       copData.push(
    //         {
    //           x: x,
    //           y: y,
    //           img: copImages[imgIdx],
    //           scale: s,
    //           rotation: 0,//Math.floor((Math.random() * baseRotation[imgIdx]) - (baseRotation[imgIdx] * .5))
    //           zindex: z
    //         }
    //       )
  
    //       let slx = 0;
    //       let sly = 70 - (60 * (i / zLayerCount));
    //       let slz = Math.floor(100 * (zLayerCount - i));
    //       let simage = skylineImages[i % skylineImages.length]
  
    //       skylineData.push(
    //         {
    //           img: simage,
    //           x: slx,
    //           y: sly,
    //           zindex: slz,
    //           scale: 100
    //         }
    //       )
  
    //     }
    //   }
  
    //   // reverse Z
    //   copData.sort((a, b) => {
    //     return a.zindex - b.zindex;
    //   });
  
    //   this.state = { copData: copData, skylineData: skylineData, zLayerCount: zLayerCount, cityData: cityData, cityImages: cityImages}
    // }
  
    constructor(props) {
      super(props);
  
      // let copImages = [Batton, BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, Vest, WalkieTalkie];
      // let baseScale = [.5, .7, 1, 1.0, 1, .7, 1.1, 1.1, .5, .3];
      // let baseRotation = [180, 30, 30, 90, 180, 180, 45, 0, 0, 90  ];
  
      let copImages = [BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, WalkieTalkie];
      let copLayers = [[1,3,4,6],[0,1,2,3,4,7],[0,2,3,4,7],[0,2,3,4,5,7],[0,2,3,4,5]];
      let baseScale = [.5, 1, 1.0, 1, .8, 1.4, 1.2, .3];
      let baseRotation = [30, 30, 90, 180, 180, 45, 0, 90  ];
  
      let cityImages = [Carrot, Crayon, MedicalWorker, PrideFlag, Rainbow, RedApple, TownHouses, Tulip]
      let cityLayers = [[0,1,2,3,5,6,7],[0,1,2,3,5,6],[1,2,3,6],[1,2,3,6],[3,4]];
      let skylineImages = [Skyline0, Skyline1, Skyline2, Skyline3, Skyline4];
  
      

      let copData = [];
      let cityData = [];
      let skylineData = [];
      
  
      let zLayerCount = 5;
      for(var i = 0; i < zLayerCount; i++){
        let slx = 0;
        let sly = 40 * (i / zLayerCount); // bottom of skyline images
        let slz = Math.floor(100 * (zLayerCount - i));
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


      
      for(var j = 0; j < zLayerCount; j++) {

        let copsPerRow = 12;
        for(i = 0; i < copsPerRow; i++){

          // 120 percent to make them go outside the x bounds
          let dCop = 120.0 / copsPerRow;
          let x = -10 + (dCop * i);
          let y = 70 * (j / zLayerCount); // skyline images use 40. trying to make cop stuff go higher
          
          

          let skylineZ = Math.floor(100 * (zLayerCount - j)); // same as above for skyline z: 100 per layer
          let zindex = skylineZ + Math.floor(Math.random() * 99); // random between layers

          //let imgIdx = Math.floor(Math.random() * copImages.length);
          
          let layerImages = copLayers[j];
          let layerIdx = Math.floor(Math.random() * layerImages.length)
          let imgIdx = layerImages[layerIdx];
          let img = copImages[imgIdx];
          

          let scale = 10 * baseScale[imgIdx];
          let rotation = 0;

          copData.push(
            {
              x: x,
              y: y,
              img: img,
              scale: scale,
              rotation: 0,//Math.floor((Math.random() * baseRotation[imgIdx]) - (baseRotation[imgIdx] * .5))
              zindex: zindex
            }
          )
        }
      }
      
  
      // reverse the list by Z order so the front ones get popped off first
      copData.sort((a, b) => {
        return a.zindex - b.zindex;
      });
  
      this.state = { copData: copData, skylineData: skylineData, zLayerCount: zLayerCount, cityData: cityData, cityImages: cityImages, cityLayers: cityLayers, showLevelUp:false}
    }
  
    render() {    
      
  
      return (
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
          {this.state.copData.map((copData, index) => (
            <img src={copData.img}  style={{ position: "absolute", left: (copData.x ).toString() + "%",  bottom: (copData.y).toString() + "%",  width: copData.scale.toString() + "vmin", height: "auto", zIndex: (copData.zindex).toString(), transform: "rotate(" + copData.rotation + "deg)"}}  alt="" key={"copsprite_" + index}/>
         ))}
         {this.state.skylineData.map((skylineData, index) => (
            <img src={skylineData.img}  style={{ position: "absolute", left: (skylineData.x ).toString() + "%",  bottom: (skylineData.y).toString() + "%",  width: skylineData.scale.toString() + "%", height: "auto", zIndex: (skylineData.zindex).toString()}}  alt="" key={"skyline_" + index}/>
         ))}
         {this.state.cityData.map((cityData, index) => (
            <img src={cityData.img}  style={{ position: "absolute", left: (cityData.x ).toString() + "%",  bottom: (cityData.y).toString() + "%",  width: cityData.scale.toString() + "%", height: "auto", zIndex: (cityData.zindex).toString()}}  alt="" key={"citysprite_" + index}/>
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

      // If gameDefundCount was 0 but isn't now, pop cop data
      if(prevProps.gameDefundCount === 0 && this.props.gameDefundCount !== 0) {
        let copData = this.state.copData;
        for(var i = 0; i < this.props.gameDefundCount; i++) {
          copData.pop();
        }
        this.setState((state, props) => ({
          copData : copData
        }));
      }

      // If gameFundCount was 0 but isn't now, add or remove some city items
      if(prevProps.gameFundCount === 0 && this.props.gameFundCount !== 0)
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

    defundCops = (count) => {

      

    }
  
    getNewCityItem = () => {
  
  
      
  
      
      let zHack = (this.state.cityData.length % this.state.zLayerCount);
      console.log("zHack: " + zHack);
      console.log("state.cityLayers: " + this.state.cityLayers);
      let layerImages = this.state.cityLayers[zHack];
      let layerIdx = Math.floor(Math.random() * layerImages.length)
      let imgIdx = layerImages[layerIdx];
      let img = this.state.cityImages[imgIdx];
      //let img = this.state.cityImages[Math.floor(Math.random() * this.state.cityImages.length)];

      let x = Math.floor(Math.random() * 90);
      let y = 90 * (zHack / this.state.zLayerCount); // skyline images use 40. trying to make city stuff go higher
      
      //let z = Math.floor(100 * (zHack + Math.random()));
      let skylineZ = Math.floor(100 * (this.state.zLayerCount - zHack)); // same as above for skyline z: 100 per layer
      let zindex = skylineZ + Math.floor(Math.random() * 99); // random between layers
  
      return {
          img: img,
          x: x,
          y: y,
          zindex: zindex,
          scale: 10
        };
    }
  }

  export default Game;