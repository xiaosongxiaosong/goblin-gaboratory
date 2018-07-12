// import { message } from 'antd';

import { share, sessionService, user } from '../../services';
import { liveFormat, notifyRequestError } from '../../utils';

function* stopSession({ call, put, select }) {
  const { projectName, info, sessionId } = yield select(state => state.show);
  if (null !== sessionId) {
    yield put({ type: 'setSessionId', payload: null });
    yield call(sessionService.destorySession, { projectName, cameraId: info.camera_uuid, sessionId });
  }
}

function* stopPlay({ call, put, select }) {
  yield* stopSession({ call, put, select });
  yield put({ type: 'setUrl', payload: null });
  yield put({ type: 'setPlayingState', payload: 'inited' });
}

export default {

  namespace: 'show',

  state: {
    showId: null,
    shareId: null,
    projectName: null,
    params: null,
    shareInfo: null,
    info: null,
    projectInfo: null,
    roleInfo: undefined,
    playingState: 'inited',
    url: null,
    sessionId: null,
    countdown: null,
    statistic: null,
    supportedFormats: null,
    selectedFormat: null,
  },

  subscriptions: {
    destory({ history, dispatch }) {
      return history.listen(() => {
        dispatch({ type: 'reset' });
      });
    },
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/show\/([\w\-_%]+)$/);
        if (match) {
          const projectName = match[1];
          const shareId = match[2];
          dispatch({ type: 'init', payload: { projectName, shareId } });
        }
      });
    },
    setupWithParams({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/show\/([\w\-_%]+)\/([\w\-_%]+)$/);
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
    *reset({ payload }, { call, put, select }) {
      yield call(stopPlay, { call, put, select });
      yield put({
        type: 'save',
        payload: {
          showId: null,
          shareId: null,
          projectName: null,
          params: null,
          shareInfo: null,
          info: null,
          projectInfo: null,
          roleInfo: undefined,
          playingState: 'inited',
          url: null,
          sessionId: null,
          countdown: null,
          statistic: null,
          supportedFormats: null,
          selectedFormat: null,
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
        // message.error('获取分享信息失败', 5);
        notifyRequestError(info.err, '获取分享信息失败');
      }
      if (info.data) {
        yield put({ type: 'saveShareInfo', payload: info.data });
        yield put({ type: 'getShowInfo', payload });
        yield put({ type: 'getProjectInfo', payload });
        yield put({ type: 'getStatistic', payload });
        yield put({ type: 'getRoleInfo', payload: { projectName, username: userInfo.username } });
      }
    },
    *getShowInfo({ payload }, { call, put }) {  // eslint-disable-line
      const info = yield call(share.getLiveShowInfo, payload);
      if (info.err) {
        notifyRequestError(info.err, '获取公开课信息失败');
      }
      if (info.data) {
        yield put({ type: 'saveInfo', payload: info.data });
        if (1 === info.data.state) {
          yield put({ type: 'initFormat' });
        }
      }
    },
    *initFormat({ payload }, { put }) {
      const supportedFormats = liveFormat.getSupportedFormats();
      yield put({ type: 'setSupportedFormats', payload: supportedFormats });
      const selectedFormat = liveFormat.getSelectedFormat(supportedFormats, '流畅', 'outerLiveFormatValue');
      yield put({ type: 'setSelectedFormat', payload: selectedFormat });
    },
    *getProjectInfo({ payload }, { call, put }) {
      const info = yield call(share.getProjectInfo, payload);
      if (info.data) {
        yield put({ type: 'saveProjectInfo', payload: info.data });
      }
    },
    *getRoleInfo({ payload }, { call, put, select, take }) {  // eslint-disable-line
      const { data } = yield call(user.getUserRole, payload);
      if (data) {
        return yield put({ type: 'saveRoleInfo', payload: data });
      } else {
        return yield put({ type: 'saveRoleInfo', payload: null });
      }
    },
    *getStatistic({ payload }, { call, put }) {
      const info = yield call(share.getStatistic, payload);
      if (undefined !== info.data) {
        yield put({ type: 'saveStatistic', payload: info.data });
      }
    },
    *startWithFormat({ payload }, { put, select, call }) {
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'setSelectedFormat', payload });
      liveFormat.selectFormat(payload, 'outerLiveFormatValue');
      yield put({ type: 'startPlay', payload });
    },
    *startPlay({ payload }, { call, put, select }) {
      const { projectName, shareId, selectedFormat } = yield select(state => state.show);
      yield put({ type: 'setPlayingState', payload: 'waitingForSession' });
      const response = yield call(share.createLiveSession, { projectName, shareId, streamFormat: selectedFormat.protocol });
      const { playingState } = yield select(state => state.show);
      if ('waitingForSession' === playingState) {
        if (response.err) {
          yield put({ type: 'setPlayingState', payload: 'error' });
          // message.error('启动直播失败', 5);
          notifyRequestError(response.err, '启动直播失败');
          return response;
        }
        if (response.data) {
          yield put({ type: 'setPlayingState', payload: 'living' });
          yield put({ type: 'setUrl', payload: response.data.url });
          yield put({ type: 'setSessionId', payload: response.data.session_id });
        }
      } else {
        yield put({ type: 'setSessionId', payload: response.data.session_id });
        yield call(stopSession, { call, put, select });
      }
    },
    *stopPlay({ payload }, { put, select, call }) {
      yield call(stopPlay, { call, put, select });
    },
    *restartPlay({ payload }, { put, select, call }) {
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'startPlay' });
    },
    *keepAlive({ payload }, { call, put, select }) {
      const { projectName, info, sessionId, playingState } = yield select(state => state.show);
      if ('living' !== playingState) {
        return;
      }
      const result = yield call(sessionService.sessionAlive, { projectName, cameraId: info.camera_uuid, sessionId });
      if (result.err !== undefined) {
        // message.error('公开课已停止', 5);
        notifyRequestError(result.err, '公开课已停止');
        yield call(stopPlay, { call, put, select });
      }
    },
    *startReplay({ payload }, { put, select, call }) {
      yield call(stopPlay, { call, put, select });
      const { projectName, shareId } = yield select(state => state.show);

      yield put({ type: 'setPlayingState', payload: 'waiting' });
      const response = yield call(share.createVodSession, { projectName, shareId });
      if (response.err) {
        yield put({ type: 'setPlayingState', payload: 'error' });
        // message.error('录像异常', 5);
        notifyRequestError(response.err, '播放录像失败');
        return response;
      }
      if (response.data) {
        yield put({ type: 'setPlayingState', payload: 'replaying' });
        yield put({ type: 'setUrl', payload: response.data.url });
      }
    },
    *getChatroom({ payload }, { call, put, select }) {
      const { projectName, shareId } = yield select(state => state.show);
      yield put({ type: 'saveChatroom', payload: undefined });
      const { err, data } = yield call(share.getShowChatroom, { projectName, shareId });
      if (err) {
        yield put({ type: 'saveChatroom', payload: null });
        notifyRequestError(response.err, '加载失败');
      }
      if (data) {
        yield put({ type: 'saveChatroom', payload: data });
      }
    },
    // *stopReplay({ payload }, { put }) {
    //   yield put({ type: 'setUrl', payload: null });
    // },
    *resize({ payload }, { put }) {
      yield put({ type: 'setSize', payload });
    },
    *setWaitingSeconds({ payload }, { put }) {
      yield put({ type: 'setSessionCountdown', payload });
    },
    *setShowCountdown({ payload }, { put }) {
      yield put({ type: 'setCountdown', payload });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveParams(state, action) {
      return { ...state, params: action.payload };
    },
    saveShareInfo(state, action) {
      return { ...state, shareInfo: action.payload };
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
    setSessionId(state, action) {
      return { ...state, sessionId: action.payload };
    },
    setSessionCountdown(state, action) {
      return { ...state, sessionCountdown: action.payload };
    },
    setSize(state, action) {
      return { ...state, size: action.payload };
    },
    setCountdown(state, action) {
      return { ...state, countdown: action.payload };
    },
    saveStatistic(state, action) {
      return { ...state, statistic: action.payload };
    },
    setSupportedFormats(state, action) {
      return { ...state, supportedFormats: action.payload };
    },
    setSelectedFormat(state, action) {
      return { ...state, selectedFormat: action.payload };
    },
    saveRoleInfo(state, action) {
      return { ...state, roleInfo: action.payload };
    },
    saveChatroom(state, action) {
      return { ...state, chatroom: action.payload };
    },
  },
};
