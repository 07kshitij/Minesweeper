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
        if(this.timer){
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.setState({
                timerTime: Date.now() - this.state.timerStart
            });
        }, 1000);
    }

    stopTimer() {
        this.setState({ timerOn: false });
        clearInterval((this.timer));
    }

    render() {
        const timerTime = this.state.timerTime;
        let sec = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let min = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hrs = ("0" + (Math.floor(timerTime / 3600000))).slice(-2);
        if(this.props.gameActive){
            return (
                <div className="Timer">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                    <i class="fa fa-clock-o"  style = {{'font-size':'36px'}}></i>
                    <div className="Timer-display">
                        {hrs} : {min} : {sec}
                    </div>
                    {this.state.timerOn === false && this.state.timerTime === 0 && (<div>{this.startTimer()}</div>)}
                    {this.state.timerOn === true && (
                        <button className = "actionButton" onClick={this.stopTimer.bind(this)}>Stop</button>
                    )}
                    {this.state.timerOn === false && this.state.timerTime > 0 && (
                        <button className = "actionButton" onClick={this.startTimer.bind(this)}>Resume</button>
                    )}
                </div>
            );
        }else{
            return(
                <div className="Timer">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                    <i class="fa fa-clock-o"  style = {{'font-size':'36px'}}></i>
                    <div className="Timer-display">
                        {hrs} : {min} : {sec}
                    </div>
                    {this.stopTimer.bind(this)}
                    {clearInterval(this.timer)}
                </div>
            );
        }
    }
}

export default Timer;
