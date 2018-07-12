
export default {

  namespace: 'cameras',

  state: {
    start: undefined,
    list: undefined,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname }) => {
        const match = pathname.match(/\/project\/([\w-]+)/);
        if (match) {
          dispatch({ type: 'init', payload: match[0] });
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
