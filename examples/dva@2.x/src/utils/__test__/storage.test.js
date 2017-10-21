import storage from '../storage';

test('storage.getPrefix: 默认值', () => {
  expect(storage.getPrefix()).toBe('sharepage');
});

test('storage.setPrefix: 合法值', () => {
  expect(storage.setPrefix('client_')).toBe('client_');
});

test('storage.setPrefix: 非法值', () => {
  expect(storage.setPrefix('client-')).not.toBe('client-');
});

test('storage.setPrefix 后 getPrefix 获取结果与设置的一致:', () => {
  expect(storage.setPrefix('admin_')).toBe(storage.getPrefix());
});

test('storage.get：未设置获取结果未 null', () => {
  storage.setPrefix('test_');
  localStorage.clear();
  expect(storage.get('test')).toBe(null);
});

test('storage：不同命名空间相互不影响', () => {
  window.localStorage.clear();

  storage.setPrefix('jest_');
  storage.set('test', '123');


  storage.setPrefix('test_');
  expect(storage.get('test')).toBe(null);
  storage.set('test', '456');
  expect(storage.get('test')).toBe('456');


  storage.setPrefix('jest_');
  expect(storage.get('test')).toBe('123');

  storage.remove('test');
  expect(storage.get('test')).toBe(null);


  storage.setPrefix('test_');
  expect(storage.get('test')).toBe('456');

  storage.remove('test');
  expect(storage.get('test')).toBe(null);

  window.localStorage.clear();
});


test('storage.clear：不同命名空间相互不影响', () => {
  window.localStorage.clear();

  storage.setPrefix('test_');
  storage.set('test01', 'test01');
  storage.set('test02', 'test02');


  storage.setPrefix('jest_');
  storage.set('test01', 'test01');
  storage.set('test02', 'test02');
  expect(storage.get('test01')).toBe('test01');
  expect(storage.get('test02')).toBe('test02');
  storage.clear();
  expect(storage.get('test01')).toBe(null);
  expect(storage.get('test02')).toBe(null);


  storage.setPrefix('test_');
  expect(storage.get('test01')).toBe('test01');
  expect(storage.get('test02')).toBe('test02');

  window.localStorage.clear();
});


test('storage.clear：Prefix相互包含', () => {
  window.localStorage.clear();

  storage.setPrefix('test01');
  storage.set('test01', 'test01');
  storage.set('test02', 'test02');


  storage.setPrefix('test');
  storage.set('test01', 'test01');
  storage.set('test02', 'test02');
  expect(storage.get('test01')).toBe('test01');
  expect(storage.get('test02')).toBe('test02');
  storage.clear();
  expect(storage.get('test01')).toBe(null);
  expect(storage.get('test02')).toBe(null);


  storage.setPrefix('test01');
  expect(storage.get('test01')).toBe('test01');
  expect(storage.get('test02')).toBe('test02');

  window.localStorage.clear();
});

