<template>
  <div id="header-wrap">
    <div class="pull-left heaber-icon" @click="onMenuState">
      <svg-icon :iconClass="onMenuSvg" :className="onMenuSvg" />
    </div>
    <div class="pull-right">
      <div class="pull-left user-info">
        <img src="../../../assets/image/userInfo.jpg" alt="" />
        {{ userName }}
      </div>
      <div class="pull-left heaber-icon" @click="logoutConfirm">
        <svg-icon iconClass="signOut" className="signOut" />
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from "@vue/composition-api";
import { global } from "utils/global";
export default {
  name: "heaber",
  setup(props, { root }) {
    const { confirm } = global(); //MessageBox提示
    // data
    //computed
    const onMenuSvg = computed(() =>
      root.$store.state.app.isCollapse ? "menu-on" : "menu-off"
    );
    const userName = computed(() => root.$store.state.app.username);
    // methods
    const onMenuState = () => {
      root.$store.commit("app/SET_COLLAPSE");
    };
    /** logout MessageBox */
    const logoutConfirm = () => {
      confirm({
        content: "确认退出？",
        tip: "警告",
        fn: logout
      });
    };
    // 登出
    const logout = () => {
      root.$store.dispatch("app/logout").then(res => {
        if (res.resCode === 0) {
          root.$message.success("退出成功！");
          root.$router.push({
            name: "Login"
          });
        }
      });
    };
    return {
      userName,
      onMenuSvg,
      // methods
      onMenuState,
      logoutConfirm
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  line-height: 75px;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, $menuTransition);
}
.heaber-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border: 1px solid #ededed;
  + .heaber-icon {
    padding: 0 28px;
  }
  img {
    display: inline-block;
    margin-bottom: -16px;
    margin-right: 18px;
  }
}

.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}
</style>
