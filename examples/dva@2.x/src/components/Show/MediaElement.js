import React from 'react';
// import 'hls.js';
// import 'mediaelement';

// Import stylesheet and shims
// import 'mediaelement/build/mediaelementplayer.min.css';
// import 'mediaelement/build/mediaelement-flash-video.swf';
import styles from './index.less';

export default class MediaElement extends React.Component {

  state = {}

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
      // success: (media, node, instance) => this.success(media, node, instance),
      // error: (media, node) => this.error(media, node),
    });

    this.setState({ player: new window.MediaElementPlayer(this.state.id, options) });
  }

  success(media, node, instance) {
    // Your action when media was successfully loaded
    // console.log(JSON.stringify(instance));
    this.setState({ player: instance });
  }

  // error() {
  //   // Your action when media had an error loading
  //   // this.props.dispatch({ type: 'show/stopPlay' });
  //   // debugger;
  // }

  removePlayer() {
    // debugger;
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
    // if (this.props.src === null) {
    //   return null;
    // }
    const mediaHtml = `<video id="${this.state.id}" width="100%" height="100%" autoPlay="autoplay" loop className="mejs__player" controls="controls">
        <source src="${this.props.src}" type="application/x-mpegURL" />
      </video>`;
    return (<div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: mediaHtml }} />);
  }
}
