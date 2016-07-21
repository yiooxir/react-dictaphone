import React, { Component, PropTypes } from 'react';
import Record from './Record';
import { values } from 'lodash';
import './Dictaphone.scss'

export default class Dictaphone extends Component {

  static propTypes = {
    className: PropTypes.string,
    onRecordSelect: PropTypes.func,
    topRender: PropTypes.func,
    infoRender: PropTypes.func,
    durationRender: PropTypes.func
  };

  static defaultProps = {
    className: '',
  };

  state = {
    dictaphonesIds: [],
    currentRecordId: null,
  }

  componentWillMount() {
    this.dictaphones = {};
    this.dict = null;
    this.nextId = 1;
  }

  _addDict(userParams) {
    const id = this.nextId++;
    const dict = {_$id: id, _$init: false, _$extra: userParams};
    this.dictaphones[id] = dict;
    this.setState({
      dictaphonesIds: [...this.state.dictaphonesIds, id],
      currentRecordId: id
    })
  }

  _initDict(dict) {
    dict._$init = true;
    this.dictaphones[dict._$id] = dict;
    this._setDict(dict._$id);
  }

  _setDict(dictId) {
    this.dict = this._getDict(dictId);
  }

  _getDict(dictId) {
    return this.dictaphones[dictId];
  }

  _onRecordSelectHandler(dict) {
    this._setDict(dict._$id);
    this.setState({
      currentRecordId: dict._$id
    })
  }

  _isDict() {
    if (!this.dict) {
      console.warn('Record not selected');
    }

    return !!this.dict;
  }

  startRec() {
    this._isDict() && this.dict.startRecording();

  }

  stopRec() {
    this._isDict() && this.dict.stopRecording();
  }

  play() {
    this._isDict() && this.dict.play()
  }

  pause() {
    this._isDict() && this.dict.pause();
  }

  togglePlayback() {
    this._isDict() && this.dict.togglePlayback();
  }

  rewind(time) {
    this._isDict() && this.dict.rewind(time);
  }

  rewindStart() {
    this._isDict() && this.dict.rewindStart();
  }

  rewindEnd() {
    this._isDict() && this.dict.rewindEnd();
  }

  save() {
    console.warn('Operation TBD');
  }

  deleteRec() {
    console.warn('Operation TBD');
  }

  createRec(userParams) {
    this._addDict(userParams);
  }

  render() {
    const { className, topRender, infoRender, durationRender, ...rest } = this.props;
    const { currentRecordId } = this.state;

    return (
      <div className={`dictaphone-js ${className}`} {...rest} >
        {values(this.dictaphones).map((dict, i) => (
          <Record
            selected={dict._$id === currentRecordId}
            extra={{userValues: dict._$extra}}
            key={i}
            id={dict._$id}
            onInit={dic => this._initDict(dic)}
            onSelect={dict => this._onRecordSelectHandler(dict)}
            topRender={topRender}
            infoRender={infoRender}
            durationRender={durationRender}
          />
        ))}
      </div>
    );
  }
}
