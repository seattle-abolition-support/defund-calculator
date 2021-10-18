import React from 'react';
import './App.css';



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
        <div className="ShowMeScreen" >
          <div className="ShowMeTitle">FUNDED!</div>
          {displayCategories.map((c) => (
            <div key={"showme_" + c.category}>
              <div className="ShowMeCategoryContainer">
                <div className="ShowMeCategory">{c.category}</div>
                <div className="ShowMeCategoryTotal">{c.total}</div>
              </div>
              <div>
                {c.displayItems.map((item, index) => (
                <div className="ShowMeItem" key={"ShowMeItem_" + index}>{item}</div>
                ))}
              </div>
            
            </div>
          ))}
          <div className="ReturnToDefundButton" onClick={() => this.props.toggleShowMe()}>{this.props.data.UI.ReturnToDefundText}</div>
        </div>
      );
    }
  }


  export default ShowMePage