import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Data from "./data.json";



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      data: Data, 
      totalPoliceBudget: Data.startOfficerCount * Data.costPerOfficer,
      currentPoliceBudget: Data.startOfficerCount * Data.costPerOfficer, 
      totalPB: 0, 
      allocatedPB: 0,
      availablePB: 0, 
      minProjectCost: 0,
      projects: Data.PBProjects };

    this.handlePoliceDeallocate = this.handlePoliceDeallocate.bind(this);
    this.handleProjectAllocate = this.handleProjectAllocate.bind(this);
    this.handleProjectDeallocate = this.handleProjectDeallocate.bind(this);
    this.recalculateBudgets = this.recalculateBudgets.bind(this);

    this.recalculateBudgets();
  }
  
  recalculateBudgets() {

      var newAllocatedPB = 0;
      var min = 10000000;
      for (var i in this.state.projects) {
        newAllocatedPB += this.state.projects[i].count * this.state.projects[i].cost;
        if(this.state.projects[i].cost < min)
        {
          min = this.state.projects[i].cost
        }
      }
      console.log("min: " + min);


      this.setState((state, props) => ({
        totalPB: state.totalPoliceBudget - state.currentPoliceBudget,
        allocatedPB: newAllocatedPB,
        availablePB: (state.totalPoliceBudget - state.currentPoliceBudget) - newAllocatedPB,
        minProjectCost: min
      }));
      
  }

  handlePoliceDeallocate = count => {
    
    console.log("police deallocate");
    this.setState((state, props) => ({
      currentPoliceBudget: state.currentPoliceBudget - (count * this.state.data.costPerOfficer)
    }), () => this.recalculateBudgets());
    
  }

  handleProjectAllocate = projectName => {
    
    console.log("allocate");
    console.log(projectName);
    let newProjects = [...this.state.projects]
    for (var i in newProjects) {
      if (newProjects[i].name === projectName) {
        newProjects[i].count = newProjects[i].count + 1;
        break; //Stop this loop, we found it!
      }
    }
    console.log(newProjects);

    this.setState((state, props) => ({
      projects: newProjects
    }), () => this.recalculateBudgets());
    
  }
  handleProjectDeallocate = projectName => {
    
    console.log("deallocate");
    console.log(projectName);

    let newProjects = [...this.state.projects]
    for (var i in newProjects) {
      if (newProjects[i].name === projectName) {
        newProjects[i].count = newProjects[i].count - 1;
         break; //Stop this loop, we found it!
      }
    }
    console.log(newProjects);

    this.setState((state, props) => ({
      projects: newProjects
    }), () => this.recalculateBudgets());
  }


  

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <p>Defund Calculator</p>
      </header>
      <div className="main-container">
        <PoliceBudget 
          totalBudget = {this.state.totalPoliceBudget} 
          currentBudget={this.state.currentPoliceBudget} 
          costPerOfficer={this.state.data.costPerOfficer} 
          handlePoliceDeallocate={this.handlePoliceDeallocate}/>
       
        <PBBudget 
          totalPB={this.state.totalPB} 
          allocatedPB={this.state.allocatedPB} 
          availablePB={this.state.availablePB}
          minProjectCost={this.state.minProjectCost}/>
        <div className="project-container">
        {this.state.data.PBProjects.map(project => (
          <PBProject 
            key={project.name + "project"}
            project={project}
            availablePB = {this.state.availablePB}
            handleProjectAllocate={this.handleProjectAllocate} 
            handleProjectDeallocate={this.handleProjectDeallocate}  />
            
        ))}
        </div>
      </div>
    </div>
    );
  }
}

class PoliceBudget extends React.Component {
  // constructor(props) {
  //   super(props);
  //   //this.state = { };
  // }


  render() {
    //var totalBudgetFormat = "$" + this.props.totalBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var currentBudgetFormat = "$" + this.props.currentBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var costPerOfficer = "$" + this.props.costPerOfficer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div className="police-budget-column div-padding">
        <p>The median salary for one Seattle police officer is {costPerOfficer}.</p>
        <button onClick={() => this.props.handlePoliceDeallocate(1)}>Defund 1 officer!</button>
        <button onClick={() => this.props.handlePoliceDeallocate(10)}>Defund 10 officers!</button>
        {/*<p>Old police budget: {totalBudgetFormat}</p>*/}
        <p>Police budget: {currentBudgetFormat}</p>
      </div>
    );
  }
}

class PBBudget extends React.Component {
  // constructor(props) {
  //   super(props);
  //   //this.state = { };
  // }
  render() {
    var totalPBFormat = "$" + this.props.totalPB.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var allocatedPBFormat = "$" + this.props.allocatedPB.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var availablePBFormat = "$" + this.props.availablePB.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    


    var message = []
    
    if(this.props.totalPB === 0) {
      message.push("Participatory budgeting puts the budget for public health and safety into the hands of the community.");
      message.push("Defund some police to fund PB!");
      message.push("\u261A");
    } else if(this.props.availablePB < this.props.minProjectCost) {
      message.push("You've allocated all of your available PB.");
      message.push("Defund some police to fund more PB!");
      message.push("\u261A");
    } else {
      message.push("There is available PB budget!");
      message.push("Vote for the community-led initiatives you want to see!");
      message.push("\u261B");
    }

    return (
      <div className="pb-budget-column div-padding">
        {message.map((m, index) => (
          <p className="p-small" id={"message" + index}>{m}</p>
        ))}
        <p>Total PB funds: {totalPBFormat}</p>
        <p>Allocated PB funds: {allocatedPBFormat}</p>
        <p>Available PB funds: {availablePBFormat}</p>
      </div>
    );
  }
}

class PBProject extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { units: []}
    this.allocate = this.allocate.bind(this);
  }

  allocate() {
    this.props.handleProjectAllocate(this.props.project.name);
  } 
  deallocate() {
    this.props.handleProjectDeallocate(this.props.project.name);
  } 

  render() {

    var units = []
    for(let i = 0; i < this.props.project.count; i++) {
      units.push(this.props.project.unit)
    }
    return (
      <div className="project-column">
        <div>
          <p key={this.props.project.name + "count"}>{this.props.project.name}</p>
        </div>
        <div>
          {units.map((unit, index) => (
              <p className="p-small" key={unit + index}>{unit}</p>
          ))}
        </div>
        <div>
          <button 
            key={this.props.project.name + "deallocateButton"} 
            onClick={() => this.deallocate()}
            disabled={this.props.project.count < 1}>-</button>
          
          <button 
            key={this.props.project.name + "allocateButton"} 
            onClick={() => this.allocate()}
            disabled={this.props.project.cost > this.props.availablePB}>+</button>
        </div>
      </div>
    );
  }
}

