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

export function getGuideRouterData() {
  return [{
    path: '/guide/user',
    key: 'user',
    name: '完善资料',
    models: () => [],
    component: () => import('../routes/Client/Guide/User'),
  }, {
    path: '/guide/project',
    key: 'project',
    name: '创建商户',
    models: () => [],
    component: () => import('../routes/Client/Guide/Project'),
  }, {
    path: '/guide/finish',
    key: 'finish',
    name: '完成',
    models: () => [],
    component: () => import('../routes/Client/Guide/Finish'),
  }];
}

export function getClientRouterData() {
  return [{
    path: '/p/:name/project',
    key: 'project',
    name: '商户主页',
    icon: 'home',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Project'),
  }, {
    path: '/p/:name/project/info',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Project'),
  }, {
    path: '/p/:name/project/logo',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Project'),
  }, {
    path: '/p/:name/project/phone',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Project'),
  }, {
    path: '/p/:name/project/address',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Project'),
  }, {
    path: '/p/:name/shows',
    name: '课堂',
    icon: 'classroom',
    key: 'shows',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows'),
  }, {
    path: '/p/:name/shows/:showId',
    exact: false,
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Show'),
  }, {
    path: '/p/:name/cameras',
    name: '摄像机',
    icon: 'videocamera',
    key: 'cameras',
    models: () => [
      import('../models/client/project'),
      import('../models/client/cameras'),
    ],
    component: () => import('../routes/Client/Cameras'),
  }, {
    path: '/p/:name/events',
    name: '录像库',
    icon: 'clouddisk',
    key: 'events',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events'),
  }, {
    path: '/p/:name/events/upload',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/EventUpload'),
  }, {
    path: '/p/:name/events/clip',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/EventClip'),
  }, {
    path: '/p/:name/events/:eventId/modify',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/EventInfo'),
  }, {
    path: '/p/:name/events/:eventId',
    exact: false,
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/EventRecord'),
  }, {
    path: '/u/user',
    name: '用户主页',
    icon: 'clouddisk',
    key: 'user',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Events'),
  }, {
    path: '/u/key',
    name: 'key',
    icon: 'clouddisk',
    key: 'key',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Events'),
  }, {
    path: '/u/pwd',
    name: '修改密码',
    icon: 'clouddisk',
    key: 'pwd',
    models: () => [
      import('../models/client/project'),
    ],
    component: () => import('../routes/Client/Events'),
  }];
}

const getClientShowRouterData = () => {
  return [{
    path: '/p/:name/shows/:showId/basic',
    key: 'basic',
    name: '基本信息',
    // icon: 'home',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Basic'),
  }, {
    path: '/p/:name/shows/:showId/records',
    key: 'records',
    name: '录像列表',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Records'),
  }, {
    path: '/p/:name/shows/:showId/statistics',
    key: 'statistics',
    name: '统计信息',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Statistics'),
  }, {
    path: '/p/:name/shows/:showId/statistics/:statisticId',
    // key: 'statistic',
    // name: '统计信息',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Statistics'),
  }, {
    path: '/p/:name/shows/:showId/schedules',
    key: 'schedules',
    name: '自动录课',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Schedules'),
  }, {
    path: '/p/:name/shows/:showId/schedules/:scheduleId',
    // key: 'schedules',
    // name: '自动录课',
    models: () => [
      import('../models/client/project'),
      import('../models/client/shows'),
    ],
    component: () => import('../routes/Client/Shows/Statistics'),
  }];
};

const getClientEventRouterData = () => {
  return [{
    path: '/p/:name/events/:eventId/shows',
    key: 'shows',
    name: '关联课堂',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/Shows'),
  }, {
    path: '/p/:name/events/:eventId/basic',
    key: 'basic',
    name: '基本信息',
    // icon: 'home',
    models: () => [
      import('../models/client/project'),
      import('../models/client/events'),
    ],
    component: () => import('../routes/Client/Events/Basic'),
  }];
};
export function getGuideRouters(app) {
  return getRoutes(getGuideRouterData(), app);
}

export function getGuideMenu() {
  return getGuideRouterData().filter((it) => {
    return undefined !== it.key;
  });
}

export function getClientRoutes(app) {
  return getRoutes(getClientRouterData(), app);
}

export function getClientSider(prefix) {
  return getClientRouterData().filter((it) => {
    return undefined !== it.key && 0 === it.path.search(prefix);
  });
}

export function getClientShowRoutes(app) {
  return getRoutes(getClientShowRouterData(), app);
}

export function getClientShowTabs() {
  return getClientShowRouterData().filter((it) => {
    return undefined !== it.key;
  });
}

export function getClientEventRoutes(app) {
  return getRoutes(getClientEventRouterData(), app);
}

export function getClientEventTabs() {
  return getClientEventRouterData().filter((it) => {
    return undefined !== it.key;
  });
}
