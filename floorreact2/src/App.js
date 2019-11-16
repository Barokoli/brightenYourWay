import React, { Component } from 'react';
import './App.css';
import FloorRenderer from './floorrenderer.js';

class App extends Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <FloorRenderer/>
                </header>
            </div>
        );
    }
}

export default App;
