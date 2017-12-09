const state = {
  height: 522,
};

const mutations = {
  SET_MAIN_HEIGHT(state, height) {
    state.height = height;
  },
};

const getters = {
  getHeight: state => state.height,
};

const actions = {
  resizeWindow({ commit }, height) {
    commit('SET_MAIN_HEIGHT', (height - 100));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
