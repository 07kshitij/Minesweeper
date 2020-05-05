import React from 'react';
import './App.css';
import MinesweeperBoard from './components/minsweeperboard';
import StartPage from './components/startpage';
import NotFound from './components/notFound';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={StartPage} />
          <Route exact path='/board' component={MinesweeperBoard} />
          <Route exact path='/404' component={NotFound} />
          <Route exact path='/solution' component={MinesweeperBoard} />
          <Redirect to='/' />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;