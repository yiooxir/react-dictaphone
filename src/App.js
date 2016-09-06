import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dictaphone from './Dictaphone';

const topRender = function(value) {
  // console.log('topRender', value)
  return (<div className="dc-top-panel"> My Record </div>)
}

const infoRender = function(value) {
  // console.log('infoRender', value)
  return (<div className="dc-info"> Record info: ... </div>)
}

const durationRender = function(value, duration) {
  // console.log('durationRender', value, duration)
  return (<div> MY DURATION RENDER </div>)
}

export default class App extends Component {
  handleStartRec() {
    this.refs.dict.startRec();
  }

  handleStopRec() {
    this.refs.dict.stopRec();
  }

  handleCreateRec() {
    this.refs.dict.createRec({id: 1, user: 'man'}, this.blob);
  }

  handlePlay() {
    this.refs.dict.play();
  }

  handlePause() {
    this.refs.dict.pause();
  }

  _$keepBlob() {
    this.blob = this.refs.dict._rec.dictaphone.master_recording;
  }

  render() {
    return (
      <div>
        <button onClick={() => this.handleCreateRec()}>create >></button>
        <button onClick={() => this.handleStartRec()}>rec >></button>
        <button onClick={() => this.handleStopRec()}>stop >></button>
        <button onClick={() => this.handlePlay()}>play >></button>
        <button onClick={() => this.handlePause()}>pause >></button>
        <button onClick={() => this._$keepBlob()}>keepBlob</button>
        <button onClick={() => console.log(this.refs.dict.getData())}>print list</button>

        <Dictaphone
          ref="dict"
          topRender={topRender}
          infoRender={infoRender}
          onSelect={(data) => console.log('onSelect', data)}
          onStartRec={(data) => console.log('onStartRec', data)}
          onStopRec={(data) => console.log('onStopRec', data)}
          onPlay={(data) => console.log('onPlay', data)}
          onPause={(data) => console.log('onPause', data)}
          onRewind={(data) => console.log('onRewind', data)}
          onError={(data) => console.log('onError', data)}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
