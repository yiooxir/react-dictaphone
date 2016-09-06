import React, { Component, PropTypes } from 'react';
import Dictaphone, { formatTime } from 'dictaphone-js';
import Slider from 'rc-slider';
import cx from 'classnames';
// import 'rc-slider/assets/index.css';
// import './Record.scss';

export default class Record extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    className: PropTypes.string,
    selected: PropTypes.bool,
    value: PropTypes.any,

    /* Custom renders */
    topRender: PropTypes.func,
    infoRender: PropTypes.func,
    durationRender: PropTypes.func,

    /* API callbacks */
    onStartRec: PropTypes.func,
    onStopRec: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onRewind: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    className: '',
    selected: false
  };

  state={
    position: 0,
    duration: 0,
    recording: false,
    playing: false,
    loading: true
  }

  componentWillMount() {
    const { id, value } = this.props;
    this.dictaphone = {_$id: this.props.id, _$init: false, _$extra: value }
  }

  componentDidMount() {
    this.player = this.refs.player;
    this.dictaphone = Object.assign(new Dictaphone(this.player), this.dictaphone);
    this.dictaphone._$init = true;
    this.setState({loading: false});

    this.dictaphone.on('stopRecording', data => this._onStopRecording(data));
    this.dictaphone.on('progress', data => this._onProgress(data));
    this.dictaphone.on('pause', data => this._onStopPlaying());
  }

  componentWillUnmount() {
    this.dictaphone.destroy();
  }

  _getCallbackInfo() {
    return {
      value: this.props.value,
      _$id: this.props.id,
    }
  }

  _onSliderMove(position) {
    this.dictaphone.rewind(position);
    this.setState({ position })
    this.props.onSliderMove && this.props.onSliderMove(Object.assign({}, {position}, this._getCallbackInfo()));
  }

  _onProgress(data) {
      this.setState({ position: data.time })
  }

  _onStopRecording(data) {
    this.setState({
      duration: data.duration,
      recording: false
    })

    this._answer('onStopRec', {duration: data.duration});
  }

  _onStopPlaying() {
    this._answer('onPause');
    this.setState({playing: false})
  }

  _isReady() {
    return this.isLoaded();
  }

  _answer(cbName, extra={}) {
    const cb = this.props[cbName] || function(){};
    cb({...this._getCallbackInfo(), ...extra});
  }

  /** CUSTOM RENDERS */

  topRender() {
    const { topRender } = this.props;
    return topRender ? topRender(this._getCallbackInfo()) :
      (<div className="dc-top-panel">Record {this.dictaphone._$id} ...</div>)
  }

  infoRender() {
    const { infoRender } = this.props;
    return infoRender ? infoRender(this._getCallbackInfo()) :
      (<div className="dc-info"></div>)
  }

  durationRender() {
    const { durationRender } = this.props;
    const { duration } = this.state;

    return durationRender ? durationRender(Object.assign({}, this._getCallbackInfo(), {duration})) :
      (<div className="duration-time">{formatTime(duration)}</div>)
  }

  /** PUBLIC API */

  setRecord(blob) {
    if (!blob) return;

    return new Promise((resolve, reject) => {
      const getDuration = (e) => {
        this.player.removeEventListener('durationchange', getDuration, true);

        this.setState({
          duration: this.dictaphone.player.duration
        })

        resolve();
      }

      this.player.addEventListener('durationchange', getDuration, true);
      this.dictaphone.player.src = window.URL.createObjectURL(blob);
    })




  }

  getRecorder() {
    return this.dictaphone;
  }

  getDurationTime() {
    return this.state.duration;
  }

  isLoaded() {
    return !this.state.loading
  }

  play() {
    const { loading, recording, playing, onPlay } = this.state;
    if ( !this._isReady() || recording || playing ) return;

    this.dictaphone.play();
    this._answer('onPlay');
    this.setState({playing: true})
  }

  pause() {
    const { loading, recording, playing, onPlay } = this.state;
    if ( !this._isReady() || recording || !playing ) return;
    this.dictaphone.pause();
  }

  startRec() {
    const { loading, recording, playing, onPlay } = this.state;
    if ( !this._isReady() || recording || playing ) return;

    this.dictaphone.startRecording();
    this._answer('onStartRec');
    this.setState({recording: true})
  }

  /* User's callback call is provided by #_onStopRecording
  *  because we need to wait of creating a blob file */
  stopRec() {
    const { loading, recording, playing, onPlay } = this.state;
    if ( !this._isReady() || !recording || playing ) return;

    this.dictaphone.stopRecording();
    this.setState({recording: false})
  }

  rewind(time) {
    const { loading, recording, onPlay } = this.state;
    if ( !this._isReady() || recording ) return;

    this.dictaphone.rewind(time);
    this._answer('onRewind', {time});
    this.setState({position: time});
  }

  remove() {
    this.dictaphone.destroy();
  }


  /** ------ RENDER ------- */

  render() {
    const { className, onInit, onSelect, selected, ...rest } = this.props;
    const { position, duration, playing, recording } = this.state;
    const recordClassName = cx('dc-record', className, {
      playing: playing,
      recording: recording,
      loading: this.dictaphone && !this.dictaphone._$init,
      selected: selected,
      'has-duration': duration
    })

    return (
      <div className={recordClassName} onClick={() => onSelect(this.dictaphone._$id)} >

        {/* todo add custom render */}
        { this.topRender() }

        <div className="dc-track">

          {/* todo add custom render */}
          { this.infoRender() }

          <audio ref='player' />

          <div className="dc-progress-bar">
            <Slider
              min={0}
              max={duration}
              step={duration ? 1/(duration * 100) : 0.01}
              value={position}
              defaultValue={0}
              onChange={pos => this.rewind(pos)}
              disabled={!(this.dictaphone && this.dictaphone._$init && duration)}
            />

            {/* add custom render */}
            { this.durationRender() }
          </div>
        </div>
      </div>
    );
  }
}

