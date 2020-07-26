import React from 'react';
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
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
              <Link className="navBtn" to="/Simulation">Simulation</Link>
              <Link className="navBtn" to="/Editor">Editor</Link>

        </nav>
        <Switch>
          <Route path="/simulation">
            <Simulation />
          </Route>
          <Route path="/editor">
            <MapEditor />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
