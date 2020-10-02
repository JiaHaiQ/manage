import { Login, Logout } from "api/login";
import {
  setToKen,
  removeToKen,
  setUserName,
  getUserName,
  removeUserName
} from "utils/app";

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  to_ken: "",
  username: getUserName() || ""
};

const getters = {
  isCollapse: state => state.isCollapse
};

const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  SET_TOKEN(state, value) {
    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.username = value;
  },
  SET_ROLES(state, value) {
    state.roles = value;
  }
};
const actions = {
  // 登录
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      Login(data)
        .then(res => {
          let data = res.data.data;
          commit("SET_TOKEN", data.token);
          setToKen(data.token);
          commit("SET_USERNAME", data.username);
          setUserName(data.username);
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 退出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      Logout().then(res => {
        removeToKen();
        removeUserName();
        commit("SET_TOKEN", "");
        commit("SET_USERNAME", "");
        resolve(res.data);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
