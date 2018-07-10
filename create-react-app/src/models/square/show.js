// import { message, notification } from 'antd';
import { notification } from 'antd';

import { squareService, sessionService, user } from '../../services';
import { liveFormat, watchPassword, notifyRequestError } from '../../utils';

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

function* showPasswdModal({ put, select, take }) {
  yield put({ type: 'setPasswd', payload: null });
  yield put({ type: 'setPasswdModalVisible', payload: true });
  yield take('show/hidePasswdModal');
  const { passwd } = yield select(state => state.show);
  if (passwd) {
    return { password: passwd };
  } else {
    return null;
  }
}

function* checkAuth({ call, put, select, take }) {
  const { info, passwd, roleInfo } = yield select(state => state.show);
  if (roleInfo || 1 === info.is_public) {
    return {};
  }
  if (0 === info.is_public) {
    notification.error({ message: '内部课堂，无观看权限', description: '' });
    return null;
  }
  if (watchPassword.checkWatchPassword(passwd)) {
    return { password: passwd };
  }
  const lastPasswd = watchPassword.getWatchPassword();
  if (lastPasswd) {
    return { password: lastPasswd };
  }
  // yield* showPasswdModal({ call, put, select });
  return yield call(showPasswdModal, { put, select, take });
  // return yield* showPasswdModal({ call, put, select, take });
}

function* createSessionFaild(err, passwd, defaultMsg, { call, put, select, take }) {
  yield put({ type: 'setPlayingState', payload: 'error' });
  yield put({ type: 'setPasswd', payload: null });
  if (err.response && err.response.status) {
    if (414 === err.response.status) {
      notification.error({ message: '公开课已结束或未开始', description: '' });
    } else if (415 === err.response.status) {
      notification.error({ message: '并发超过上限', description: '' });
    } else if (417 === err.response.status) {
      if (passwd) {
        notification.error({ message: '观看密码错误', description: '' });
      }
      return yield call(showPasswdModal, { put, select, take });
    } else if (420 === err.response.status) {
      notification.error({ message: '录像转码中，请稍候', description: '' });
    } else {
      notifyRequestError(err, defaultMsg);
    }
  } else {
    notification.error({ message: '网络异常', description: '' });
  }
  return null;
}

export default {

  namespace: 'show',

  state: {
    showId: null,
    projectName: null,
    params: null,
    info: null,
    projectInfo: null,
    playingState: 'inited',
    url: null,
    // sessionCountdown: 0,
    sessionId: null,
    size: {
      width: 1920,
      height: 950,
    },
    countdown: null,
    statistic: null,
    supportedFormats: null,
    selectedFormat: null,
    passwd: null,
    passwdModalVisible: false,
    passwdModalType: null,
    roleInfo: undefined,
    chatroom: undefined,
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/show\/([\w\-_%]+)$/);
        if (match) {
          const projectName = match[1];
          const showId = match[2];
          dispatch({
            type: 'init',
            payload: { projectName, showId },
          });
        }
      });
    },
    setupWithParams({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/([\w\-_%]+)\/show\/([\w\-_%]+)\/([\w\-_%]+)$/);
        if (match) {
          const projectName = match[1];
          const showId = match[2];
          const params = JSON.parse(decodeURIComponent(match[3]));
          dispatch({ type: 'init', payload: { projectName, showId, params } });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *reset({ payload }, { call, put, select }) {  // eslint-disable-line
      yield put({
        type: 'save',
        payload: {
          showId: null,
          projectName: null,
          params: null,
          info: null,
          projectInfo: null,
          playingState: 'inited',
          url: null,
          // sessionCountdown: 0,
          sessionId: null,
          countdown: null,
          statistic: null,
          supportedFormats: null,
          selectedFormat: null,
          passwd: null,
          passwdModalVisible: false,
          passwdModalType: null,
          roleInfo: undefined,
          chatroom: undefined,
        },
      });
    },
    *init({ payload }, { call, put, select }) {  // eslint-disable-line
      // debugger;
      // yield put({ type: 'reset' });
      yield call(stopPlay, { call, put, select });
      yield put({ type: 'reset', payload });
      // debugger;
      yield put({ type: 'getShowInfo', payload });
      yield put({ type: 'getProjectInfo', payload });
      yield put({ type: 'getStatistic', payload });
      yield put({ type: 'getRoleInfo', payload });
      yield put({ type: 'save', payload });
    },
    *getShowInfo({ payload }, { call, put }) {  // eslint-disable-line
      const info = yield call(squareService.getShowInfo, payload.projectName, payload.showId);
      if (undefined !== info.err) {
        notifyRequestError(response.err, '获取商户信息失败');
        // notification.error({});
      }
      if (undefined !== info.data) {
        yield put({ type: 'saveInfo', payload: info.data });
        if (1 === info.data.state) {
          yield put({ type: 'initFormat' });
        }
        // if (2 === info.data.is_public) {
        //   yield put({ type: 'initPasswd' });
        // }
      }
    },
    *initFormat({ payload }, { put }) {
      const supportedFormats = liveFormat.getSupportedFormats();
      yield put({ type: 'setSupportedFormats', payload: supportedFormats });
      const selectedFormat = liveFormat.getSelectedFormat(supportedFormats, '流畅', 'outerLiveFormatValue');
      yield put({ type: 'setSelectedFormat', payload: selectedFormat });
    },
    // *initPasswd({ payload }, { put }) {
    //   const passwd = watchPassword.getWatchPassword();
    //   if (null !== passwd) {
    //     yield put({ type: 'setPasswd', payload: passwd });
    //   }
    //   return passwd;
    // },
    // *showPasswdModal({ payload }, { put }) {
    //   yield put({ type: 'setPasswdModalVisible', payload: true });
    //   return passwd;
    // },
    *hidePasswdModal({ payload }, { put }) {
      yield put({ type: 'setPasswd', payload });
      yield put({ type: 'setPasswdModalVisible', payload: false });
    },
    *getProjectInfo({ payload }, { call, put }) {  // eslint-disable-line
      const projectInfo = yield call(squareService.getShowProjectInfo, payload.projectName);
      if (undefined !== projectInfo.data) {
        yield put({ type: 'saveProjectInfo', payload: projectInfo.data });
      }
    },
    *getRoleInfo({ payload }, { call, put, select, take }) {  // eslint-disable-line
      // debugger;
      const { userInfo } = yield select(state => state.square);
      if (undefined === userInfo) {
        yield take('square/saveUserInfo');
        return yield put({ type: 'getRoleInfo', payload });
      } else if (null === userInfo) {
        return yield put({ type: 'saveRoleInfo', payload: null });
      } else {
        const { projectName } = yield select(state => state.show);
        // debugger;
        const response = yield call(user.getUserRole, { projectName, username: userInfo.username });
        if (response.data) {
          return yield put({ type: 'saveRoleInfo', payload: response.data });
        } else {
          return yield put({ type: 'saveRoleInfo', payload: null });
        }
      }
    },
    *getStatistic({ payload }, { call, put }) {  // eslint-disable-line
      const info = yield call(squareService.getShowStatistic, payload.projectName, payload.showId);
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
    *startPlay({ payload }, { call, put, select, take }) {
      const params = yield call(checkAuth, { call, put, select, take });
      if (!params) {
        return;
      }
      const { projectName, showId, selectedFormat, passwd } = yield select(state => state.show);
      yield put({ type: 'setPlayingState', payload: 'waitingForSession' });
      const { err, data } = yield call(squareService.createShowLiveSession, projectName, showId, selectedFormat.protocol, params.password);
      const { playingState } = yield select(state => state.show);
      if (err) {
        const res = yield call(createSessionFaild, err, passwd, '公开课已暂停', { call, put, select, take });
        if (res) {
          yield put({ type: 'startPlay' });
        }
      }
      if (data) {
        if ('waitingForSession' !== playingState) {
          yield put({ type: 'setSessionId', payload: sessionService.data.session_id });
          yield call(stopSession, { call, put, select });
          return;
        }
        yield put({ type: 'setPlayingState', payload: 'living' });
        yield put({ type: 'setUrl', payload: data.url });
        yield put({ type: 'setSessionId', payload: data.session_id });
        if (params.password) {
          watchPassword.setWatchPassword(params.password);
        }
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
        notifyRequestError(response.err, '公开课已停止');
        yield call(stopPlay, { call, put, select });
      }
    },
    // *startReplayWithPasswd({ payload }, { put }) {
    //   yield put({ type: 'setPasswd', payload });
    //   yield put({ type: 'startReplay', payload });
    // },
    *startReplay({ payload }, { call, put, select, take }) {
      yield call(stopPlay, { call, put, select });
      const params = yield call(checkAuth, { call, put, select, take });
      if (!params) {
        return;
      }
      const { projectName, showId, passwd } = yield select(state => state.show);
      yield put({ type: 'setPlayingState', payload: 'waiting' });
      const { err, data } = yield call(squareService.createShowVodSession, projectName, showId, params.password);
      if (err) {
        const res = yield call(createSessionFaild, err, passwd, '录像异常', { call, put, select, take });
        if (res) {
          yield put({ type: 'startReplay' });
        }
      }
      if (data) {
        yield put({ type: 'setPlayingState', payload: 'replaying' });
        yield put({ type: 'setUrl', payload: data.url });
        if (params.password) {
          watchPassword.setWatchPassword(params.password);
        }
      }
    },
    *getChatroom({ payload }, { call, put, select, take }) {
      // yield call(stopPlay, { call, put, select });
      const params = yield call(checkAuth, { call, put, select, take });
      if (!params) {
        yield put({ type: 'saveChatroom', payload: null });
        return;
      }
      const { projectName, showId, passwd } = yield select(state => state.show);
      yield put({ type: 'saveChatroom', payload: undefined });
      const { err, data } = yield call(squareService.getShowChatroom, projectName, showId, params.password);
      if (err) {
        yield put({ type: 'saveChatroom', payload: null });
        const res = yield call(createSessionFaild, err, passwd, '加载失败', { call, put, select, take });
        if (res) {
          yield put({ type: 'getChatroom' });
        }
      }
      if (data) {
        yield put({ type: 'saveChatroom', payload: data });
        if (params.password) {
          watchPassword.setWatchPassword(params.password);
        }
      }
    },
    // *stopReplay({ payload }, { put }) {
    //   yield put({ type: 'setUrl', payload: null });
    // },
    *resize({ payload }, { put }) {
      yield put({ type: 'setSize', payload });
    },
    // *setWaitingSeconds({ payload }, { put }) {
    //   yield put({ type: 'setSessionCountdown', payload });
    // },
    *setShowCountdown({ payload }, { put }) {
      yield put({ type: 'setCountdown', payload });
    },
  },

  reducers: {
    save(state, action) {
      // debugger;
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
    setSessionId(state, action) {
      return { ...state, sessionId: action.payload };
    },
    // setSessionCountdown(state, action) {
    //   return { ...state, sessionCountdown: action.payload };
    // },
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
    setPasswd(state, action) {
      return { ...state, passwd: action.payload };
    },
    setPasswdModalVisible(state, action) {
      return { ...state, passwdModalVisible: action.payload };
    },
    setPasswdModalType(state, action) {
      return { ...state, passwdModalType: action.payload };
    },
    saveRoleInfo(state, action) {
      return { ...state, roleInfo: action.payload };
    },
    saveChatroom(state, action) {
      return { ...state, chatroom: action.payload };
    },
  },
};
