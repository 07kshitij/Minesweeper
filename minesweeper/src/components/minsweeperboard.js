import Square from './square';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Stack from './stack';
import Timer from './timer'

class MinesweeperBoard extends React.Component {

    constructor(props) {
        super(props);

        var prop = this.props.location.data;

        if (prop === undefined) {
            prop = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : null;
            // Check if state is cached
        }

        if (prop === null) { // neither cached, nor passed from homepage
            this.props.history.push('/404');
            return (undefined);
        }

        const size = prop;
        this.state = {
            size: size,
            mineCnt: 2 * size,
            grid: Array(size * size).fill(null),
            mines: Array(size * size).fill(0),
            adjacent: Array(size * size).fill(0),
            bgColors: Array(size * size).fill('#cbcbcb'),
            gameActive: true,
            gameWon: false,
            moves: 0,
            correctMines: 0,
        }

        localStorage.setItem('state', JSON.stringify(this.state.size));
        this.placeMines();
    }

    placeMines() {
        const mineCnt = this.state.mineCnt;
        const size = this.state.size;
        const square = this.state.mines.slice();
        for (let i = 0; i < mineCnt; i++) {
            var position = Math.floor(Math.random() * size * size);
            square[position] = 1;
        }
        // BAD
        // eslint-disable-next-line 
        this.state.mines = square;
        var count = 0;
        for (let i = 0; i < size * size; i++) {
            count += square[i];
        }
        // BAD
        // eslint-disable-next-line 
        this.state.mineCnt = count;
        console.log(this.state.mineCnt);
        this.setAdjacent();
    }

    setAdjacent() {
        const mines = this.state.mines;
        const square = this.state.adjacent;
        const size = this.state.size;

        for (let position = 0; position < size * size; position++) {
            const oldX = Math.floor(position / size);
            const oldY = position % size;
            var count = 0;
            if (mines[position] === 1)
                continue;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    var newX = oldX + i;
                    var newY = oldY + j;
                    var newPos = newX * size + newY;
                    if (newX >= 0 && newY >= 0 && newX < size && newY < size && mines[newPos]) {
                        count += 1;
                    }
                }
            }
            square[position] = count;
        }

        this.setState({ adjacent: square });
    }

    refershPage() {
        window.location.reload(false);
    }

    changeDifficulty() {
        this.props.history.push('/');
    }

    checkGameWon() {
        console.log("Correct Mines = ", this.state.correctMines, "Total Mines = ", this.state.mineCnt);
        if (this.state.correctMines === this.state.mineCnt) {
            this.setState({
                gameActive: false,
                gameWon: true
            })
        }
    }

    handleContextMenu(i, event) {
        event.preventDefault();
        if (this.state.gameActive) { // Checks if you've previously stepped on a mine
            const square = this.state.grid.slice();
            const prevState = square[i];
            square[i] = (square[i] === '?') ? '' : ((square[i] === 'X') ? '?' : 'X');
            var count = this.state.correctMines;
            if (square[i] === 'X' && this.state.mines[i]) {
                count += 1;
            } else if (prevState === 'X' && this.state.mines[i]) {
                count -= 1;
            }
            // BAD
            // eslint-disable-next-line
            this.state.correctMines = count;
            this.setState({
                moves: this.state.moves + 1,
                grid: square,
            });
            this.checkGameWon();
        }
    }

    handleClick(i) {
        if (this.state.gameActive) { // Checks if you've previously stepped on a mine
            const square = this.state.grid.slice();
            const colors = this.state.bgColors.slice();
            square[i] = this.state.adjacent[i] ? this.state.adjacent[i] : '';
            colors[i] = this.state.mines[i] ? 'red' : 'white';
            this.setState({
                moves: this.state.moves + 1
            })
            if (colors[i] === 'white') {
                this.showHints(i);
            } else {
                const size = this.state.size;
                for (var k = 0; k < size * size; k++) {
                    if (this.state.mines[k]) {
                        if (square[k] === null || square[k] === '') {
                            colors[k] = 'red';
                        } else {
                            if (square[k] === 'X') {
                                colors[k] = 'green';
                            } else {
                                colors[k] = 'red';
                            }
                        }
                        square[k] = 'M';
                    } else if (square[k] === 'X') {
                        colors[k] = 'red';
                    }
                }
                this.setState({
                    grid: square,
                    bgColors: colors,
                    gameActive: false
                });
            }
            this.checkGameWon();
        }
    }

    showHints(i) {
        const dx = [-1, 1, 0, 0], dy = [0, 0, -1, 1];
        const size = this.state.size;

        var visited = Array(size * size).fill(false); visited[i] = true;

        var items = []; if (this.state.grid[i] !== 'X') items.push(i);
        var stack = new Stack();
        stack.insert(i);

        // dfs
        while (!stack.isEmpty()) {
            const top = stack.top();
            stack.remove();
            const x_ = Math.floor(top / size), y_ = top % size;
            for (let k = 0; k < 4; k++) {
                var x = x_ + dx[k];
                var y = y_ + dy[k];
                if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (visited[size * x + y] === false && this.state.mines[size * x + y] === 0) {
                        visited[size * x + y] = true;
                        if (this.state.grid[size * x + y] !== 'X')
                            items.push(size * x + y);
                        if (this.state.adjacent[size * x + y] === 0) {
                            stack.insert(size * x + y);
                        }
                    }
                }
            }
        }
        // setState
        const square = this.state.grid.slice();
        const colors = this.state.bgColors.slice();
        for (let k = 0; k < items.length; k++) {
            square[items[k]] = this.state.adjacent[items[k]] ? this.state.adjacent[items[k]] : '';
            colors[items[k]] = this.state.mines[items[k]] ? 'red' : 'white';

        }
        this.setState({
            grid: square,
            bgColors: colors
        });
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.grid[i]}
                onClick={this.handleClick.bind(this, i)}
                onContextMenu={this.handleContextMenu.bind(this, i)}
                color={this.state.bgColors[i]} />
        );
    }

    createGrid() {
        const size = this.state.size;
        let table = [];
        table.push(<br />); table.push(<br />); table.push(<br />); table.push(<br />);

        for (let i = 0; i < size; i++) {
            let child = [];
            for (let j = 0; j < size; j++) {
                child.push(this.renderSquare(i * size + j));
            }
            table.push(<div className="board-row"><center>{child}</center></div>);
        }
        return (table);
    }

    render() {
        if (this.prop === null) {
            return (
                <Redirect to='/404' />
            )
        }
        return (
            <div className="Board">
                <div className="status"><center> Welcome to Minesweeper </center></div>
                <div className="split left">
                    {this.createGrid()}
                </div>
                <div className="split right">
                    <Timer gameActive={this.state.gameActive} />
                    <br />
                    <div className="moves">Moves : {this.state.moves}</div>
                    <br />
                    <button className="actionButton" onClick={this.refershPage.bind(this)}>Start Over</button>
                    <br /><br />
                    <button className="actionButton" onClick={this.changeDifficulty.bind(this)}>Change Board Size</button>
                    <br /><br />
                    {this.state.gameActive === false && this.state.gameWon === false && (<div className="loss">Sorry You lost !!</div>)}
                    {this.state.gameActive === false && this.state.gameWon === true && (<div className="win">Yayy !! You Won !!</div>)}
                </div>
            </div>
        );
    }
}

export default MinesweeperBoard;