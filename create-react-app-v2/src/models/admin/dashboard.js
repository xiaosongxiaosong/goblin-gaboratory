// import { routerRedux } from 'dva/router';
// import queryString from 'query-string';
import moment from 'moment';
import ivrStatisticService from '../../services/ivrStatistic';
// import eventServer from '../../services/event';
import projectService from '../../services/project';
import userService from '../../services/user';


export default {

  namespace: 'dashboard',

  state: {
    loading: true,
    working: undefined,
    userSessionProjects: undefined,
    eventSizeProjects: undefined,
    vodDurtionProjects: undefined,
    liveDurtionProjects: undefined,
    projectCount: undefined,
    userCount: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if ('/dashboard' === pathname) {
          return dispatch({ type: 'load' });
        }
      });
    },
  },

  effects: {
    *load({ payload }, { put, select, call }) {
      const { loading } = yield select(state => state.loading);
      if (loading) {
        return false;
      }
      yield put({
        type: 'save',
        payload: {
          loading: true,
          working: undefined,
          userSessionProjects: undefined,
          eventSizeProjects: undefined,
          vodDurtionProjects: undefined,
          liveDurtionProjects: undefined,
          projectCount: undefined,
          userCount: undefined,
        },
      });
      const startFrom = moment(new Date().setHours(0, 0, 0, 0) - (24 * 60 * 60 * 1000)).format('YYYY-MM-DDTHH:mm:ss');
      const [
        working,
        userSessionProjects,
        eventSizeProjects,
        vodDurtionProjects,
        liveDurtionProjects,
        projects,
        users,
      ] = yield [
        call(ivrStatisticService.getWorkingStatistic, {}),
        call(ivrStatisticService.getProjectsByUserSession, { start_from: startFrom }),
        call(ivrStatisticService.getProjectsByEventSize, { start_from: startFrom }),
        call(ivrStatisticService.getProjectsByVodDurtion, { start_from: startFrom }),
        call(ivrStatisticService.getProjectsByLiveDurtion, { start_from: startFrom }),
        call(projectService.getProjects, { start: 0, limit: 0 }),
        call(userService.getUsers, { start: 0, limit: 0 }),
      ];
      yield put({
        type: 'save',
        payload: {
          loading: false,
          working: working.data || null,
          userSessionProjects: userSessionProjects.data || [],
          eventSizeProjects: eventSizeProjects.data || [],
          vodDurtionProjects: vodDurtionProjects.data || [],
          liveDurtionProjects: liveDurtionProjects.data || [],
          projectCount: projects.data.total || 0,
          userCount: users.data.total || 0,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
