import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dictaphone from './Dictaphone';
import blobUtil from 'blob-util';

const topRender = function(value) {
  return (<div className="dc-top-panel"> My Record {value.value.hash} </div>)
}

const infoRender = function(value) {
  return (<div className="dc-info"> Record info: ... </div>)
}

const durationRender = function(value, duration) {
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
    this.refs.dict.createRec({id: 1, user: 'man', hash: Math.floor(Math.random(3)*1000)}, this.blob);
  }

  handlePlay() {
    this.refs.dict.play();
  }

  handlePause() {
    this.refs.dict.pause();
  }

  _$keepBlob() {
    this.blob2 = this.refs.dict._rec.dictaphone.master_recording;

    blobUtil.blobToBase64String(this.blob2).then((base64String) => {
      return blobUtil.base64StringToBlob(base64String)
    })
      .then(res => {
        this.blob = res;
      })
      .catch(function (err) {
      console.error(err);
    });
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
        <button onClick={() => console.log(this.refs.dict.getAllRecordData())}>print list</button>
        <button onClick={() => console.log(this.refs.dict.getCurrentRecordData())}>print current rec</button>
        <button onClick={() => console.log(this.refs.dict.allowSelectRecords(false))}>protect select records</button>
        <button onClick={() => console.log(this.refs.dict.deleteRec())}>delete rec</button>

        {/*<Dictaphone*/}
          {/*ref="dict"*/}
          {/*topRender={topRender}*/}
          {/*infoRender={infoRender}*/}
          {/*onSelect={(...args) => console.log('onSelect', ...args)}*/}
          {/*onStartRec={(data) => console.log('onStartRec', data)}*/}
          {/*onStopRec={(data) => console.log('onStopRec', data)}*/}
          {/*onPlay={(data) => console.log('onPlay', data)}*/}
          {/*onPause={(data) => console.log('onPause', data)}*/}
          {/*onRewind={(data) => console.log('onRewind', data)}*/}
          {/*onError={(data) => console.log('onError', data)}*/}
        {/*/> */}
        <Dictaphone
          ref="dict"
          topRender={topRender}
          infoRender={infoRender}
          onError={(data) => console.log('onError', data)}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
