import React, { Component, PropTypes } from 'react';
import Record from './Record';
import { values, pick, reject } from 'lodash';

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
    currentRecId: null,
    affectedRecords: []
  }

  componentWillMount() {
    this._rec = null;
    this._recParams = [];
    this.nextId = 1;
    this.selectDisabled = false;
  }

  /** PRIVATE METHODS */

  _addRec(userParams) {
    const id = this.nextId++;
    const prep = {_$id: id, value: userParams}
    this._recParams.push(prep);
    this.setState({ currentRecId: id })

    return new Promise(resolve => setTimeout(() => {
      prep._rec = this._setRec(id);
      resolve();
    }, 0))
  }

  _setRec(recId = null) {
    this._rec = recId ? this._getRecRef(recId) : null;
    this.setState({ currentRecId: recId });
    return this._rec;
  }

  _getRecRef(recId) {
    return this.refs[`ref_${recId}`];
  }

  _delRec(recId) {

    this._recParams = reject(this._recParams, {_$id: recId});
    this._rec = this._recParams.length ? this._setRec(this._recParams[0]._$id) : null;
  }

  _onRecSelect(recId) {
    !this._isSelectDisabled() && this._setRec(recId);
    this.props.onSelect && this.props.onSelect(this._rec, !this._isSelectDisabled());
  }

  _isRecReady() {
    return this._rec && this._rec.loaded();
  }

  _isSelectDisabled() {
    return this.selectDisabled;
  }
  /** PUBLIC API */

  selectRec = (recId) => {
    this._setRec(recId);
  }

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

    const affectedRecords = this.state.affectedRecords;
    const id = this._rec.dictaphone._$id;
    !affectedRecords.includes(id) && this.setState({affectedRecords: [...affectedRecords, id]})
  }

  stopRec = () => {
    this._rec && this._rec.stopRec();
  }

  rewind = (time) => {
    this._rec && this._rec.rewind(time);
  }

  rewindToBegin = () => {
    this._rec && this._rec.rewindToBegin();
  }

  rewindToEnd = () => {
    this._rec && this._rec.rewindToEnd();
  }

  createRec(params, blob = null) {
    return Promise.resolve()
      .then(rec => this._addRec(params))
      .then(() => blob && this._rec.setRecord(blob))
      .then(() => this._rec);
  }

  deleteRec() {
    this._rec && this._delRec(this._rec.dictaphone._$id);
  }

  getAllRecordData() {
    return values(this._recParams.map(e => ({
      values: e.value,
      blob: e._rec.dictaphone.master_recording,
      affected: this.state.affectedRecords.includes(e._rec.dictaphone._$id)
    })))
  }

  getCurrentRecordData() {
    return {
      values: this._rec.dictaphone._$extra,
      blob: this._rec.dictaphone.master_recording,
      affected: this.state.affectedRecords.includes(this._rec.dictaphone._$id)
    }
  }

  allowSelectRecords(sign = true) {
    this.selectDisabled = !sign;
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
            key={rec._$id}
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
