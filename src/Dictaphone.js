import React, { Component, PropTypes } from 'react';
import Record from './Record';
import { values, pick, reject } from 'lodash';
import './Dictaphone.scss'

export default class Dictaphone extends Component {

  static propTypes = {
    className: PropTypes.string,
    topRender: PropTypes.func,
    infoRender: PropTypes.func,
    durationRender: PropTypes.func,
    
    onSelect: PropTypes.func,
    onStartRec: PropTypes.func,
    onStopRec: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onRewind: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    className: '',
  };

  state = {
    RecIds: [],
    currentRecId: null,
  }

  componentWillMount() {
    this._rec = null;
    this._recParams = [];
    this.nextId = 1;
  }

  /** PRIVATE METHODS */

  _addRec(userParams) {
    const id = this.nextId++;
    this._recParams.push({_$id: id, value: userParams});
    this.setState({ currentRecId: id })
    setTimeout(() => {this._setRec(id)}, 0)
  }

  _setRec(recId) {
    this._rec = this._getRecRef(recId);
    this.setState({ currentRecId: recId })
  }

  _getRecRef(recId) {
    return this.refs[`ref_${recId}`];
  }

  _delRec(recId) {
    reject(this._recParams, {_$id: recId});
    this._rec.remove();
    this._rec = null;
  }

  _onRecSelect(recId) {
    this._setRec(recId);
  }

  _isRecReady() {
    return this._rec && this._rec.loaded();
  }

  /** PUBLIC API */

  getRecorder = () => {
    this._rec && this._rec.getRecorder();
  }

  getDurationTime = () => {
    this._rec && this._rec.getDurationTime();
  }

  isLoaded = () => {
    this._rec && this._rec.isLoaded();
  }

  play = () => {
    this._rec && this._rec.play();
  }

  pause = () => {
    this._rec && this._rec.pause();
  }

  startRec = () => {
    this._rec && this._rec.startRec();
  }

  stopRec = () => {
    this._rec && this._rec.stopRec();
  }

  rewind = (time) => {
    this._rec && this._rec.rewind(time);
  }

  createRec(params) {
    this._addRec(params);
  }

  deleteRec() {
    this._rec && this._delRec();
  }

  render() {
    const { className, onSelect } = this.props;
    const { currentRecId } = this.state;
    const actions = pick(this.props, 'onStartRec', 'onStopRec', 'onPlay', 'onPause', 'onRewind', 'onError');
    const renders = pick(this.props, 'topRender', 'infoRender', 'durationRender');

    return (
      <div className={`dictaphone-js ${className}`} >
        {values(this._recParams).map((rec, i) => (
          <Record
            ref={`ref_${rec._$id}`}
            key={i}
            selected={rec._$id === currentRecId}
            value={rec.value}
            id={rec._$id}
            onSelect={recId => this._onRecSelect(recId)}
            {...actions}
            {...renders}
          />
        ))}
      </div>
    );
  }
}
