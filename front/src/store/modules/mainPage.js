const mainPage = {
  namespaced: true,
  state: {
    showSetModal: { show: false },
    classifyModal: { show: false },
    treeData: [],
    //选中设备
    checkedDevices: [],
    kw: {
      yesterdayKw: undefined,
      prevMonthKw: undefined,
    },
  },

  mutations: {
    setShowSetModal(state, payload) {
      state.showSetModal = { ...payload };
    },
    setClassifyModal(state, payload) {
      state.classifyModal = { ...payload };
    },
    updateTreeData(state, payload) {
      state.treeData = payload;
    },
    updateCheckedDevices(state, payload) {
      state.checkedDevices = payload;
    },
    setStoreKw(state, payload) {
      state.kw = { ...state.kw, ...payload };
    },
  },

  actions: {},
};

export default mainPage;
