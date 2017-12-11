const state = {
  height: 522,
  // 下载窗口是否打开状态
  downloadDialog: false,
};

const mutations = {
  SET_MAIN_HEIGHT(state, height) {
    state.height = height;
  },
  TOGGLE_DOWNLOAD(state, status) {
    state.downloadDialog = status;
  },
};

const getters = {
  getHeight: state => state.height,
  downloadDialog: state => state.downloadDialog,
};

const actions = {
  resizeWindow({ commit }, height) {
    commit('SET_MAIN_HEIGHT', (height - 100));
  },
  toggleDownload({ commit }, status) {
    commit('TOGGLE_DOWNLOAD', status);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
