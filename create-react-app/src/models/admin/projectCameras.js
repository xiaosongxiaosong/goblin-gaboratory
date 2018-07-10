// import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import eventServer from '../../services/event';
import projectServer from '../../services/project';


export default {

  namespace: 'project-cameras',

  state: {
    pageSize: 20,
    list: [],
    page: 1,
    total: undefined,
    keyword: undefined,
    loading: false,
    selected: undefined,
    storageQuota: undefined,
    info: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // debugger;
        const match = pathname.match(/^\/p\/([\w-]+)\/events$/);
        if (match) {
          return dispatch({ type: 'init', payload: { projectName: match[1] } });
        }
        const matObj = pathname.match(/^\/p\/([\w-]+)\/events\/([\w-]+)\//);
        if (matObj) {
          return dispatch({ type: 'getEventInfo', payload: { projectName: matObj[1], eventId: matObj[2] } });
        }
        // return dispatch({ type: 'reset' });
      });
    },
  },

  effects: {
    // *reset({ payload }, { call, put, select }) {
    //   yield put({ type: 'save', payload: { list: [], total: undefined } });
    // },
    *init({ payload }, { put }) {
      // const { list } = yield select(state => state.events);
      const { query } = queryString.parseUrl(window.location.href);
      const page = parseInt(query.page || 1, 10);
      yield put({ type: 'save', payload: { keyword: query.keyword, page } });
      yield put({ type: 'save', payload: { list: [], total: undefined } });
      yield put({ type: 'getStorageQuota', payload });
      yield put({ type: 'load', payload });
    },
    *getStorageQuota({ payload }, { call, put, select }) {
      const { storageQuota } = yield select(state => state.events);
      if (!storageQuota || storageQuota.project_name !== payload.projectName) {
        yield put({ type: 'save', payload: { storageQuota: undefined } });
        const { data } = yield call(projectServer.getStorageQuota, payload);
        yield put({ type: 'save', payload: { storageQuota: data || null } });
      }
    },
    *load({ payload }, { call, put, select }) {
      const { page, pageSize, keyword, loading } = yield select(state => state.events);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { loading: true } });
      const { selected } = yield select(state => state.client);
      const { data, err } = yield call(eventServer.getEvents, {
        projectName: selected,
        keyword,
        start: (page - 1) * pageSize,
        limit: pageSize,
      });
      yield put({ type: 'save', payload: { loading: false } });
      if (err) {
        // TODO: 获取课堂列表失败
      }
      // const { list } = yield select(state => state.events);
      if (data) {
        yield put({ type: 'save', payload: { list: data.list, total: data.total } });
      }
    },
    *getEventInfo({ payload }, { put, select }) {
      // yield put({ type: 'save', payload: { selected: payload } });
      const { info } = yield select(state => state.events);
      if (info && payload.eventId === info.event_id) {
        return;
      }
      yield put({ type: 'refreshEventInfo', payload });
      // yield put({ type: 'save', payload: { info: undefined } });
      // const { data } = yield call(eventServer.getEvent, payload);
      // yield put({ type: 'save', payload: { info: data || null } });
    },
    *refreshEventInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { info: undefined } });
      const { data } = yield call(eventServer.getEvent, payload);
      yield put({ type: 'save', payload: { info: data || null } });
    },
    *updateInfo({ payload }, { put, select }) {
      // yield put({ type: 'save', payload: { selected: payload } });
      const { info } = yield select(state => state.events);
      const { eventId, projectName, ...newData } = payload;
      if (info && projectName === info.project_name && eventId === info.event_id) {
        yield put({ type: 'save', payload: { info: { ...info, ...newData } } });
      }
    },
    // *playEventRecord({ payload }, { put, select }) {
    //   // yield put({ type: 'save', payload: { selected: payload } });
    //   playEventRecord(payload);
    //   // const { info } = yield select(state => state.events);
    //   // const { eventId, projectName, ...newData } = payload;
    //   // if (info && projectName === info.project_name && eventId === info.event_id) {
    //   //   yield put({ type: 'save', payload: { info: { ...info, ...newData } } });
    //   // }
    // },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
