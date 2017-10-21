import React from 'react';
// import styles from './index.less';

export default class PrismFlashplayer extends React.Component {

  // state = {}

  // componentWillMount() {
  //   this.setState({ id: this.generatorId() });
  // }

  // componentDidMount() {
  //   this.initPlayer();
  // }

  // componentWillUnmount() {
  //   // this.removePlayer();
  // }

  // initPlayer() {
  //   // debugger;
  //   const isLive = true === this.props.isLive;
  //   const player = new prismplayer({
  //     id: this.state.id, // 容器id
  //     source: this.props.src, // 视频地址
  //     autoplay: true,    // 自动播放：否
  //     isLive,
  //     width: '100%',       // 播放器宽度
  //     height: '100%',      // 播放器高度
  //   });

  //   player.on('ready', () => {
  //     $(`#${this.state.id}`).css('height', '100%');
  //   });
  // }

  // success(media, node, instance) {
  //   // Your action when media was successfully loaded
  //   // console.log(JSON.stringify(instance));
  //   this.setState({ player: instance });
  // }

  // // error() {
  // //   // Your action when media had an error loading
  // //   // this.props.dispatch({ type: 'show/stopPlay' });
  // //   // debugger;
  // // }

  // removePlayer() {
  //   // debugger;
  //   if (this.state.player) {
  //     this.state.player.pause();
  //     try {
  //       this.state.player.media.hlsPlayer.stopLoad();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     try {
  //       this.state.player.media.hlsPlayer.destroy();
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     try {
  //       this.state.player.remove();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     this.setState({ player: null });
  //     // this.setState({ playerinstance: null });
  //     // $('video').each(function () {
  //     //   $(this).remove();
  //     // });
  //   }
  // }

  // generatorId() {
  //   const id = `prismplayer_${Math.ceil(Math.random() * 1000)}`;
  //   if (null === document.getElementById(id)) {
  //     return id;
  //   } else {
  //     return this.generatorId();
  //   }
  // }

  // render() {
  //   // if (this.props.src === null) {
  //   //   return null;
  //   // }
  //   // const mediaHtml = `<video id="${this.state.id}" width="100%" height="100%" autoPlay="autoplay" loop className="mejs__player" controls="controls">
  //   //     <source src="${this.props.src}" type="application/x-mpegURL" />
  //   //   </video>`;
  //   return (<div id={this.state.id} className="prism-player" />);
  // }
}
