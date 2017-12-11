const state = {
  height: 522,
  header: {
    start: false,
    remove: false,
    pause: false,
  },
};

const mutations = {
  SET_MAIN_HEIGHT(state, height) {
    state.height = height;
  },
  SET_HEADER_STATUS(state, header) {
    state.header = header;
  },
};

const getters = {
  getHeight: state => state.height,
  header: state => state.header,
};

const actions = {
  resizeWindow({ commit }, height) {
    commit('SET_MAIN_HEIGHT', (height - 100));
  },
  updateHeader({ commit }, header) {
    commit('SET_HEADER_STATUS', header);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
