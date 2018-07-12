import React from 'react';
import PropTypes from 'prop-types';
import flvjs from 'flv.js';
import hlsjs from 'hls.js';
import 'mediaelement';

// Import stylesheet and shims
import 'mediaelement/build/mediaelementplayer.min.css';
import 'mediaelement/build/mediaelement-flash-video.swf';
import styles from './index.less';


class MediaElement extends React.PureComponent {
  constructor(props) {
    super(props);

    // this.state = {
    //   player: null,
    // };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }

  // componentWillMount() {
  //   this.setState({ id: this.generatorId() });
  // }

  componentDidMount() {
    this.initPlayer();
    // this.startCheckInterval();
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  componentWillUnmount() {
    this.stopCheckInterval();
    this.removePlayer();
  }

  startCheckInterval() {
    this.stopCheckInterval();
    this.interval = window.setInterval(() => {
      if (this.props.foucelive && 'video/x-flv' === this.props.type) {
        this.checkBuffer(0.5);
      }
    }, 10 * 1000);
  }
  stopCheckInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = undefined;
  }

  initPlayer() {
    // debugger;
    if (null === this.props.src) {
      return;
    }
    const { MediaElementPlayer } = global;

    window.flvjs = flvjs;
    window.Hls = hlsjs;
    this.player = new MediaElementPlayer(this.props.id, {
      // Read the Notes below for more explanation about how to set up the path for shims
      pluginPath: '//opensight-public.oss-cn-hangzhou.aliyuncs.com/lib/mediaelement/4.1.3/',
      shimScriptAccess: 'always',
      // setDimensions: false,
      startVolume: 1,
      // features: ['playpause', 'current', 'progress', 'duration', 'playbackRate', 'tracks', 'volume', 'fullscreen'],
      flv: {
        cors: true,
        debug: false,
        configs: {
          isLive: true,
          autoCleanupSourceBuffer: true,
          stashInitialSize: 16 * 1024,
          enableStashBuffer: !this.props.foucelive,
        },
      },
      success: (media, node, instance) => this.success(media, node, instance),
      error: (media, node) => this.error(media, node),
    });
    // this.setState({ player: new MediaElementPlayer(this.state.id, options) });
  }

  success(media, node, instance) {
    // Your action when media was successfully loaded
    // debugger;
    if (this.props.onSuccess) {
      this.props.onSuccess(instance);
    }
    media.load();
    media.play();
    this.player = instance;

    if (this.props.foucelive && 'video/x-flv' === this.props.type && instance.media.flvPlayer) {
      this.startCheckInterval();
    }
    // this.props.onSuccess && this.props.onSuccess(instance);
  }
  error() {
    if (this.props.onFaild) {
      this.props.onFaild();
    }
    this.player = undefined;
  }

  checkBuffer(maxInterval = 2) {
    if (false === this.player.paused && this.player.media.flvPlayer && 0 !== this.player.media.flvPlayer.buffered.length) {
      const end = this.player.media.flvPlayer.buffered.end(this.player.media.flvPlayer.buffered.length - 1);
      const currentTime = this.player.media.flvPlayer.currentTime;
      if (end - currentTime > maxInterval) {
        this.player.media.flvPlayer.currentTime = end - 0.5;
      }
    }
  }

  // handle(e) {
  //   // debugger;
  //   if (!this.player || !this.player.media) {
  //     return;
  //   }
  //   if (this.props.handle) {
  //     this.props.handle(e, this.player);
  //   }
  // }

  removePlayer() {
    // debugger;
    if (!this.player) {
      return;
    }
    this.player.pause();
    try {
      this.player.media.hlsPlayer.stopLoad();
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    }
    try {
      this.player.media.hlsPlayer.destroy();
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    }

    try {
      this.player.remove();
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    }
    this.player = null;
  }

  render() {
    const mediaHtml = `<video id="${this.props.id}" width="100%" height="100%" className="mejs__player" controls="controls">
        <source src="${this.props.src}" type="${this.props.type}" />
      </video>`;
    // eslint-disable-next-line
    return (<div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: mediaHtml }} />);
  }
}

MediaElement.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  foucelive: PropTypes.bool,
  onSuccess: PropTypes.func,
  onFaild: PropTypes.func,
};

export default MediaElement;
