import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dictaphone from './Dictaphone';

const topRender = function(value) {
  return (<div className="dc-top-panel"> My Record </div>)
}

const infoRender = function(value) {
  return (<div className="dc-info"> Record info: ... </div>)
}

// const durationRender = function(value, duration) {
//   return (<div> MY DURATION RENDER </div>)
// }

export default class App extends Component {
  handleStartRec() {
    this.refs.dict.startRec();
  }

  handleStopRec() {
    this.refs.dict.stopRec();
  }

  handleCreateRec() {
    this.refs.dict.createRec({id: 1, user: 'man'});
  }

  handlePlay() {
    this.refs.dict.play();
  }



  render() {
    return (
      <div>
        <button onClick={() => this.handleStartRec()}>rec >></button>
        <button onClick={() => this.handleStopRec()}>stop >></button>
        <button onClick={() => this.handleCreateRec()}>create >></button>
        <button onClick={() => this.handlePlay()}>play >></button>
        <Dictaphone
          ref="dict"
          topRender={topRender}
          infoRender={infoRender}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
