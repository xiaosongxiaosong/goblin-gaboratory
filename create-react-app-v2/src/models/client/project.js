// import { delay } from '../../utils';
import userService from '../../services/user';

export default {

  namespace: 'project',

  state: {
    roleInfo: undefined,
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // dispatch({ type: 'init' });
      return history.listen(({ pathname }) => {
        const match = pathname.match(/\/p\/([^/]+)(\/.*)?/);
        if (match) {
          dispatch({ type: 'init', payload: { projectName: match[1] } });
        }
      });
    },
  },

  effects: {
    *reset({ payload }, { call, put }) {  // eslint-disable-line
      yield put({
        type: 'save',
        payload: {
          roleInfo: undefined,
          loading: false,
        },
      });
    },
    *init({ payload }, { call, put, select }) {  // eslint-disable-line
      // debugger;
      const { roleInfo } = yield select(state => state.project);
      if (roleInfo && roleInfo.project_name === payload.projectName) {
        return;
      }
      yield put({ type: 'getRoleInfo', payload });
    },
    *getRoleInfo({ payload }, { call, put, select }) {  // eslint-disable-line
      const { loading } = yield select(state => state.loading);
      if (loading) {
        return;
      }
      yield put({ type: 'save', payload: { roleInfo: undefined, loading: true } });
      const { userInfo } = yield select(state => state.client);
      const { data, errMsg } = yield call(userService.getUserRole, { username: userInfo.username, projectName: payload.projectName });
      yield put({ type: 'save', payload: { loading: false, roleInfo: data || null } });
      if (errMsg && errMsg.response && 404 === errMsg.response.status) {
        yield put({ type: 'client/getUserResource' });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
