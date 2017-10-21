import React from 'react';
import styles from './index.less';
import { genId } from '../../utils';

export default class NativeHLSPlayer extends React.Component {

  state = {
    player: null,
    bufferInterval: null,
    id: null,
  }

  componentWillMount() {
    this.setState({ id: genId() });
  }

  componentDidMount() {
    // this.initPlayer();
  }
  componentWillReceiveProps(nextProps) {
    const dom = document.getElementById(this.state.id);
    if (null === nextProps.src || undefined === nextProps.src || '' === nextProps.src) {
      $(dom).css('visibility', 'hidden');
    } else {
      $(dom).css('visibility', 'visible');
      if (dom.src !== nextProps.src) {
        dom.src = nextProps.src;
        dom.load();
        dom.play();
      }
    }
    // if (null === nextProps.src || undefined === nextProps.src || '' === nextProps.src) {
    //   $(dom).css('visibility', 'hidden');
    // } else {
    //   $(dom).css('visibility', 'visible');
    //   dom.src = nextProps.src;
    //   dom.load();
    //   dom.play();
    // }
    // return false;
  }
  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    // this.removePlayer();
    const dom = document.getElementById(this.state.id);
    dom.src = '';
    dom.load();
  }

  render() {
    const src = this.props.src ? this.props.src : '';
    const id = this.state.id;
    // if (null === this.props.src || ){}
    const mediaHtml = `<video id="${id}" width="100%" height="100%" style="visibility: hidden;" x-webkit-airplay="deny" controls webkit-playsinline="true" playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="true">
        <source src="${src}" type="application/x-mpegURL" />
      </video>`;
    return (<div className={styles.videoContainer} dangerouslySetInnerHTML={{ __html: mediaHtml }} />);
  }
}
