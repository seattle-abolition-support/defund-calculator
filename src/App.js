import React from 'react';
import './App.css';
import { isMobile } from 'mobile-device-detect';

import Game from './Game'

import Data from "./data.json";
import LittleCheckMark from "./images/interface stuff/little-check-mark.svg"
import LittleShield from "./images/interface stuff/little-shield.svg"

// import Batton from "./images/cop stuff/batton.svg"
// import BigBadge from "./images/cop stuff/big-badge.svg"
// import CopCar from "./images/cop stuff/cop-car.svg"
// import GasMask from "./images/cop stuff/gas-mask.svg"
// import Gun from "./images/cop stuff/gun.svg"
// import Handcuffs from "./images/cop stuff/handcuffs.svg"
// import Helicopter from "./images/cop stuff/helicopter.svg"
// import Motorcycle from "./images/cop stuff/motorcycle.svg"
// import Vest from "./images/cop stuff/vest.svg"
// import WalkieTalkie from "./images/cop stuff/walkie-talkie.svg"

// import Carrot from "./images/city stuff/carrot.svg"
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: Data,
      selectedCategory: Data.Categories[0],
      statusMessage: Data.InitStatusMessage,
      categoriesUnlocked: false,
      showMe: false,
      gameDefundCount: 0,
      gameFundCount: 0,
      levelUp: 0
    };

    console.log("isMobile2: " + isMobile);
    this.recalculateBudgets();
    
  }
  

  // On every change, recalculate budgets
  recalculateBudgets = () =>  {
    console.log("recalculateBudgets");
    
      
    var d = this.state.data;
    var message = this.state.statusMessage;

    // Get total allocated community budget. Items from all categories x comminityItemCost
    d.AllocatedCommunityBudget = 0;
    for (var i in d.Categories) {
      var cat = d.Categories[i];
      cat.Total = d.CommunityItemCost * cat.ItemList.length;
      d.AllocatedCommunityBudget += cat.Total;
    }
    
    // Calculate police and commuinity budget
    d.TotalPoliceBudget = d.StartOfficerCount * d.CostPerOfficer;
    d.CurrentPoliceBudget = d.CurrentOfficerCount * d.CostPerOfficer;
    d.TotalCommunityBudget = d.TotalPoliceBudget - d.CurrentPoliceBudget;
    d.AvailableCommunityBudget = d.TotalCommunityBudget - d.AllocatedCommunityBudget;

    // Unlock the category buttons when there's enough available community budget to buy something
    console.log("CategoriesUnlocked " + d.AvailableCommunityBudget + " " + d.CommunityItemCost);
    let categoriesUnlocked = this.state.categoriesUnlocked;
    if(d.AvailableCommunityBudget >= d.CommunityItemCost) {
      // If categories weren't unlocked, show the unlock message.
      if(! categoriesUnlocked){
        message = d.UI.CategoriesUnlockedText;
      }
      categoriesUnlocked = true;  
    }


    // Level up when you have allocated LevelUpCount items. Multiplies allocations x LevelUpMultiplier
    let levelUp = this.state.levelUp;
    if(this.state.levelUp === 0){
      console.log("Level Up Check " + (d.AllocatedCommunityBudget / d.CommunityItemCost) + " " + d.LevelUpCount);
      if(d.AllocatedCommunityBudget / d.CommunityItemCost >= d.LevelUpCount) {
        console.log("Level up");
        levelUp = 1;
        message = d.UI.LevelUpText;
      }
    }
    
    // Set state. Update data, message, categoriesUnlocked, levelUp
    this.setState((state, props) => ({
      data: d,
      statusMessage: message,
      categoriesUnlocked: categoriesUnlocked,
      levelUp: levelUp
    }));
  }



  // Defunc. c is the number to defund
  defund = (c) =>  {
    var d = this.state.data;

    // Defund c officers
    d.CurrentOfficerCount = d.CurrentOfficerCount - c;
    //console.log("CurrentOfficerCount: " + d.CurrentOfficerCount);

    // If zero officers left, victory!
    if(d.CurrentOfficerCount <= 0)
    {
      // TBD
      // Victory dialog
      d.CurrentOfficerCount = 0;
      // VICTORY!!!
    }

    // Check to see which button has Number = c. Store the idx in gameDefundCount.
    // gameDefundCount is passed to the game to trigger update type 1, 2, or 3.
    let gameDefundCount = 0;
    for(var i = 0; i < d.DefundButtons.length; i++){
      if(c === parseInt(d.DefundButtons[i].Number)) {
        gameDefundCount = i + 1;
      }
    }

    // Update the officer counts, gameDefundCount, and update the status message to a cop phrase
    this.setState((state, props) => ({
      data : d,
      gameDefundCount : gameDefundCount,
      statusMessage : d.UI.CopPhrases[Math.floor(Math.random() * d.UI.CopPhrases.length)]
    }), () => this.recalculateBudgets());


  }

  

  selectCategory = (cat) =>  {
    this.setState((state, props) => ({
      selectedCategory : cat,
      statusMessage : cat.Description
    }));
  }

  // Allocate community funds. If n > 0, allocate. Else, deallocate
  allocate = (n) =>  {
    
    let d = this.state.data;

    // Get the index of the currently selected category.
    let idx = 0
    for(var i in d.Categories) {
      if(d.Categories[i].Name === this.state.selectedCategory.Name) {
        idx = i;
      }
    }
    
    let message = this.state.statusMessage;
    let updated = false;
    let gameFundCount = 0;

    // n > 0 means allocate
    if(n > 0) {
      if(this.state.data.AvailableCommunityBudget >= this.state.data.CommunityItemCost) {

        // Pick a random item from the selected category.
        let item = Math.floor(Math.random() * d.Categories[idx].Items.length);
        //console.log("item: " + item + " " + d.Categories[idx].Items[item]);

        if(this.state.levelUp === 0) {
          // If not leveled up, just add one item
          d.Categories[idx].ItemList.push(item);
        } else {
          // If leveled up, add LevelUpMultipler items
          console.log("levelUp" + this.state.levelUp + " itemsToAdd: " + d.LevelUpMultiplier);
          for(var count = 0; count < d.LevelUpMultiplier; count++) {
            d.Categories[idx].ItemList.push(item);
          }
        }

        // Kind of hack formatting for the item message. The quantity for the item is marked with #123#   
        let itemText = d.Categories[idx].Items[item];
        let re = /#(\d+)#/;
        let m = itemText.match(re);
        if(m) {
          if(this.state.levelUp === 0) {
            // If not leveled up, just use the digit
            itemText = itemText.replace(m[0], m[1]);
          } else {
            // If leveled up, multiply the digit by 10
            itemText = itemText.replace(m[0], (parseInt(m[1]) * 10).toString());
          }
        }
        message = d.UI.FundedText + itemText;

        // These are used for updating state after render.
        updated = true;
        gameFundCount = 1;
      }
    }
    else if(this.state.selectedCategory.ItemList.length > 0)
    {
      // n < 1 means deallocate
      console.log("in deallocate itemlist.length:" + d.Categories[idx].ItemList.length);
      if(this.state.levelUp === 0) {
        // If not leveled up, just remove one item
        console.log("not leveled. itemlist.length: " + d.Categories[idx].ItemList.length);
        d.Categories[idx].ItemList.pop();
      } else {
        console.log("leveled. ")
        // If leveled up, add LevelUpMultipler items
        for(var count = 0; count < d.LevelUpMultiplier; count++) {
          if(d.Categories[idx].ItemList.length > 0) {
            d.Categories[idx].ItemList.pop();
          }
        }
      }
      
      message = d.UI.DeallocateText;

      // These are used for updating state after render.
      updated = true;
      gameFundCount = -1;
    }
    if(updated) {
      this.setState((state, props) => ({
        data : d,
        statusMessage : message,
        gameFundCount : gameFundCount
      }), () => this.recalculateBudgets());
    }
  }

  

  

  toggleShowMe = () => {
    if(this.state.data.AllocatedCommunityBudget > 0) {
      this.setState((state, props) => ({
        showMe : (! state.showMe)
      }));
    }
  }

  formatDollars = (s) =>  {
    return "$" + s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.gameDefundCount !== 0) {
      //console.log("componentDidUpdate");
      //console.log("gameDefundCount " + this.state.gameDefundCount);
      this.setState((state, props) => ({
        gameDefundCount : 0
      }));
    }

    if(this.state.gameFundCount != 0) {
      //console.log("componentDidUpdate FUND");
      //console.log("gameFundCount " + this.state.gameFundCount);
      this.setState((state, props) => ({
        gameFundCount : 0
      }));
    }
  }
  

  render() {
    console.log("in render");
    //console.log(this.state.data.UI.MainTitle);

    let categoryButtonClass = "CategoryButton";
    let selectedCategoryClass = "CategoryButtonSelected";
    let allocateButtonClass = "AllocateButton"
    let deallocateButtonClass = "AllocateButton"
    let showMeButtonClass = "ShowMeButton"

    if(!this.state.categoriesUnlocked)
    {
      categoryButtonClass = "CategoryButtonDisabled";
      selectedCategoryClass = "CategoryButtonDisabled";
      allocateButtonClass = "AllocateButtonDisabled";
    }
    if(this.state.data.AvailableCommunityBudget < this.state.data.CommunityItemCost) {
      allocateButtonClass = "AllocateButtonDisabled";
    }
    if(this.state.selectedCategory.ItemList.length === 0) {
      deallocateButtonClass = "AllocateButtonDisabled";
    }
    if(this.state.data.AllocatedCommunityBudget === 0) {
      showMeButtonClass = "ShowMeButtonDisabled";
    }

    
    return (
    
      

    <div className="App">
      
      {this.state.showMe ? 
          <ShowMePage data={this.state.data} formatDollars={this.formatDollars} toggleShowMe={this.toggleShowMe}/> : null
      }
      <div className="Main" style={(isMobile) ? {} : {width: "500px"}}>
        
        <div className="MainTitle">{this.state.data.UI.MainTitle}</div>
        <div className="DefundButtonDiv">
          {this.state.data.DefundButtons.map((b, index) => (
            <div className="DefundButton" onClick={() => this.defund(b.Number)}>
            <div>{b.Number}</div>
            <div>{b.Label}</div>
          </div>
          ))}
        </div>
        <div className="Screen">
          <div className="ScoreRow">
            <div>{this.formatDollars(this.state.data.TotalCommunityBudget.toString())} <img src={LittleCheckMark} alt="A little check mark." /></div>
            <div className="BudgetBar" style={{ gridTemplateColumns : this.state.data.TotalCommunityBudget + "fr " +  this.state.data.CurrentPoliceBudget + "fr"}}>
              <div className="GoodBar"/>
              <div className="BadBar"/></div>
            <div><img src={LittleShield} alt="A little badge." /> {this.formatDollars(this.state.data.CurrentPoliceBudget.toString())}</div>
          </div>
          <div> {this.state.data.ScreenMessage}</div>
          <div className="GameArea">
           
            <Game gameDefundCount = {this.state.gameDefundCount} gameFundCount = {this.state.gameFundCount}/>
          </div>
        </div>
        <div className="StatusTextBox">
          {console.log(this.state.statusMessage.split("|"))}
          {this.state.statusMessage.split("|").map((s, i) => (
            <div key={i}>{s}</div>
          ))}
          
        </div>
        <div className="MiddleContainer">
          <div className="AvailableTextBox">
              {this.state.data.UI.AvailableBudgetText.replace("$BUDGET", this.formatDollars(this.state.data.AvailableCommunityBudget.toString()))}
          </div>
          <div className="AllocateButtonDiv">
              <div className={allocateButtonClass} onClick={() => this.allocate(1)}>
              +
              </div>
              <div className={deallocateButtonClass} onClick={() => this.allocate(-1)}>
              &#8212; 
              </div>
          </div>
        </div>
        <div className="CategoryDiv">
          {this.state.data.Categories.map((cat, index) => (
            <div className={(this.state.selectedCategory === cat) ? selectedCategoryClass : categoryButtonClass} onClick={() => this.selectCategory(cat)} key={cat.Name}><div>{cat.Name}</div><div>{this.formatDollars(cat.Total.toString())}</div></div>
          ))}
        </div>
        <div className="HorizontalRule" />
        <div className="BottomButtonDiv">
          <div className={showMeButtonClass} onClick={() => this.toggleShowMe()}>
            {this.state.data.UI.ShowMeText}
          </div>
          <div className="ResourcesButton">
            {this.state.data.UI.ResourcesText}
          </div>
          <div className="AboutButton">
            {this.state.data.UI.AboutText}
          </div>
        </div>
      </div>
    </div>
    );
  }
}

// class Game extends React.Component {
  
//   constructor(props) {
//     super(props);

//     // let copImages = [Batton, BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, Vest, WalkieTalkie];
//     // let baseScale = [.5, .7, 1, 1.0, 1, .7, 1.1, 1.1, .5, .3];
//     // let baseRotation = [180, 30, 30, 90, 180, 180, 45, 0, 0, 90  ];

//     let copImages = [BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, WalkieTalkie];
//     let baseScale = [.7, 1, 1.0, 1, .7, 1.1, 1.1, .3];
//     let baseRotation = [30, 30, 90, 180, 180, 45, 0, 90  ];

//     let cityImages = [Carrot, Crayon, MedicalWorker, PrideFlag, Rainbow, RedApple, TownHouses, Tulip]
    

//     let skylineImages = [Skyline0, Skyline1, Skyline2, Skyline3, Skyline4];

//     let spriteLayers = 5;
//     let baseLayerCount = 9;
//     let spriteData = [];
//     let cityData = [];
//     let skylineData = [];
//     for (var i = 0; i < spriteLayers; i++) {

//       var layerScale = 1 - ((i / spriteLayers) * .5);
//       var layerCount = Math.floor(baseLayerCount / layerScale);
//       for(var j = 0; j < layerCount; j++) {
//         let imgIdx = Math.floor(Math.random() * copImages.length);
//         let x = -10 + 120 * (j / layerCount);
//         let y = 70 - 80 * (i / spriteLayers);
//         let z = Math.floor(100 * ((spriteLayers - i) + Math.random()));
//         let s = layerScale * 30 * baseScale[imgIdx];

//         spriteData.push(
//           {
//             x: x,
//             y: y,
//             img: copImages[imgIdx],
//             scale: s,
//             rotation: 0,//Math.floor((Math.random() * baseRotation[imgIdx]) - (baseRotation[imgIdx] * .5))
//             zindex: z
//           }
//         )

//         let slx = 0;
//         let sly = 70 - (60 * (i / spriteLayers));
//         let slz = Math.floor(100 * (spriteLayers - i));
//         let simage = skylineImages[i % skylineImages.length]

//         skylineData.push(
//           {
//             img: simage,
//             x: slx,
//             y: sly,
//             zindex: slz,
//             scale: 100
//           }
//         )

//       }
//     }

//     // reverse Z
//     spriteData.sort((a, b) => {
//       return a.zindex - b.zindex;
//     });

//     this.state = { spriteData: spriteData, skylineData: skylineData, spriteLayers: spriteLayers, cityData: cityData, cityImages: cityImages}
//   }

  

//   render() {    
    

//     return (
//       <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
//         {this.state.spriteData.map((spriteData, index) => (
//           <img src={spriteData.img}  style={{ position: "absolute", left: (spriteData.x ).toString() + "%",  top: (spriteData.y).toString() + "%",  width: spriteData.scale.toString() + "vmin", height: "auto", zIndex: (spriteData.zindex).toString(), transform: "rotate(" + spriteData.rotation + "deg)"}}  alt="" key={"copsprite_" + index}/>
//        ))}
//        {this.state.skylineData.map((skylineData, index) => (
//           <img src={skylineData.img}  style={{ position: "absolute", left: (skylineData.x ).toString() + "%",  top: (skylineData.y).toString() + "%",  width: skylineData.scale.toString() + "%", height: "auto", zIndex: (skylineData.zindex).toString()}}  alt="" key={"skyline_" + index}/>
//        ))}
//        {this.state.cityData.map((cityData, index) => (
//           <img src={cityData.img}  style={{ position: "absolute", left: (cityData.x ).toString() + "%",  top: (cityData.y).toString() + "%",  width: cityData.scale.toString() + "%", height: "auto", zIndex: (cityData.zindex).toString()}}  alt="" key={"citysprite_" + index}/>
//        ))}
//       </div>
//     );
//   }


//   componentDidUpdate(prevProps, prevState) {
//     console.log("game componentDidUpdate " + this.props.gameDefundCount);
//     console.log(this.props);
//     if(prevProps.gameDefundCount === 0 && this.props.gameDefundCount !== 0) {
      


//       let spriteData = this.state.spriteData;
//       for(var i = 0; i < this.props.gameDefundCount; i++) {
//         spriteData.pop();
//       }
//       this.setState((state, props) => ({
//         spriteData : spriteData
//       }));
//     }
//     if(prevProps.gameFundCount == 0 && this.props.gameFundCount != 0)
//     {
//       let cityData = this.state.cityData;
//       if(this.props.gameFundCount > 0) {
//         let newCityItem = this.getNewCityItem();
//         console.log("newCityItem " + newCityItem);
//         cityData.push(newCityItem);
//       }else{
//         cityData.pop();
//       }
//       this.setState((state, props) => ({
//         cityData : cityData
//       }));

//     }
//   }

//   getNewCityItem = () => {


//     let img = this.state.cityImages[Math.floor(Math.random() * this.state.cityImages.length)];

    
//     let zHack = this.state.spriteLayers - Math.floor((this.state.spriteLayers * (this.state.cityData.length / 50)) % this.state.spriteLayers);

//     let x = Math.floor(Math.random() * 100);
//     let y = Math.floor(80 - (1 - (zHack / this.state.spriteLayers)) * 60);
    
//     let z = Math.floor(100 * (zHack + Math.random()));

//     return {
//         img: img,
//         x: x,
//         y: y,
//         zindex: z,
//         scale: 10
//       };
//   }
// }

class ShowMePage extends React.Component {
  
  // constructor(props) {
  //   super(props);


  //   this.state = { spriteData: spriteData}
  // }

  

  render() {    
    const d = this.props.data;
    let displayCategories = [];

    // Loop through each category
    for(var i = 0; i < d.Categories.length; i++) {
      var cat = d.Categories[i]
      let displayItems = []

      // Loop through each category item
      for(var j = 0; j < cat.Items.length; j++) {

        // function in a loop warning
        //var result = cat.ItemList.filter((x) => x === j).length;
        var result = 0;
        for(var idx = 0; idx < cat.ItemList.length; idx++) {
          result = (cat.ItemList[idx] === j) ? result + 1 : result;
        }
        
        

        // If any items are allocated, add a display string
        if(result > 0) {
          var displayString = cat.Items[j]; 

          var m = displayString.match("#(.+)#");
          if(m) {

            var replace = m[0]
            var count = parseInt(m[1]) * result;
            displayString = displayString.replace(replace, count);
          }
          displayItems.push(displayString);
        }
      }

      // If there are display strings for the category, add them to the list to be displayed
      if(displayItems.length > 0) {
        displayCategories.push(
          {
            "category" : cat.Name,
            "displayItems" : displayItems,
            "total" : this.props.formatDollars((cat.ItemList.length * d.CommunityItemCost).toString())
          }
        )
      }
    }


    return (
      <div className="ShowMeScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        <div className="ShowMeTitle">FUNDED!</div>
        {displayCategories.map((c) => (
          <div key={"showme_" + c.category}>
            <div className="ShowMeCategoryContainer">
              <div className="ShowMeCategory">{c.category}</div>
              <div className="ShowMeCategoryTotal">{c.total}</div>
            </div>
            <div>
              {c.displayItems.map((item) => (
              <div className="ShowMeItem">{item}</div>
              ))}
            </div>
          
          </div>
        ))}
        <div className="ReturnToDefundButton" onClick={() => this.props.toggleShowMe()}>{this.props.data.UI.ReturnToDefundText}</div>
      </div>
    );
  }
}

