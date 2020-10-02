import router from "./index";
import store from "@/store/index";
import { getToKen, removeToKen, removeUserName } from "utils/app";

const whiteRouter = ["/login"];

router.beforeEach((to, from, next) => {
  if (getToKen()) {
    if (to.path === "/login") {
      removeToKen();
      removeUserName();
      store.commit("app/SET_TOKEN", "");
      store.commit("app/SET_USERNAME", "");
      next();
    } else {
      next();
    }
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
    }
  }
});
