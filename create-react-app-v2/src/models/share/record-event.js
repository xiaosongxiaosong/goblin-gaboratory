import { message } from 'antd';
import { share } from '../../services';


export default {

  namespace: 'recordevent',

  state: {
    shareId: null,
    projectName: null,
    params: null,
    info: null,
    projectInfo: null,
    playingState: 'inited',
    url: null,
    size: {
      width: 1920,
      height: 950,
    },
  },

  subscriptions: {
    destory({ history, dispatch }) {
      return history.listen(() => {
        dispatch({ type: 'reset' });
      });
    },
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/event\/([\w\-_%]+)$/);
        if (match) {
          const projectName = match[1];
          const shareId = match[2];
          dispatch({ type: 'init', payload: { projectName, shareId } });
        }
      });
    },
    setupWithParams({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/event\/([\w\-_%]+)\/([\w\-_%]+)$/);
        if (match) {
          const projectName = match[1];
          const shareId = match[2];
          const params = JSON.parse(decodeURIComponent(match[3]));
          // dispatch({ type: 'saveParams', payload: { params } });
          dispatch({ type: 'init', payload: { projectName, shareId, params } });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { put }) {
      yield put({ type: 'save' });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          shareId: null,
          projectName: null,
          params: null,
          info: null,
          projectInfo: null,
          playingState: 'inited',
          url: null,
          size: {
            width: 1920,
            height: 950,
          },
        },
      });
    },
    *init({ payload }, { put }) {
      yield put({ type: 'save', payload });
      yield put({ type: 'getShareInfo', payload });
    },
    *getShareInfo({ payload }, { call, put, select, take }) {
      const { userInfo } = yield yield select(state => state.share);
      if (undefined === userInfo || null === userInfo) {
        yield take('share/saveUserInfo');
        return yield put({ type: 'getShareInfo', payload });
      }

      const { projectName, shareId } = payload;
      const info = yield call(share.getShareInfo, { projectName, shareId });
      if (info.err) {
        message.error('获取分享信息失败', 5);
      }
      if (info.data) {
        yield put({ type: 'saveInfo', payload: info.data });
        yield put({ type: 'getProjectInfo', payload });
      }
    },
    *getProjectInfo({ payload }, { call, put }) {
      const info = yield call(share.getProjectInfo, payload);
      if (info.data) {
        yield put({ type: 'saveProjectInfo', payload: info.data });
      }
    },
    *startReplay({ payload }, { put, select, call }) {
      yield put({ type: 'setUrl', payload: null });
      const { projectName, shareId } = yield select(state => state.recordevent);

      yield put({ type: 'setPlayingState', payload: 'waiting' });
      const response = yield call(share.createVodSession, { projectName, shareId });
      if (response.err) {
        yield put({ type: 'setPlayingState', payload: 'error' });
        message.error('录像异常', 5);
        return response;
      }
      if (response.data) {
        yield put({ type: 'setPlayingState', payload: 'replaying' });
        yield put({ type: 'setUrl', payload: response.data.url });
      }
    },
    *resize({ payload }, { put }) {
      yield put({ type: 'setSize', payload });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveParams(state, action) {
      return { ...state, params: action.payload };
    },
    saveInfo(state, action) {
      return { ...state, info: action.payload };
    },
    saveProjectInfo(state, action) {
      return { ...state, projectInfo: action.payload };
    },
    setPlayingState(state, action) {
      return { ...state, playingState: action.payload };
    },
    setUrl(state, action) {
      return { ...state, url: action.payload };
    },
    setSize(state, action) {
      return { ...state, size: action.payload };
    },
    setCountdown(state, action) {
      return { ...state, countdown: action.payload };
    },
  },
};
