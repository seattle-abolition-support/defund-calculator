import React from 'react';
import './App.css';
import Data from "./data.json";
import LittleCheckMark from "./images/interface stuff/little-check-mark.svg"
import LittleShield from "./images/interface stuff/little-shield.svg"

import Batton from "./images/cop stuff/batton.svg"
import BigBadge from "./images/cop stuff/big-badge.svg"
import CopCar from "./images/cop stuff/cop-car.svg"
import GasMask from "./images/cop stuff/gas-mask.svg"
import Gun from "./images/cop stuff/gun.svg"
import Handcuffs from "./images/cop stuff/handcuffs.svg"
import Helicopter from "./images/cop stuff/helicopter.svg"
import Motorcycle from "./images/cop stuff/motorcycle.svg"
import Vest from "./images/cop stuff/vest.svg"
import WalkieTalke from "./images/cop stuff/walkie-talkie.svg"

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: Data,
      selectedCategory: Data.Categories[0],
      statusMessage: Data.InitStatusMessage,
      categoriesUnlocked: false,
      showMe: false
    };


    this.recalculateBudgets();
  }
  

  recalculateBudgets = () =>  {
    console.log("recalculateBudgets");
    
      
    var d = this.state.data;
    var message = this.state.statusMessage;

    d.AllocatedCommunityBudget = 0;

    for (var i in d.Categories) {
      var cat = d.Categories[i];
      cat.Total = cat.Cost * cat.ItemList.length;
      d.AllocatedCommunityBudget += cat.Total;
    }
    
    d.TotalPoliceBudget = d.StartOfficerCount * d.CostPerOfficer;
    d.CurrentPoliceBudget = d.CurrentOfficerCount * d.CostPerOfficer;
    d.TotalCommunityBudget = d.TotalPoliceBudget - d.CurrentPoliceBudget;
    d.AvailableCommunityBudget = d.TotalCommunityBudget - d.AllocatedCommunityBudget;

    console.log("CategoriesUnlocked " + d.AvailableCommunityBudget + " " + this.state.selectedCategory.Cost);
    let categoriesUnlocked = this.state.categoriesUnlocked;
    if(d.AvailableCommunityBudget >= this.state.selectedCategory.Cost) {
      // If categories weren't unlocked, show the unlock message.
      if(! categoriesUnlocked){
        message = d.UI.CategoriesUnlockedText
      }
      categoriesUnlocked = true;  
    }
    
    this.setState((state, props) => ({
      data: d,
      statusMessage: message,
      categoriesUnlocked: categoriesUnlocked
    }));
  }

  defund = (c) =>  {
    var d = this.state.data;

    console.log("c: " + c);
    console.log("CurrentOfficerCount: " + d.CurrentOfficerCount);
    d.CurrentOfficerCount = d.CurrentOfficerCount - c;
    console.log("CurrentOfficerCount: " + d.CurrentOfficerCount);

    if(d.CurrentOfficerCount <= 0)
    {
      d.CurrentOfficerCount = 0;
      // VICTORY!!!
    }
    this.setState((state, props) => ({
      data : d
    }), () => this.recalculateBudgets());

  }

  selectCategory = (cat) =>  {
    this.setState((state, props) => ({
      selectedCategory : cat,
      statusMessage : cat.Description
    }));
  }

  allocate = (n) =>  {
    
    let d = this.state.data;
    let idx = 0
    for(var i in d.Categories) {
      if(d.Categories[i].Name === this.state.selectedCategory.Name) {
        idx = i;
      }
    }
    
    let message = this.state.statusMessage;
    let updated = false;

    if(n > 0 && this.state.data.AvailableCommunityBudget >= this.state.selectedCategory.Cost) {
      let item = Math.floor(Math.random() * d.Categories[idx].Items.length);
      console.log("item: " + item + " " + d.Categories[idx].Items[item]);
      d.Categories[idx].ItemList.push(item);
      message = d.UI.FundedText + d.Categories[idx].Items[item].replaceAll("#","");
      updated = true;
    }
    else if(this.state.selectedCategory.ItemList.length > 0)
    {
      d.Categories[idx].ItemList.pop();
      message = d.UI.DeallocateText;
      updated = true;
    }
    if(updated) {
      this.setState((state, props) => ({
        data : d,
        statusMessage : message
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
  

  render() {
    console.log("in render");
    console.log(this.state.data.UI.MainTitle);

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
    if(this.state.data.AvailableCommunityBudget < this.state.selectedCategory.Cost) {
      allocateButtonClass = "AllocateButtonDisabled";
    }
    if(this.state.selectedCategory.ItemList.length == 0) {
      deallocateButtonClass = "AllocateButtonDisabled";
    }
    if(this.state.data.AllocatedCommunityBudget === 0) {
      showMeButtonClass = "ShowMeButtonDisabled";
    }

    
    return (
    
      

    <div className="App">
      {this.state.showMe ? 
        <ShowMePage data={this.state.data}/> : null
      }

      <div className="Main">
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
           
            <Game/>
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

class Game extends React.Component {
  
  constructor(props) {
    super(props);

    let copImages = [Batton, BigBadge, CopCar, GasMask, Gun, Handcuffs, Helicopter, Motorcycle, Vest, WalkieTalke];
    
    for(var img in copImages) {
      console.log("width: " + img.width);
    }


    let spriteData = [];
    for (var i = 0; i < 50; i++) {
      spriteData.push(
        {
          x: ((i % 10) * 10)  + Math.floor(Math.random() * 5),
          y: (Math.floor(i / 10) * 20) + Math.floor(Math.random() * 5),
          img: copImages[Math.floor(Math.random() * copImages.length)],
          scale: Math.floor(25 + Math.random() * 10)
        }
      )
    }

    this.state = { spriteData: spriteData}
  }

  

  render() {    
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
        {this.state.spriteData.map((spriteData) => (
          <img src={spriteData.img}  style={{ position: "absolute", left: (spriteData.x ).toString() + "%",  top: (spriteData.y).toString() + "%",  width: spriteData.scale.toString() + "vmin", height: "auto"}}/>
        ))}
      </div>
    );
  }
}

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
        var result = cat.ItemList.filter(x => x === j).length;

        // If any items are allocated, add a display string
        if(result > 0) {
          var displayString = cat.Items[j]; 
          if(displayString.search("#.+#")) {
            var m = displayString.match("#(.+)#");
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
            "displayItems" : displayItems
          }
        )
      }
    }


    return (
      <div className="ShowMeScreen">
        {displayCategories.map((c) => (
          <div>
            <div>{c.category}</div>
            <div>
              {c.displayItems.map((item) => (
              <div>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

