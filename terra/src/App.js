import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const pathname = window.location.pathname
    if(pathname.toString().toLowerCase() === '/editor'){
      setSelectedNavItem('editor');
    }
    if(pathname.toString().toLowerCase() === '/simulation' || pathname.toString().toLowerCase() === '/'){
      setSelectedNavItem('simulation');
    }
  });
  

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
            <Simulation />
          </Route>
          <Route path="/editor">
            <MapEditor />
          </Route>
          <Route path="/" >
            <Simulation />
          </Route>

        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
