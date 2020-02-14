import React, {Component} from 'react';
import './main.scss';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Trees from './scenes/Trees'
import Triggers from './scenes/Triggers'
import Variables from './scenes/Variables'
import Header from './scenes/Header'

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route path="/trees" component={Trees} />
          <Route path="/triggers" component={Triggers} />
          <Route path="/variables" component={Variables} />
        </Switch>
      </Router>
    );
  }
}

export default App;
