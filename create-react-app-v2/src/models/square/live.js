import { message } from 'antd';

import { live } from '../../services';
import { liveFormat, liveQuality, isInTimeRange } from '../../utils';

function* stopSession({ call, put, select }) {
  const { projectName, cameraId, sessionId } = yield select(state => state.live);
  if (null !== sessionId) {
    yield put({ type: 'setSessionId', payload: null });
    yield call(live.stopSession, projectName, cameraId, sessionId);
  }
}

function* stopPlay({ call, put, select }) {
  yield* stopSession({ call, put, select });
  yield put({ type: 'setUrl', payload: null });
  yield put({ type: 'setPlayingState', payload: 'inited' });
}

export default {

  namespace: 'live',

  state: {
    cameraId: null,
    projectName: null,
    info: null,
    projectInfo: null,
    playingState: 'inited',
    url: null,
    sessionCountdown: 0,
    sessionId: null,
    // lastKeepalive: 0,
    size: {
      width: 1920,
      height: 950,
    },
    countdown: null,
    // statistic: null,
    supportedFormats: null,
    selectedFormat: null,
    supportedQualitys: null,
    selectedQuality: null,
    bInPublicTimeRange: false,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_]+)\/live\/([\w\-_]+)$/);
        if (match) {
          const projectName = match[1];
          const cameraId = match[2];
          dispatch({
            type: 'init',
            payload: { projectName, cameraId },
          });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *init({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save', payload });
      yield put({ type: 'getCameraInfo', payload });
      yield put({ type: 'getProjectInfo', payload: { projectName: payload.projectName } });
      // yield put({ type: 'getStatistic', payload });
    },
    *getCameraInfo({ payload }, { call, put }) {  // eslint-disable-line
      const info = yield call(live.getInfo, payload.projectName, payload.cameraId);
      if (undefined !== info.err) {
        message.error('获取摄像机信息失败', 5);
      }
      if (undefined !== info.data) {
        yield put({ type: 'saveInfo', payload: info.data });
        yield put({ type: 'initFormat' });
        yield put({ type: 'initQuality', payload: info.data });
        yield put({ type: 'checkRange', payload: info.data });
      }
    },
    *initFormat({ payload }, { put }) {
      const supportedFormats = liveFormat.getSupportedFormats();
      yield put({ type: 'setSupportedFormats', payload: supportedFormats });
      const selectedFormat = liveFormat.getSelectedFormat(supportedFormats, '流畅', 'outerLiveFormatValue');
      yield put({ type: 'setSelectedFormat', payload: selectedFormat });
    },
    *initQuality({ payload }, { put }) {
      const supportedQualitys = liveQuality.getSupportedQualitys(payload.flags);
      yield put({ type: 'setSupportedQualitys', payload: supportedQualitys });
      const selectedQuality = liveQuality.getSelectedQuality(supportedQualitys);
      yield put({ type: 'setSelectedQuality', payload: selectedQuality });
    },
    *checkRange({ payload }, { put, select }) {
      const { info } = yield select(state => state.live);
      if (info.is_public) {
        const bInPublicTimeRange = isInTimeRange(info.public_start, info.public_end);
        yield put({ type: 'setInPublicTimeRange', payload: bInPublicTimeRange });
      } else {
        yield put({ type: 'setInPublicTimeRange', payload: true });
      }
    },
    // *selectFormat({ payload }, { call, put }) {},
    *getProjectInfo({ payload }, { call, put }) {  // eslint-disable-line
      const projectInfo = yield call(live.getProjectInfo, payload.projectName);
      if (undefined !== projectInfo.data) {
        yield put({ type: 'saveProjectInfo', payload: projectInfo.data });
      }
    },
    *startWithFormat({ payload }, { call, put, select }) {
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'setSelectedFormat', payload });
      liveFormat.selectFormat(payload, 'outerLiveFormatValue');
      yield put({ type: 'startPlay', payload });
    },
    *startWithQuality({ payload }, { call, put, select }) {
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'setSelectedQuality', payload });
      liveQuality.selectQuality(payload);
      yield put({ type: 'startPlay' });
    },
    *startPlay({ payload }, { call, put, select }) {
      const { projectName, cameraId, selectedFormat, selectedQuality } = yield select(state => state.live);
      yield put({ type: 'setPlayingState', payload: 'waitingForSession' });
      const sessionService = yield call(live.createSession, projectName, cameraId, selectedFormat.protocol, selectedQuality.value);
      const { playingState } = yield select(state => state.live);
      if ('waitingForSession' === playingState) {
        if (undefined !== sessionService.err) {
          yield put({ type: 'setPlayingState', payload: 'error' });
          message.error('启动直播失败', 5);
        }
        if (undefined !== sessionService.data) {
          yield put({ type: 'setPlayingState', payload: 'living' });
          yield put({ type: 'setUrl', payload: sessionService.data.url });
          yield put({ type: 'setSessionId', payload: sessionService.data.session_id });
        }
      } else {
        put({ type: 'setSessionId', payload: sessionService.data.session_id });
        // yield put({ type: 'stopSession' });
        yield call(stopSession, { call, put, select });
      }
    },
    *restartPlay({ payload }, { call, put, select }) {
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'startPlay', payload });
    },
    *keepAlive({ payload }, { call, put, select }) {
      const { projectName, cameraId, sessionId, playingState } = yield select(state => state.live);
      if ('living' !== playingState) {
        return;
      }
      const result = yield call(live.sessionAlive, projectName, cameraId, sessionId);
      if (result.err !== undefined) {
        message.error('摄像头已停止分享', 5);
        yield call(stopPlay, { call, put, select });
      }
    },
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
    // saveStatistic(state, action) {
    //   return { ...state, statistic: action.payload };
    // },
    setSupportedFormats(state, action) {
      return { ...state, supportedFormats: action.payload };
    },
    setSelectedFormat(state, action) {
      return { ...state, selectedFormat: action.payload };
    },
    setSupportedQualitys(state, action) {
      return { ...state, supportedQualitys: action.payload };
    },
    setSelectedQuality(state, action) {
      return { ...state, selectedQuality: action.payload };
    },
    setInPublicTimeRange(state, action) {
      return { ...state, bInPublicTimeRange: action.payload };
    },
  },
};
