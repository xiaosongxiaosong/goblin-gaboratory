import queryString from 'query-string';
import showServer from '../../services/show';

export default {

  namespace: 'shows',

  state: {
    pageSize: 20,
    list: [],
    page: 1,
    total: undefined,
    keyword: undefined,
    loading: false,
    info: undefined,
    tags: undefined,
    statistic: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/p\/([\w-]+)\/shows$/);
        if (match) {
          return dispatch({ type: 'init', payload: match[1] });
        }
        const matObj = pathname.match(/^\/p\/([\w-]+)\/shows\/([\w-]+)\//);
        if (matObj) {
          return dispatch({ type: 'getShowInfo', payload: { projectName: matObj[1], showId: matObj[2] } });
        }
      });
    },
  },

  effects: {
    *init({ payload }, { call, put, select }) {  // eslint-disable-line
      const { query } = queryString.parseUrl(window.location.href);
      const page = parseInt(query.page || 1, 10);
      yield put({ type: 'save', payload: { keyword: query.keyword, page } });
      yield put({ type: 'save', payload: { list: [], total: undefined } });
      yield put({ type: 'load', payload });
    },
    *load({ payload }, { call, put, select }) {
      const { page, pageSize, keyword, loading } = yield select(state => state.shows);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { loading: true } });
      const { selected } = yield select(state => state.client);
      const { data, err } = yield call(showServer.getShows, {
        projectName: selected,
        keyword,
        start: (page - 1) * pageSize,
        limit: pageSize,
      });
      yield put({ type: 'save', payload: { loading: false } });
      if (err) {
        // TODO: 获取课堂列表失败
      }
      if (data) {
        yield put({ type: 'save', payload: { list: data.list, total: data.total } });
      }
    },
    *getShowInfo({ payload }, { put, select }) {
      // yield put({ type: 'save', payload: { selected: payload } });
      const { info } = yield select(state => state.shows);
      if (!info || payload.showId !== info.uuid) {
        yield put({ type: 'refreshShowInfo', payload });
      }
    },
    *refreshShowInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { info: undefined, tags: undefined, statistic: undefined } });
      // const { data } = yield call(showServer.getShow, payload);
      const [info, tags, statistic] = yield [
        call(showServer.getShow, payload),
        call(showServer.getShowTags, payload),
        call(showServer.getShowStatistic, payload),
      ];
      yield put({
        type: 'save',
        payload: {
          info: info.data || null,
          tags: (tags.data || null),
          statistic: (statistic.data || null),
        },
      });
    },
    // *updateInfo({ payload }, { put, select }) {
    //   // yield put({ type: 'save', payload: { selected: payload } });
    //   const { info } = yield select(state => state.events);
    //   const { eventId, projectName, ...newData } = payload;
    //   if (info && projectName === info.project_name && eventId === info.event_id) {
    //     yield put({ type: 'save', payload: { info: { ...info, ...newData } } });
    //   }
    // },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
