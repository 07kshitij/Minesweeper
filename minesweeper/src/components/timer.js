// https://github.com/peterdurham/timers-demo/blob/master/src/components/Stopwatch.js
import React from 'react';

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerOn: false,
            timerTime: 0,
            timerStart: 0
        }
    }

    startTimer() {
        this.setState({
            timerOn: true,
            timerTime: this.state.timerTime,
            timerStart: Date.now() - this.state.timerTime
        });
        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart
            });
        }, 1000);
    }

    resetTimer() {
        this.setState({
            timerStart: 0,
            timerTime: 0
        });
    }

    stopTimer() {
        this.setState({ timerOn: false });
        clearInterval((this.timer));
    }

    render() {
        const { timerTime } = this.state;
        console.log(timerTime);
        let sec = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let min = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hrs = ("0" + (Math.floor(timerTime / 3600000))).slice(-2);
        return (
            <div className="Timer">
                <div className="Timer-header">Timer</div>
                <div className="Timer-display">
                    {hrs} : {min} : {sec}
                </div>
                {this.state.timerOn === false && this.state.timerTime === 0 && (
                    <button className = "actionButton" onClick={this.startTimer.bind(this)}>Start</button>
                )}
                {this.state.timerOn === true && (
                    <button className = "actionButton" onClick={this.stopTimer.bind(this)}>Stop</button>
                )}
                {this.state.timerOn === false && this.state.timerTime > 0 && (
                    <button className = "actionButton" onClick={this.startTimer.bind(this)}>Resume</button>
                )}
                {this.state.timerOn === false && this.state.timerTime > 0 && (
                    <button className = "actionButton" onClick={this.resetTimer.bind(this)}>Reset</button>
                )}
            </div>
        );
    }
}

export default Timer;
