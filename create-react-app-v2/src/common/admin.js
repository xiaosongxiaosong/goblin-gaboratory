import React from 'react';
import dynamic from 'dva/dynamic';
import { Route } from 'dva/router';


const getRoutes = (routerData, app) => {
  const Routes = routerData.map((it) => {
    // debugger;
    const Component = dynamic({ app, models: it.models, component: it.component });
    const exact = false !== it.exact;
    return (
      <Route key={it.path} path={it.path} exact={exact} render={props => <Component {...props} app={app} />} />
    );
  });
  return Routes;
};

export function getAdminRouterData() {
  return [{
    path: '/dashboard',
    key: 'dashboard',
    name: '系统概况',
    icon: 'dashboard',
    models: () => [
      import('../models/admin/dashboard'),
    ],
    component: () => import('../routes/Admin/Dashboard'),
  }, {
    path: '/projects',
    key: 'projects',
    name: '商户列表',
    icon: 'shop',
    models: () => [
      import('../models/admin/projects'),
    ],
    component: () => import('../routes/Admin/Projects'),
  }, {
    path: '/projects/:projectName',
    exact: false,
    models: () => [
      import('../models/admin/projects'),
    ],
    component: () => import('../routes/Admin/Projects/Project'),
  }, {
    path: '/users',
    key: 'users',
    name: '用户列表',
    icon: 'user',
    models: () => [
      import('../models/admin/users'),
    ],
    component: () => import('../routes/Admin/Users'),
  }, {
    path: '/users/:username',
    models: () => [
      import('../models/admin/users'),
    ],
    component: () => import('../routes/Admin/Users/UserDetail'),
  }, {
    path: '/bindings',
    key: 'bindings',
    name: '微信用户',
    icon: 'wechat',
    models: () => [
      import('../models/admin/bindings'),
    ],
    component: () => import('../routes/Admin/Bindings'),
  }, {
    path: '/bindings/:bindingId',
    models: () => [
      import('../models/admin/bindings'),
    ],
    component: () => import('../routes/Admin/Bindings/BindingDetail'),
  }, {
    path: '/devices',
    key: 'devices',
    name: '设备搜索',
    icon: 'search',
    models: () => [
      import('../models/admin/devices'),
    ],
    component: () => import('../routes/Admin/Devices'),
  }, {
    path: '/devices/:deviceId',
    models: () => [
      import('../models/admin/devices'),
    ],
    component: () => import('../routes/Admin/Devices/DeviceDetail'),
  }, {
    path: '/user/detail',
    name: '用户信息',
    icon: 'user',
    key: 'detail',
    models: () => [
      import('../models/admin/user'),
    ],
    component: () => import('../routes/Admin/User'),
  }, {
    path: '/user/keys',
    name: 'access key',
    icon: 'key',
    key: 'key',
    models: () => [
      import('../models/admin/user'),
    ],
    component: () => import('../routes/Admin/User/AccessKeys'),
  }, {
    path: '/user/keys/:keyId',
    models: () => [
      import('../models/admin/user'),
    ],
    component: () => import('../routes/Admin/User/AccessKey'),
  }, {
    path: '/user/pwd',
    name: '修改密码',
    icon: 'form',
    key: 'pwd',
    models: () => [
      import('../models/admin/user'),
    ],
    component: () => import('../routes/Admin/User/ChangePwd'),
  }];
}

const getAdminProjectRouterData = () => {
  return [{
    path: '/projects/:projectName/detail',
    key: 'detail',
    name: '商户信息',
    models: () => [
      import('../models/admin/projects'),
    ],
    component: () => import('../routes/Admin/Projects/ProjectDetail'),
  }, {
    path: '/projects/:projectName/account',
    key: 'account',
    name: '账户',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectAccount'),
    ],
    component: () => import('../routes/Admin/Projects/Account'),
  }, {
    path: '/projects/:projectName/users',
    key: 'users',
    name: '用户',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectUsers'),
    ],
    component: () => import('../routes/Admin/Projects/Users'),
  }, {
    path: '/projects/:projectName/users/:username',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectUsers'),
    ],
    component: () => import('../routes/Admin/Projects/User'),
  }, {
    path: '/projects/:projectName/bills',
    key: 'bills',
    name: '钱包',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectBills'),
    ],
    component: () => import('../routes/Admin/Projects/Bills'),
  }, {
    path: '/projects/:projectName/bills/:billId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectBills'),
    ],
    component: () => import('../routes/Admin/Projects/Bill'),
  }, {
    path: '/projects/:projectName/cameras',
    key: 'cameras',
    name: '摄像机',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectCameras'),
    ],
    component: () => import('../routes/Admin/Projects/Cameras'),
  }, {
    path: '/projects/:projectName/cameras/:cameraId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectCameras'),
    ],
    component: () => import('../routes/Admin/Projects/Camera'),
  }, {
    path: '/projects/:projectName/sessions',
    key: 'sessions',
    name: '会话',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectSessions'),
    ],
    component: () => import('../routes/Admin/Projects/Sessions'),
  }, {
    path: '/projects/:projectName/sessions/:sessionId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectSessions'),
    ],
    component: () => import('../routes/Admin/Projects/Session'),
  }, {
    path: '/projects/:projectName/logs',
    key: 'logs',
    name: '直播记录',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectLogs'),
    ],
    component: () => import('../routes/Admin/Projects/Logs'),
  }, {
    path: '/projects/:projectName/logs/:sessionId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectLogs'),
    ],
    component: () => import('../routes/Admin/Projects/Log'),
  }, {
    path: '/projects/:projectName/devices',
    key: 'devices',
    name: '设备',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectDevices'),
    ],
    component: () => import('../routes/Admin/Projects/Devices'),
  }, {
    path: '/projects/:projectName/devices/:deviceId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectDevices'),
    ],
    component: () => import('../routes/Admin/Projects/Device'),
  }, {
    path: '/projects/:projectName/firmwares',
    key: 'firmwares',
    name: '固件',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectFirmwares'),
    ],
    component: () => import('../routes/Admin/Projects/Firmwares'),
  }, {
    path: '/projects/:projectName/firmwares/:firmwareId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectFirmwares'),
    ],
    component: () => import('../routes/Admin/Projects/Firmware'),
  }, {
    path: '/projects/:projectName/schedules',
    key: 'schedules',
    name: '录像计划',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectSchedules'),
    ],
    component: () => import('../routes/Admin/Projects/Schedules'),
  }, {
    path: '/projects/:projectName/schedules/:scheduleId',
    models: () => [
      import('../models/admin/projects'),
      import('../models/admin/projectSchedules'),
    ],
    component: () => import('../routes/Admin/Projects/Schedule'),
  }];
};


export function getAdminRoutes(app) {
  return getRoutes(getAdminRouterData(), app);
}

export function getAdminSider(filter) {
  return getAdminRouterData().filter((it) => {
    return undefined !== it.key && filter(it);
  });
}

export function getAdminProjectRoutes(app) {
  return getRoutes(getAdminProjectRouterData(), app);
}

export function getAdminProjectTabs() {
  return getAdminProjectRouterData().filter((it) => {
    return undefined !== it.key;
  });
}
