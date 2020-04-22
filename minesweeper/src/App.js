import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';

class Square extends React.Component{
  render(){
    return(
      <button className="square" onClick = {() => this.props.onClick()}>          
          {this.props.value}
      </button>
    );
  }
}

class MinesweeperBoard extends React.Component{

  constructor(props){
    super(props);
    const size = 5;
    this.state = {
      size : size,
      grid : Array(size * size).fill(null),
      mines : Array(size * size).fill(0),
      adjacent : Array(size * size).fill(0),
    }
    this.placeMines();
  }

  placeMines(){
    const size = this.state.size;
    const square = this.state.mines.slice();
    for(let i = 0; i < size; i++){
      var position = Math.floor(Math.random() * size * size);
      square[position] = 1; 
    }
    // eslint-disable-next-line
    this.state.mines = square;
    this.setAdjacent();
  }

  setAdjacent(){
    const mines = this.state.mines;
    const square = this.state.adjacent;
    const size = this.state.size;

    for(let position = 0; position < size*size; position++){
      const oldX = Math.floor(position / size);
      const oldY = position % size;
      var count = 0;
      if(mines[position] === 1)
        continue;
      for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
          var newX = oldX + i;
          var newY = oldY + j;
          var newPos = newX * size + newY;
          if(newX >= 0 && newY >= 0 && newX < size && newY < size && mines[newPos]){
            count += 1;
          }
        }
      }
      square[position] = count;
    }
    this.setState({adjacent : square});
  }

  handleClick(i){
    const square = this.state.grid.slice();
    square[i] = 'X';
    this.setState({grid : square});
  }

  renderSquare(i){
    return (<Square 
              value={this.state.grid[i]}
              onClick = {() => this.handleClick(i)}
            />
    );
  }

  createGrid(){
    console.log(this.state.mines);
    const size = this.state.size;
    let table = [];
    table.push(<div className="status"><center> Welcome to Minesweeper </center></div>)
    table.push(<br/>)
    table.push(<br/>)
    for(let i = 0; i < size; i++){
      let child = [];
      for(let j = 0; j < size; j++){
        child.push(this.renderSquare(i*size + j));
      }
      table.push(<div className="board-row"><center>{child}</center></div>);
    }
    return(table);
  }

  render(){
    return(
      this.createGrid()
    );
  }
}

class App extends React.Component{
    render(){
        return(
            <MinesweeperBoard />
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)

export default App;