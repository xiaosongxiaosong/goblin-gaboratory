import MediaElement from './MediaElement';
import PrismFlashplayer from './PrismFlashplayer';
import NativeHLSPlayer from './NativeHLSPlayer';

const loadEmptySrcAfterClick = () => {
  if (mejs.Features.isiOS || mejs.Features.isAndroid) {
    // console.log('video number: ', $('video').length);
    $('video').map((i, el) => {
      this.src = '';
      this.load();
      return el;
    });
  }
};
export default {
  loadEmptySrcAfterClick,
  MediaElement,
  PrismFlashplayer,
  NativeHLSPlayer,
};
