import React from 'react';
import './App.css';
// import ReactDOM from 'react-dom';
// eslint-disable-next-line
import MinesweeperBoard from './components/minsweeperboard';
import StartPage from './components/startpage';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={StartPage} />
          <Route exact path='/board' component={MinesweeperBoard} />
          <Redirect to='/' />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

// ReactDOM.render(
//     <App/>,
//     document.getElementById('root')
// )

export default App;