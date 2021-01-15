import React, { useState } from 'react';
import './App.css';
import MapEditor from './components/Map/MapEditor';
import Simulation from './components/Simulation/Simulation';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  
  const [selectedNavItem, setSelectedNavItem] = useState('');

  function navButtonClicked(routeName){
    setSelectedNavItem(routeName);
  }

  return (
    <div className="App">
      <Router>
      <div>
        <nav className="navBar">
              <p className="navItem">Terra</p>
              <Link className={"navItem navBtn" + (selectedNavItem === 'simulation' ? ' selectedButtonNoBorder' : ' ')} to="/Simulation" 
                    onClick={() => navButtonClicked('simulation')}>Simulation</Link>
              <Link className={"navItem navBtn" + (selectedNavItem === 'editor' ? ' selectedButtonNoBorder' : ' ')} to="/Editor"
                    onClick={() => navButtonClicked('editor')}>Editor</Link>
        </nav>
        <Switch>
          <Route path="/simulation">
            {() => navButtonClicked('simulation')}
            <Simulation />
          </Route>
          <Route path="/editor">
            {() => navButtonClicked('editor')}
            <MapEditor />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
