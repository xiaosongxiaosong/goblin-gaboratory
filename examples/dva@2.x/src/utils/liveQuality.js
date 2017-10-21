// import 'flv.js';
import storage from './storage';

const key = 'selectedQuality';
const list = [{
  name: '流畅',
  value: 'ld',
}, {
  name: '标清',
  value: 'sd',
}, {
  name: '高清',
  value: 'hd',
}, {
  name: '超清',
  value: 'fhd',
}];

const getSupportedQualitys = (flags) => {
  return list.filter((it, index) => {
    return 0 !== (flags & (1 << index));
  });
};

const getSelectedQuality = (supportedQualitys) => {
  const quality = storage.get(key);
  if (quality) {
    const selectedQuality = supportedQualitys.find((it) => {
      return it.value === quality;
    });
    if (selectedQuality) {
      return selectedQuality;
    } else {
      return getDefaultQuality(supportedQualitys);
    }
  } else {
    return getDefaultQuality(supportedQualitys);
  }
};

const getDefaultQuality = (supportedQualitys) => {
  if (0 < supportedQualitys.length) {
    return supportedQualitys[0];
  } else {
    return null;
  }
};

const selectQuality = (quality) => {
  const qualityValue = quality.value;
  return storage.set(key, qualityValue);
};

export default {
  getSupportedQualitys,
  getSelectedQuality,
  selectQuality,
};
