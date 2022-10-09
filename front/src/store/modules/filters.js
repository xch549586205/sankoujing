const filters = {
  namespaced: true,
  state: {
    filterParams: {},
  },

  mutations: {
    updateFilters(state, payload) {
      state.filterParams = payload === 'rest' ? {} : { ...state.filterParams, ...payload };
    },
  },

  actions: {},
};

export default filters;
