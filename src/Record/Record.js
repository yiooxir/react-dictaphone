import React, { Component, PropTypes } from 'react';
import Dictaphone, { formatTime } from 'dictaphone-js';
import Slider from 'rc-slider';
import cx from 'classnames';
import 'rc-slider/assets/index.css';
import './Record.scss';

export default class Record extends Component {

  static propTypes = {
    className: PropTypes.string,
    selected: PropTypes.bool,
    id: PropTypes.number.isRequired,
    extra: PropTypes.object.isRequired,
    onInit: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    topRender: PropTypes.func,
    infoRender: PropTypes.func,
    durationRender: PropTypes.func
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
    const { id, extra } = this.props;
    this.dictaphone = {_$id: this.props.id, _$init: false, _$extra: extra.userValues }
  }

  componentDidMount() {
    const player = this.refs.player;
    this.dictaphone = new Dictaphone(player);
    this.dictaphone._$id = this.props.id;
    this.dictaphone._$extra = this.props.extra.userValues;
    this.props.onInit(this.dictaphone);
    this.setState({loading: false});

    this.dictaphone.on('startRecording', data => this.onStartRecording(data))
    this.dictaphone.on('stopRecording', data => this.onStopRecording(data));
    this.dictaphone.on('progress', data => this.onProgress(data));
    this.dictaphone.on('pause', data => this.onPause(data));
    this.dictaphone.on('play', data => this.onPlay(data));
  }

  componentWillUnmount() {
    this.dictaphone.destroy();
  }

  onStartRecording(data) {
    this.setState({recording: true, playing: false})
  }

  onStopRecording(data) {
    this.setState({
      duration: data.duration,
      recording: false
    })
  }

  onProgress(data) {
    this.setState({
      position: data.time
    })
  }

  onPause(data) {
    this.setState({playing: false})
  }

  onPlay() {
    this.setState({playing: true})
  }

  onSliderMove(position) {
    this.dictaphone.rewind(position);
    this.setState({ position })
  }

  topRender() {
    const { topRender } = this.props;
    return topRender ? topRender(this.dictaphone._$extra) :
      (<div className="dc-top-panel">Record {this.dictaphone._$id} ...</div>)
  }

  infoRender() {
    const { infoRender } = this.props;
    return infoRender ? infoRender(this.dictaphone._$extra) :
      (<div className="dc-info"></div>)
  }

  durationRender() {
    const { durationRender } = this.props;
    const { duration } = this.state;

    return durationRender ? durationRender(this.dictaphone._$extra, duration) :
      (<div className="duration-time">{formatTime(duration)}</div>)
  }

  render() {
    const { className, onInit, onSelect, selected, ...rest } = this.props;
    const { position, duration, playing, recording } = this.state;
    // const recordBoxStyle = {visibility: `${!selected ? 'hidden' : 'visible'}`}
    const recordClassName = cx('dc-record', className, {
      playing: playing,
      recording: recording,
      loading: this.dictaphone && !this.dictaphone._$init,
      selected: selected,
      'has-duration': duration
    })

    return (
      <div className={recordClassName} {...rest} onClick={() => onSelect(this.dictaphone)} >

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
              onChange={pos => this.onSliderMove(pos)}
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
