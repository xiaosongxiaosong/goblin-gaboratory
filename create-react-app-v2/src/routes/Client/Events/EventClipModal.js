import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import numeral from 'numeral';

import { Modal, notification, Slider, Button } from 'antd';
// // import Ellipsis from 'ant-design-pro/lib/Ellipsis';
// import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import OssImg from '../../../components/OssImg';
import MediaElement from '../../../components/MediaElement';
// // import TextButton from '../TextButton';
import eventServer from '../../../services/event';
import { notifyRequestError } from '../../../utils';
// import { eventStateType, eventStateDescription, duration } from '../../utils/filter';
import styles from './EventClipModal.less';


const tipFormatter = (value) => {
  return moment(value + (16 * 60 * 60 * 1000)).format('HH:mm:ss');
};

// const getMarks = (start, end) => {
//   const marks = {};
//   marks[start] = tipFormatter(start);
//   marks[end] = tipFormatter(end);
//   return marks;
// };

class EventClipModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      info: { ...this.props.info },
      // marks: getMarks(this.props.info.clip_start, this.props.clip_end),
      session: undefined,
      loading: false,
      currentTime: 0,
      seeking: false,
      player: undefined,
      paused: true,
    };

    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFaild = this.onFaild.bind(this);
    this.startPlay = this.startPlay.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onAfterChange = this.onAfterChange.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.setCurrentTime = this.setCurrentTime.bind(this);
  }
  componentDidMount() {
    this.startPlay();
  }

  async onOk() {
    this.props.onOk(this.state.info);
    await this.setState({ visible: false });
    this.props.hide();
  }

  async onCancel() {
    await this.setState({ visible: false });
    this.props.hide();
  }

  // eslint-disable-next-line
  onSuccess(player) {
    player.media.addEventListener('timeupdate', () => {
      if (this.state.visible && !this.state.seeking) {
        this.setState({ currentTime: player.media.getCurrentTime() * 1000 });
      }
    });
    player.media.addEventListener('play', () => {
      if (this.state.visible) {
        this.setState({ paused: false });
      }
    });
    player.media.addEventListener('pause', () => {
      if (this.state.visible) {
        this.setState({ paused: true });
      }
    });
    player.media.addEventListener('ended', () => {
      if (this.state.visible) {
        this.setState({ paused: true });
      }
    });
    this.setState({ player });
  }
  // eslint-disable-next-line
  onFaild() {
    this.setState({ player: null });
  }

  // eslint-disable-next-line
  onChange(value) {
    this.setState({ currentTime: value, seeking: true });
  }
  // eslint-disable-next-line
  onAfterChange(value) {
    // if (this.state.player) {
    //   this.state.player.media.setCurrentTime(value / 1000);
    // }
    this.setCurrentTime(value);
    this.setState({ currentTime: value, seeking: false });
  }

  onRangeChange(value) {
    this.setState({
      info: {
        ...this.state.info,
        clip_start: value[0],
        clip_end: value[1],
      },
      // marks: getMarks(value[0], value[1]),
    });
  }

  setCurrentTime(currentTime) {
    if (this.state.player) {
      this.state.player.media.setCurrentTime(currentTime / 1000);
    }
  }

  async startPlay() {
    this.setState({ loading: true, session: undefined, player: undefined });
    const { data, errMsg } = await eventServer.createVodSession({
      projectName: this.props.info.project_name,
      eventId: this.props.info.event_id,
    });
    if (errMsg) {
      const status = errMsg.response && errMsg.response.status;
      if (420 === status) {
        notification.error({ message: '录像正在转码，播放失败' });
      } else {
        notifyRequestError(errMsg, '播放录像失败');
      }
    }
    this.setState({ loading: false, session: data || null });
  }
  // eslint-disable-next-line
  handle(e, player) {
    // debugger;
    if ('timeupdate' === e.type) {
      // debugger;
      this.setState({ currentTime: player.media.getCurrentTime() * 1000 });
    }
  }

  render() {
    const { visible, info, session, player, currentTime, paused } = this.state;
    return (
      <Modal
        visible={visible}
        width="70%"
        style={{ top: '20px' }}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
        title={info.desc}
        onOk={this.onOk}
        onCancel={this.onCancel}
        keyboard={false}
        maskClosable={false}
      >
        <div className={styles.container}>
          <OssImg alt={info.desc} src={info.snapshot} action="/resize,m_fill,h_720,w_1280" />
          {session && <MediaElement
            id={info.event_id}
            src={session.url}
            type="application/x-mpegURL"
            onSuccess={this.onSuccess}
            onFaild={this.onFaild}
          />}
          {(null === session || null === player) && <div onClick={this.startPlay}>startPlay</div>}
        </div>
        <div>
          <Slider
            range
            className={styles.range}
            max={info.duration}
            onChange={this.onRangeChange}
            onAfterChange={this.onRangeChange}
            value={[info.clip_start, info.clip_end]}
            tipFormatter={tipFormatter}
          />
          <Slider
            className={styles.slider}
            max={info.duration}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
            value={currentTime}
            tipFormatter={tipFormatter}
          />
        </div>
        <div>
          <span className={styles.currentTime}>{tipFormatter(currentTime)}</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button icon="step-backward" onClick={() => this.setCurrentTime(currentTime - (30 * 1000))} disabled={(30 * 1000) > currentTime} title="跳转到 30 秒前" />
          <span>&nbsp;&nbsp;</span>
          {paused && player && <Button icon="caret-right" onClick={() => player.media.play()} disabled={!player} />}
          {!paused && player && <Button icon="pause" onClick={() => player.media.pause()} disabled={!player} />}
          <span>&nbsp;&nbsp;</span>
          <Button icon="step-forward" onClick={() => this.setCurrentTime(currentTime + (30 * 1000))} disabled={(30 * 1000) > info.duration - currentTime} title="跳转到 30 秒后" />
          <span>&nbsp;&nbsp;</span>
          <Button onClick={() => this.setCurrentTime(info.clip_start)} title="跳转到开始位置播放">跳转开始</Button>
          <span>&nbsp;&nbsp;</span>
          <Button onClick={() => this.setCurrentTime(info.clip_end)} title="跳转到结束位置播放">跳转结束</Button>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button onClick={() => this.onRangeChange([currentTime, info.clip_end])} disabled={currentTime >= info.clip_end}>设置开始</Button>
          <span>&nbsp;&nbsp;</span>
          <Button onClick={() => this.onRangeChange([info.clip_start, currentTime])} disabled={currentTime <= info.clip_start}>设置结束</Button>
        </div>
      </Modal>
    );
  }
}

EventClipModal.propTypes = {
  info: PropTypes.object,
  // onOk: PropTypes.func,
  hide: PropTypes.func,
};

export default EventClipModal;
