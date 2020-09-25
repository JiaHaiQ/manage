<template>
    <div id="nav-wrap">
        <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
        <el-menu
            default-active="1-4-1" 
            class="el-menu-vertical-demo" 
            @open="handleOpen" 
            @close="handleClose" 
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
import { reactive, ref } from '@vue/composition-api'
export default {
    name: "navMenu",
    setup(propo, {root}){
        //data
        const isCollapse= ref(false);
        const routes = reactive(root.$router.options.routes)
        //methods
        const handleOpen = (key, keyPath) => {
            console.log(key, keyPath);
        }
        const handleClose = (key, keyPath) => {
            console.log(key, keyPath);
        }
        return {
            isCollapse,
            routes,
            handleOpen,
            handleClose
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
    svg {
        font-size: 20px;
        margin-right: 10px;
    }
}
</style>