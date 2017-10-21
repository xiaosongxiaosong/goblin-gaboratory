import liveFormat from '../liveFormat';

// test('duration: 负数', () => {
//   expect(filter.duration(-100000)).toEqual('0秒');
// });
const checkType = (format) => {
  if ('flv' === format.protocol) {
    return 'video/x-flv' === format.type;
  } else if ('hls' === format.protocol) {
    return 'application/x-mpegURL' === format.type;
  } else if ('rtmp' === format.protocol) {
    return 'video/x-rtmp' === format.type;
  } else {
    return false;
  }
};

test('liveFormat: chrome', () => {
  window.mejs = {
    Features: {
      hasMSE: true,
      supportsNativeHLS: false,
    },
  };
  window.flvjs = {
    getFeatureList() {
      return { networkStreamIO: true };
    },
  };
  window.prismplayer = () => { };
  const supportedFormats = liveFormat.getSupportedFormats();

  supportedFormats.map((it) => {
    expect(checkType(it)).toBeTruthy();
    return it;
  });

  const expected = [{
    protocol: 'flv',
    value: '实时',
    foucelive: true,
    type: 'video/x-flv',
  }, {
    protocol: 'flv',
    value: '流畅',
    type: 'video/x-flv',
  }, {
    protocol: 'rtmp',
    value: '兼容',
    type: 'video/x-rtmp',
  }];
  expect(supportedFormats).toMatchObject(expected);

  const defaultFormat = liveFormat.getSelectedFormat(supportedFormats);
  expect(checkType(defaultFormat)).toBeTruthy();
  expect(defaultFormat.value).toBe('流畅');

  const defaultFormatValue = '兼容';
  expect(liveFormat.getSelectedFormat(supportedFormats, defaultFormatValue).value).toBe(defaultFormatValue);

  const idx = Math.floor(Math.random() * expected.length);
  liveFormat.selectFormat(expected[idx]);
  expect(liveFormat.getSelectedFormat(supportedFormats)).toMatchObject(expected[idx]);

  liveFormat.selectFormat({
    protocol: 'hls',
    value: '超流畅',
    type: 'application/x-mpegURL',
  });
  expect(liveFormat.getSelectedFormat(supportedFormats)).toMatchObject(defaultFormat);

  liveFormat.selectFormat({
    protocol: 'hls',
    value: '流畅',
    type: 'application/x-mpegURL',
  });
  expect(liveFormat.getSelectedFormat(supportedFormats)).toMatchObject({
    protocol: 'flv',
    value: '流畅',
    type: 'video/x-flv',
  });

  liveFormat.removeSelectedFormat();
  expect(liveFormat.getSelectedFormat(supportedFormats)).toMatchObject(defaultFormat);
});

test('liveFormat: IE', () => {
  window.mejs = {
    Features: {
      hasMSE: true,
      supportsNativeHLS: false,
    },
  };
  window.flvjs = {
    getFeatureList() {
      return { networkStreamIO: false };
    },
  };
  window.prismplayer = () => { };

  const supportedFormats = liveFormat.getSupportedFormats();

  supportedFormats.map((it) => {
    expect(checkType(it)).toBeTruthy();
    return it;
  });

  const expected = [{
    protocol: 'hls',
    value: '流畅',
    type: 'application/x-mpegURL',
  }, {
    protocol: 'rtmp',
    value: '兼容',
    type: 'video/x-rtmp',
  }];
  expect(supportedFormats).toMatchObject(expected);
});

test('liveFormat: safari on ipad', () => {
  window.mejs = {
    Features: {
      hasMSE: false,
      supportsNativeHLS: true,
      isiOS: true,
    },
  };
  window.flvjs = {
    getFeatureList() {
      return { networkStreamIO: false };
    },
  };
  window.prismplayer = undefined;

  const supportedFormats = liveFormat.getSupportedFormats();

  supportedFormats.map((it) => {
    expect(checkType(it)).toBeTruthy();
    return it;
  });

  const expected = [{
    protocol: 'hls',
    value: '流畅',
    type: 'application/x-mpegURL',
  }];
  expect(supportedFormats).toMatchObject(expected);
});

test('liveFormat: safari on macOS', () => {
  window.mejs = {
    Features: {
      hasMSE: true,
      supportsNativeHLS: true,
    },
  };
  window.flvjs = {
    getFeatureList() {
      return { networkStreamIO: false };
    },
  };
  window.prismplayer = () => { };

  const supportedFormats = liveFormat.getSupportedFormats();

  supportedFormats.map((it) => {
    expect(checkType(it)).toBeTruthy();
    return it;
  });

  const expected = [{
    protocol: 'hls',
    value: '流畅',
    type: 'application/x-mpegURL',
  }, {
    protocol: 'rtmp',
    value: '兼容',
    type: 'video/x-rtmp',
  }];
  expect(supportedFormats).toMatchObject(expected);
});
