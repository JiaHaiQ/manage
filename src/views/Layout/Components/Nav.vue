<template>
    <div id="nav-wrap">
        <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
        <el-menu
            default-active="1-4-1" 
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            background-color="transparent"
            text-color="#fff"
            active-text-color="#fff"
            router
        >
            <template v-for="(item, index) in routes">
                <el-submenu v-if="!item.hidden" :key="index" :index="index+''">
                    <template slot="title">
                        <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
                        <span slot="title">{{item.meta.name}}</span>
                    </template>
                    <el-menu-item 
                        v-for="subItem in item.children" 
                        :key="subItem.id" 
                        :index="subItem.path"
                    >
                        {{subItem.meta.name}}
                    </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
import { computed, reactive, ref } from '@vue/composition-api';
export default {
    name: "navMenu",
    setup(propo, {root}){
        //data
        const routes = reactive(root.$router.options.routes);
        //computed
        const isCollapse = computed( () => root.$store.state.isCollapse )
        //methods
        
        return {
            isCollapse,
            routes,
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.logo {
  text-align: center;
  img { 
    margin: 28px auto 25px;
    width: 92px;
  }
}
#nav-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: $navMenu;
    height: 100vh;
    background-color: #344a5f;
    @include webkit(transition , all .3s ease 0s);
    svg {
        font-size: 20px;
        margin-right: 10px;
    }
}
.open {
  #nav-wrap { width: $navMenu; }
}
.close {
  #nav-wrap { width: $navMenuMin; }
  .logo img { width: 60%; }
}
</style>