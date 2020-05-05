import React from 'react';

class StartPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '10',
        }
    }

    getInitialState() {
        return (
            this.state.selectedOption
        );
    }

    handleOptionChange(changeEvent) {
        console.log(changeEvent.target.value);
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }

    handleFormSubmit(formSubmitEvent) {
        formSubmitEvent.preventDefault();
        console.log("You submitted ", this.state.selectedOption);
        this.props.history.push({
            pathname: '/board',
            data: this.state.selectedOption, // Passes the value of selected size to the board comp
        });
    }

    render() {
        return (
            <div className="startpage">
                <center>
                    <div className="header">
                        <h1>Minesweeper</h1>
                    </div>
                </center>
                <div>
                    <h2>Choose the size of board </h2>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <form onSubmit={this.handleFormSubmit.bind(this)}>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="5"
                                        checked={this.state.selectedOption === '5'}
                                        onChange={this.handleOptionChange.bind(this)} />
                        5 x 5 ( ~ 10 mines)
                        </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="10"
                                        checked={this.state.selectedOption === '10'}
                                        onChange={this.handleOptionChange.bind(this)} />
                        10 x 10 ( ~ 20 mines)
                        </label>
                            </div>
                            <div className="radio">
                                <label>
                                    <input type="radio" value="15"
                                        checked={this.state.selectedOption === '15'}
                                        onChange={this.handleOptionChange.bind(this)} />
                        15 x 15 ( ~ 30 mines)
                        </label>
                            </div>
                            <br />
                            <button className="btn btn-default" type="submit">Submit</button>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}

export default StartPage;