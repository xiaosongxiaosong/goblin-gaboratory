// import queryString from 'query-string';
import projectService from '../../services/project';


export default {
  namespace: 'project-account',
  state: {
    account: undefined,
    storageQuota: undefined,
    quota: undefined,
    onlineSchoolConfig: undefined,
    wechatMerchant: undefined,
    loading: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/^\/projects\/([\w-]+)\/account$/);
        if (match) {
          return dispatch({ type: 'load', payload: { projectName: match[1] } });
        }
      });
    },
  },

  effects: {
    *load({ payload }, { call, put, select }) {
      const { loading } = yield select(state => state['project-account']);
      if (loading) {
        return false;
      }
      yield put({
        type: 'save',
        payload: {
          loading: true,
          account: undefined,
          storageQuota: undefined,
          quota: undefined,
          onlineSchoolConfig: undefined,
          wechatMerchant: undefined,
        },
      });
      const [
        account,
        storageQuota,
        quota,
        onlineSchoolConfig,
        wechatMerchant,
      ] = yield [
        call(projectService.getAccount, payload),
        call(projectService.getStorageQuota, payload),
        call(projectService.getQuota, payload),
        call(projectService.getOnlineSchoolConfig, payload),
        call(projectService.getWechatMerchant, payload),
      ];
      yield put({
        type: 'save',
        payload: {
          loading: false,
          account: account.data || null,
          storageQuota: storageQuota.data || null,
          quota: quota.data || null,
          onlineSchoolConfig: onlineSchoolConfig.data || null,
          wechatMerchant: wechatMerchant.data || null,
        },
      });
    },
    *getProjectInfo({ payload }, { put, select }) {
      const { info } = yield select(state => state.projects);
      if (info && payload.projectName === info.name) {
        return;
      }
      yield put({ type: 'refreshProjectInfo', payload });
    },
    *refreshProjectInfo({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { info: undefined } });
      const { data } = yield call(projectService.getProjectInfo, payload);
      yield put({ type: 'save', payload: { info: data || null } });
    },
    *updateInfo({ payload }, { put, select }) {
      const { info } = yield select(state => state.projects);
      const { projectName, ...newData } = payload;
      if (info && projectName === info.name) {
        yield put({ type: 'save', payload: { info: { ...info, ...newData } } });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
