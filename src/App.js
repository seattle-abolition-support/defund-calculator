import React from 'react';
import './App.css';
import { isMobile } from 'mobile-device-detect'

import Game from './Game'

import Data from "./data.json";
import LittleCheckMark from "./images/interface stuff/little-check-mark.svg"
import LittleShield from "./images/interface stuff/little-shield.svg"

import VictoryRainbow from "./images/city stuff/rainbow.svg"
import VictorySunWithFace from "./images/city stuff/sun-with-face.svg"

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: Data,
      statusMessage: Data.InitStatusMessage,
      categoriesUnlocked: false,
      showMe: false,
      showResources: false,
      showAbout: false,
      showVictory: false,
      gameDefundCount: 0,
      gameFundCount: 0,
      levelUp: 0,
      showLevelUp: false,
      easterEggCount: 0,
      showEasterEgg: false,
      currentEasterEgg: 0
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
    let showLevelUp = false;
    if(this.state.levelUp === 0){
      //console.log("Level Up Check " + (d.AllocatedCommunityBudget / d.CommunityItemCost) + " " + d.LevelUpCount);
      if(d.AllocatedCommunityBudget / d.CommunityItemCost >= d.LevelUpCount) {
        //console.log("Level up");
        levelUp = 1;
        showLevelUp = true;
        message = d.UI.LevelUpText;
      }
    }

    
    // Show easter egg when you have allocated easterEggTarget times.
    let showEasterEgg = this.state.showEasterEgg;
    let easterEggCount = this.state.easterEggCount;
    let currentEasterEgg = this.state.currentEasterEgg;
    console.log("Easter egg check " + easterEggCount + " " + d.EasterEggInterval);
    if(easterEggCount >= d.EasterEggInterval) {
      console.log("Show easter egg!");
      easterEggCount = 0;
      currentEasterEgg = (currentEasterEgg + 1) % d.EasterEggs.length;
      showEasterEgg = true;
    } else
    {
      easterEggCount += 1;
    }
    
    // Set state. Update data, message, categoriesUnlocked, levelUp
    this.setState((state, props) => ({
      data: d,
      statusMessage: message,
      categoriesUnlocked: categoriesUnlocked,
      levelUp: levelUp,
      showLevelUp: showLevelUp,
      easterEggCount: easterEggCount,
      showEasterEgg: showEasterEgg,
      currentEasterEgg: currentEasterEgg
    }));
  }



  // Defunc. c is the number to defund
  defund = (c) =>  {
    var d = this.state.data;

    // Defund c officers
    d.CurrentOfficerCount = d.CurrentOfficerCount - c;
    //console.log("CurrentOfficerCount: " + d.CurrentOfficerCount);

    // If zero officers left, victory!
    let showVictory = this.state.showVictory;
    if(d.CurrentOfficerCount <= 0)
    {
      // TBD
      // Victory dialog
      showVictory = true;
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
      statusMessage : d.UI.CopPhrases[Math.floor(Math.random() * d.UI.CopPhrases.length)],
      showVictory: showVictory
    }), () => this.recalculateBudgets());


  }

  

  selectCategory = (cat) =>  {
    let d = this.state.data;
    let idx = 0;
    for(var i = 0; i < d.Categories.length; i++){
      if(d.Categories[i].Name === cat.Name) {
        idx = i;
        break;
      }
    }
    console.log("categoryIdx: " + idx);

    let message = cat.Messages[cat.CurrentMessage]
    d.Categories[idx].CurrentMessage = (d.Categories[idx].CurrentMessage + 1) % d.Categories[idx].Messages.length;

    this.setState((state, props) => ({
      selectedCategory : cat,
      statusMessage : message,
      data: d
    }));
  }

  // Allocate community funds. If n > 0, allocate. Else, deallocate
  allocate = (n) =>  {
    
    let d = this.state.data;

    if(! this.state.selectedCategory) {
      return;
    }

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
        for(var multiplier = 0; multiplier < d.LevelUpMultiplier; multiplier++) {
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

  

  
  // toggles the Show Me What I've Funded page
  toggleShowMe = () => {
    if(this.state.data.AllocatedCommunityBudget > 0) {
      this.setState((state, props) => ({
        showMe : (! state.showMe)
      }));
    }
  }


  // toggles the Resources page
  toggleResources = () => {
    this.setState((state, props) => ({
      showResources : (! state.showResources)
    }));
  }

  // toggles the About page
  toggleAbout = () => {
    this.setState((state, props) => ({
      showAbout : (! state.showAbout)
    }));
  }

  // toggles the Victory page
  toggleVictory = () => {
    this.setState((state, props) => ({
      showVictory : (! state.showVictory)
    }));
  }

  // toggles the Easter Egg page
  toggleEasterEgg = () => {
    this.setState((state, props) => ({
      showEasterEgg : (! state.showEasterEgg),
    }));
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

    if(this.state.gameFundCount !== 0) {
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
    if(!this.state.selectedCategory || this.state.data.AvailableCommunityBudget < this.state.data.CommunityItemCost) {
      allocateButtonClass = "AllocateButtonDisabled";
    }
    if(!this.state.selectedCategory || this.state.selectedCategory.ItemList.length === 0) {
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
      {this.state.showResources ? 
          <ResourcesPage data={this.state.data} toggleResources={this.toggleResources}/> : null
      }
      {this.state.showAbout ? 
          <AboutPage data={this.state.data} toggleAbout={this.toggleAbout}/> : null
      }
      {this.state.showVictory ? 
          <VictoryPage data={this.state.data} toggleVictory={this.toggleVictory}/> : null
      }
      {this.state.showEasterEgg ? 
          <EasterEggPage data={this.state.data} toggleEasterEgg={this.toggleEasterEgg} currentEasterEgg={this.state.currentEasterEgg}/> : null
      }

      <div className="Main">
        
        <div className="MainTitle">{this.state.data.UI.MainTitle}</div>
        <div className="DefundButtonDiv">
          {this.state.data.DefundButtons.map((b, index) => (
            <div className="DefundButton" onClick={() => this.defund(b.Number)}>
            <div>{b.Number}</div>
            <div className="officers">{b.Label}</div>
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
           
            <Game gameDefundCount = {this.state.gameDefundCount} gameFundCount = {this.state.gameFundCount} showLevelUp = {this.state.showLevelUp}/>
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
              {this.state.data.UI.AvailableBudgetText} <br/>
              {this.formatDollars(this.state.data.AvailableCommunityBudget.toString())}
          </div>
          <div className="AllocateButtonDiv">
              <div className={allocateButtonClass} onClick={() => this.allocate(1)}>
              +
              </div>
              <div className={deallocateButtonClass} onClick={() => this.allocate(-1)}>
              &#8211; 
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
          <div className="ResourcesButton" onClick={() => this.toggleResources()}>
            {this.state.data.UI.ResourcesText}
          </div>
          <div className="AboutButton" onClick={() => this.toggleAbout()}>
            {this.state.data.UI.AboutText}
          </div>
        </div>
      </div>
    </div>
    );
  }
}


class ShowMePage extends React.Component {
  

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


class ResourcesPage extends React.Component {
  

  render() {    
    const d = this.props.data;
    


    return (
      <div className="ResourcesScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        <div className="ShowMeTitle">RESOURCES</div>
        {d.Resources.map((resource, index) => (
          <div key={"resources_" + index} className="ResourceButton">
              <p key={"resourceTitle_" + index}>{resource.Title}</p>     
              {resource.Links.map((link, linkindex) => (
                <p key={"resourcelink_" + index + "_" + linkindex} className="ResourceLink" ><a href={link.Url} style={{textDecoration: "none"}} target="_blank" rel="noreferrer">{link.Text}</a></p>
              ))}   
          </div> 
        ))}

        <div className="ReturnToDefundButton" onClick={() => this.props.toggleResources()}>{this.props.data.UI.ReturnToDefundText}</div>
      </div>
    );
  }
}

class AboutPage extends React.Component {
  

  render() {    
    //const d = this.props.data;

    return (
      <div className="AboutScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        <div className="ShowMeTitle">ABOUT</div>
        <div>
          <p>Some text here about how we arrived at different amounts for police budget / police officer defunding, and sources of information.</p>
          <p>Information on how PB works</p>
          <p>(info graphic and/or video?)</p>
          <p>Credits: Developed by PB Creators, Seattle Abolition Support / Defend the Defund</p>
          <p><a href="mailto: something">EMAIL</a></p>
        </div>
        <div className="ReturnToDefundButton" onClick={() => this.props.toggleAbout()}>{this.props.data.UI.ReturnToDefundText}</div>
        
      </div>
    );
  }
}

class VictoryPage extends React.Component {
  

  render() {    
    //const d = this.props.data;

    return (
      <div className="VictoryScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        <div className="ShowMeTitle">VICTORY!</div>
        <div>
          <img src={VictorySunWithFace} alt="A sun with a face." style={{width: "75%"}}/>
          <p>CONGRATULATIONS!</p> 
          <p>YOU HAVE ABOLISHED THE SEATTLE POLICE DEPARTMENT!</p> 
          <p>JOIN THE EFFORT AT:</p>
          <p><a href="bit.ly/DefendTheDefund">bit.ly/DefendTheDefund</a></p>
          <img src={VictoryRainbow} alt="A rainbow."  style={{width: "75%"}}/>
        </div>
        <div className="VictoryReturnButton" onClick={() => this.props.toggleVictory()}>{this.props.data.UI.VictoryReturnText}</div>
        
      </div>
    );
  }
}

class EasterEggPage extends React.Component {
  

  render() {    
    const d = this.props.data;
    let egg = d.EasterEggs[this.props.currentEasterEgg];
    console.log(d.EasterEggs);
    console.log("egg: " + egg);
    return (
      <div className="EasterEggScreen" style={(isMobile) ? {} : {width: "500px", left: "50%", transform: "translateX(-50%)"}}>
        <div className="EasterEggTitle">{d.UI.EasterEggTitle}</div>
        
        <div className="EasterEggText">
          <p>{d.UI.EasterEggText}</p>
          <p>{egg.Logo}</p>
          {egg.Description}
          {egg.Links.map((link, index) => (
            <p><a href={link.Url} style={{textDecoration: "none"}} target="_blank" rel="noreferrer">{link.Text}</a></p>
          ))}
        </div>
        <link rel="import" href={process.env.PUBLIC_URL + '/resources.html'}/>
        <div className="ReturnToDefundButton" onClick={() => this.props.toggleEasterEgg()}>{this.props.data.UI.ReturnToDefundText}</div>
        
      </div>
    );
  }
}

