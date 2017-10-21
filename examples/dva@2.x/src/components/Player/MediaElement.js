import React from 'react';
// import 'hls.js';
// import 'flv.js';
// import 'mediaelement';

// Import stylesheet and shims
// import 'mediaelement/build/mediaelementplayer.min.css';
// import 'mediaelement/build/mediaelement-flash-video.swf';
import styles from './index.less';

export default class MediaElement extends React.Component {

  state = {
    player: null,
    bufferInterval: null,
    id: null,
  }

  componentWillMount() {
    this.setState({ id: this.generatorId() });
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentWillUnmount() {
    this.removePlayer();
  }

  initPlayer() {
    // debugger;
    if (null === this.props.src) {
      return;
    }
    const { MediaElementPlayer } = global;

    if (!MediaElementPlayer) {
      return;
    }

    // debugger;
    const options = Object.assign({}, {
      // Read the Notes below for more explanation about how to set up the path for shims
      pluginPath: '//opensight-public.oss-cn-hangzhou.aliyuncs.com/lib/mediaelement/4.1.3/',
      shimScriptAccess: 'always',
      // setDimensions: false,
      startVolume: 1,
      // features: ['playpause', 'current', 'progress', 'duration', 'playbackRate', 'tracks', 'volume', 'fullscreen'],
      flv: {
        path: 'http://opensight-public.oss-cn-hangzhou.aliyuncs.com/lib/flv.js/1.3.2/flv.min.js',
        cors: true,
        debug: false,
        configs: {
          isLive: true,
          enableStashBuffer: false,
          autoCleanupSourceBuffer: true,
          // stashInitialSize: "10KB"
        },
      },
      success: (media, node, instance) => this.success(media, node, instance),
      // error: (media, node) => this.error(media, node),
    });

    this.setState({ player: new window.MediaElementPlayer(this.state.id, options) });
  }

  success(media, node, instance) {
    // Your action when media was successfully loaded
    // console.log(JSON.stringify(instance));
    instance.load();
    instance.play();
    if (this.props.foucelive && 'video/x-flv' === this.props.type && instance.media.flvPlayer) {
      let bufferInterval = setTimeout(() => {
        this.checkBuffer(0.5);
        bufferInterval = setInterval(() => {
          this.checkBuffer(0.5);
        }, 10 * 1000);
        this.setState({ bufferInterval });
      }, 5 * 1000);
      this.setState({ bufferInterval });
    }
    this.setState({ player: instance });
  }
  checkBuffer(maxInterval = 2) {
    if (false === this.state.player.paused && 0 !== this.state.player.media.flvPlayer.buffered.length) {
      const end = this.state.player.media.flvPlayer.buffered.end(this.state.player.media.flvPlayer.buffered.length - 1);
      const currentTime = this.state.player.media.flvPlayer.currentTime;
      if (end - currentTime > maxInterval) {
        this.state.player.media.flvPlayer.currentTime = end - 0.5;
      }
    }
  }
  // error() {
  //   // Your action when media had an error loading
  //   // this.props.dispatch({ type: 'show/stopPlay' });
  //   // debugger;
  // }

  removePlayer() {
    // debugger;
    if (this.state.bufferInterval) {
      clearInterval(this.state.bufferInterval);
    }
    this.setState({ bufferInterval: null });
    if (this.state.player) {
      this.state.player.pause();
      try {
        this.state.player.media.hlsPlayer.stopLoad();
      } catch (error) {
        console.log(error);
      }
      try {
        this.state.player.media.hlsPlayer.destroy();
      } catch (error) {
        console.log(error);
      }

      try {
        this.state.player.remove();
      } catch (error) {
        console.log(error);
      }
      this.setState({ player: null });
      // this.setState({ playerinstance: null });
      // $('video').each(function () {
      //   $(this).remove();
      // });
    }
  }

  generatorId() {
    const id = `videoId_${Math.ceil(Math.random() * 1000)}`;
    if (null === document.getElementById(id)) {
      return id;
    } else {
      return this.generatorId();
    }
  }

  render() {
    const mediaHtml = `<video id="${this.state.id}" width="100%" height="100%" className="mejs__player" controls="controls">
        <source src="${this.props.src}" type="${this.props.type}" />
      </video>`;
    return (<div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: mediaHtml }} />);
  }
}
