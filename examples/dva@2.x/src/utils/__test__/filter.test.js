import filter from '../filter';

// test('duration: 负数', () => {
//   expect(filter.duration(-100000)).toEqual('0秒');
// });

test('duration: 小于1秒', () => {
  expect(filter.duration(999)).toBe('0秒');
});

test('duration: 正常值', () => {
  expect(filter.duration(61411859)).toBe('17小时3分钟31秒');
});

test('duration: 一天', () => {
  expect(filter.duration(1000 * 60 * 60 * 24)).toBe('1天0小时0分钟0秒');
});

test('duration: 超过一周', () => {
  expect(filter.duration(3300223464)).toBe('5周3天4小时43分钟43秒');
});

test('dateFormat: 结果转换回去与预期一致', () => {
  const dt = new Date();
  const datetime = dt.getTime();
  expect(new Date(filter.dateFormat(dt))).toEqual(new Date(dt.setMilliseconds(0)));
  expect(new Date(filter.dateFormat(datetime)).getTime()).toBe(Math.floor(datetime / 1000) * 1000);
});

test('dateFormat: 参数类型自适应', () => {
  const dt = new Date();
  const datetime = dt.getTime();
  expect(filter.dateFormat(dt)).toEqual(filter.dateFormat(datetime));
});

