import Square from './square';
import React from 'react';
import { Redirect } from 'react-router-dom';

class MinesweeperBoard extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.location.data === undefined) {
            this.props.history.push('/404');
            return (undefined);
        }
        const size = this.props.location.data;
        this.state = {
            size: size,
            mineCnt: size,
            grid: Array(size * size).fill(null),
            mines: Array(size * size).fill(0),
            adjacent: Array(size * size).fill(0),
        }
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
        // eslint-disable-next-line
        this.state.mines = square;
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

    handleClick(i) {
        const square = this.state.grid.slice();
        square[i] = 'X';
        this.setState({ grid: square });
    }

    renderSquare(i) {
        return (<Square
            value={this.state.grid[i]}
            onClick={() => this.handleClick(i)} />
        );
    }

    renderSolution(i) {
        return (<Square
            value={this.state.mines[i]}
            onClick={() => this.handleClick(i)} />
        );
    }

    createGrid() {
        const size = this.state.size;
        let table = [];
        table.push(<div className="status"><center> Welcome to Minesweeper </center></div>)
        table.push(<br />)
        table.push(<br />)
        table.push(<br />)
        table.push(<br />)
        for (let i = 0; i < size; i++) {
            let child = [];
            for (let j = 0; j < size; j++) {
                child.push(this.renderSquare(i * size + j));
            }
            table.push(<div className="board-row"><center>{child}</center></div>);
        }
        return (table);
    }

    showSolution() {
        const size = this.state.size;
        let table = [];
        for (let i = 0; i < size; i++) {
            let child = [];
            for (let j = 0; j < size; j++) {
                child.push(this.renderSolution(i * size + j));
            }
            table.push(<div className="board-row"><center>{child}</center></div>);
        }
        return (table);
    }

    render() {
        if (this.props.location.data === undefined) {
            return (
                <Redirect to='/404' />
            )
        }
        return (
            this.createGrid()
        );
    }
}

export default MinesweeperBoard;