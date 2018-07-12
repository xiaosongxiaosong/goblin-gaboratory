
export default {

  namespace: 'project',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname }) => {
        if ('/user' === pathname) {
          // TODO jump to default
        }
        const match = pathname.match(/\/user(\/|$)/);
        if (match) {
          dispatch({ type: 'init' });
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *init({ payload }, { call, put }) {  // eslint-disable-line
      // debugger;
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
