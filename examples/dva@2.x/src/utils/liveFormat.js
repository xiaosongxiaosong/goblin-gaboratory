// import 'flv.js';
// import mejs from 'mediaelement';
import storage from './storage';

const key = 'liveFormatValue';

const getSupportedFormats = () => {
  const supportedFormats = [];
  if (window.mejs.Features.hasMSE && window.flvjs.getFeatureList().networkStreamIO) {
    supportedFormats.push({
      protocol: 'flv',
      value: '实时',
      foucelive: true,
      type: 'video/x-flv',
    }, {
      protocol: 'flv',
      value: '流畅',
      type: 'video/x-flv',
    });
  } else if (window.mejs.Features.supportsNativeHLS || window.mejs.Features.hasMSE) {
    supportedFormats.push({
      protocol: 'hls',
      value: '流畅',
      type: 'application/x-mpegURL',
    });
  }
  if ((true !== window.mejs.Features.isiOS && true !== window.mejs.Features.isAndroid) ||
    0 === supportedFormats.length) {
    supportedFormats.push({
      protocol: 'rtmp',
      value: '兼容',
      type: 'video/x-rtmp',
    });
  }
  return supportedFormats;
};

const getSelectedFormat = (supportedFormats, defaultFormatValue = '流畅') => {
  const formatValue = storage.get(key);
  if (formatValue) {
    const format = supportedFormats.find((it) => {
      return it.value === formatValue;
    });
    if (format) {
      return format;
    }
  }
  return getDefaultFormat(supportedFormats, defaultFormatValue);
};

const getDefaultFormat = (supportedFormats, defaultFormatValue = '流畅') => {
  const format = supportedFormats.find((it) => {
    return it.value === defaultFormatValue;
  });
  if (format) {
    return format;
  }
  return supportedFormats[0];
};

const selectFormat = (format) => {
  const formatValue = format.value;
  return storage.set(key, formatValue);
};

const removeSelectedFormat = () => {
  return storage.remove(key);
};

export default {
  getSupportedFormats,
  getSelectedFormat,
  selectFormat,
  removeSelectedFormat,
};
