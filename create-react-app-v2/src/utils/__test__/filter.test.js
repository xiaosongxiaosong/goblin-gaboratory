import {
  duration,
  sharePrivate,
  streamQuality,
  showState,
  showStateType,
  showPublic,
  eventState,
  eventStateType,
  eventStateExceptionDesc,
  eventStateDescription,
} from '../filter';

// test('duration: 负数', () => {
//   expect(duration(-100000)).toEqual('0秒');
// });

test('duration', () => {
  // 0
  expect(duration(0)).toBe('0秒');
  // 小于1秒
  expect(duration(999)).toBe('1秒');
  // 正常值
  expect(duration(61411859)).toBe('17时3分32秒');
  // 1天
  expect(duration(1000 * 60 * 60 * 24)).toBe('1天');
  // 超过一周
  expect(duration(3300223464)).toBe('5周3天4时43分44秒');
});

test('sharePrivate', () => {
  expect(sharePrivate(true)).toBe('私密');
  expect(sharePrivate(false)).toBe('公开');
  expect(sharePrivate()).toBe('公开');
});

test('streamQuality', () => {
  expect(streamQuality('ld')).toBe('流畅');
  expect(streamQuality('sd')).toBe('标清');
  expect(streamQuality('hd')).toBe('高清');
  expect(streamQuality('fhd')).toBe('超清');
});

test('showState', () => {
  expect(showState(0)).toBe('未开始');
  expect(showState(1)).toBe('直播中');
  expect(showState(2)).toBe('暂停中');
  expect(showState(3)).toBe('已结束');
  expect(showState(4)).toBe('未知');
});

test('showStateType', () => {
  expect(showStateType(0)).toBe('default');
  expect(showStateType(1)).toBe('success');
  expect(showStateType(2)).toBe('success');
  expect(showStateType(3)).toBe('default');
  expect(showStateType(4)).toBe('default');
});

test('showPublic', () => {
  expect(showPublic(0)).toBe('内部');
  expect(showPublic(1)).toBe('公开发布');
  expect(showPublic(2)).toBe('密码');
  expect(showPublic(3)).toBe('报名审核');
  expect(showPublic(4)).toBe('付费观看');
  expect(showPublic(5)).toBe('未知');
});

test('eventState', () => {
  expect(eventState(-2)).toBe('异常');
  expect(eventState(0)).toBe('备份中');
  expect(eventState(1)).toBe('正常');
  expect(eventState(2)).toBe('异常');
  expect(eventState(3)).toBe('删除中');
  expect(eventState(4)).toBe('转码中');
  expect(eventState(5)).toBe('转码中');
  expect(eventState(6)).toBe('转码失败');
  expect(eventState(7)).toBe('合成中');
  expect(eventState(8)).toBe('剪辑中');
  expect(eventState(9)).toBe('录像中');
  expect(eventState(10)).toBe('未知');
});

test('eventStateType', () => {
  expect(eventStateType(-2)).toBe('error');
  expect(eventStateType(0)).toBe('processing');
  expect(eventStateType(1)).toBe('success');
  expect(eventStateType(2)).toBe('error');
  expect(eventStateType(3)).toBe('processing');
  expect(eventStateType(4)).toBe('processing');
  expect(eventStateType(5)).toBe('processing');
  expect(eventStateType(6)).toBe('error');
  expect(eventStateType(7)).toBe('processing');
  expect(eventStateType(8)).toBe('processing');
  expect(eventStateType(9)).toBe('processing');
  expect(eventStateType(10)).toBe('error');
});

test('eventStateExceptionDesc', () => {
  expect(eventStateExceptionDesc(-1)).toBe('未知异常');
  expect(eventStateExceptionDesc(-2)).toBe('设备异常');
  expect(eventStateExceptionDesc(-3)).toBe('录像时间太短');
  expect(eventStateExceptionDesc(-4)).toBe('存储配额满/过期');
  expect(eventStateExceptionDesc(-5)).toBe('未知异常');
  expect(eventStateExceptionDesc(5)).toBe('');
});

test('eventStateDescription', () => {
  expect(eventStateDescription(-1)).toBe('异常(未知异常)');
  expect(eventStateDescription(-2)).toBe('异常(设备异常)');
  expect(eventStateDescription(-3)).toBe('异常(录像时间太短)');
  expect(eventStateDescription(-4)).toBe('异常(存储配额满/过期)');
  expect(eventStateDescription(-5)).toBe('异常(未知异常)');
  expect(eventStateDescription(0)).toBe('备份中');
  expect(eventStateDescription(1)).toBe('正常');
  expect(eventStateDescription(2)).toBe('异常');
  expect(eventStateDescription(3)).toBe('删除中');
  expect(eventStateDescription(4)).toBe('转码中');
  expect(eventStateDescription(5)).toBe('转码中');
  expect(eventStateDescription(6)).toBe('转码失败');
  expect(eventStateDescription(7)).toBe('合成中');
  expect(eventStateDescription(8)).toBe('剪辑中');
  expect(eventStateDescription(9)).toBe('录像中');
  expect(eventStateDescription(10)).toBe('未知');
});
