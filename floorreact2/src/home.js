import React, { Component } from 'react';
import './home.css';

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {expanded: props.expanded,
                        bname: props.name}
    }

    render() {
        if (this.state.expanded) {
            return null;
        } else {
            return (
                <button className="expandable btn"
                        onClick={() => this.setState({expanded: true})}
                ><span>{this.state.bname}Test</span></button>
            );
        }
    }
}

export default Home
