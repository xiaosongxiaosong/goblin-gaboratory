const duration = (dur) => {
  const a = [{
    text: '秒',
    step: 60,
  }, {
    text: '分钟',
    step: 60,
  }, {
    text: '小时',
    step: 24,
  }, {
    text: '天',
    step: 7,
  }, {
    text: '周',
    step: 10000,
  }];
  let result = '';
  let time = Math.floor(dur / 1000);

  for (let i = 0, l = a.length; i < l; i += 1) {
    result = (time % a[i].step) + a[i].text + result;
    time = Math.floor(time / a[i].step);
    if (0 === time) {
      break;
    }
  }
  return result;
};

const convert2Date = (ipt) => {
  if (ipt instanceof Date) {
    return ipt;
  } else {
    return new Date(ipt);
  }
};
const dateFormat = (dt, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  const datetime = convert2Date(dt);
  return fmt
    .replace('yyyy', datetime.getFullYear())
    .replace('MM', (datetime.getMonth() + 1).toString().padStart(2, '0'))
    .replace('dd', datetime.getDate().toString().padStart(2, '0'))
    .replace('HH', datetime.getHours().toString().padStart(2, '0'))
    .replace('mm', datetime.getMinutes().toString().padStart(2, '0'))
    .replace('ss', datetime.getSeconds().toString().padStart(2, '0'));
};

export default {
  duration,
  dateFormat,
};
