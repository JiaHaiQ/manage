<template>
    <div id="header-wrap">
        <div class="pull-left heaber-icon" @click="onMenuState">
            <svg-icon :iconClass="onMenuSvg" :className="onMenuSvg" />
        </div>
        <div class="pull-right">
            
            <div class="pull-left user-info">
                <img src="../../../assets/image/userInfo.jpg" alt="">
                {{ userName }}
            </div>
            <div class="pull-left heaber-icon">
                <svg-icon iconClass="signOut" className="signOut" />
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed } from '@vue/composition-api';
export default {
    name: "heaber",
    setup(props, {root}){
        // data
        const onMenuState = () =>{
            root.$store.commit('SET_COLLAPSE')
        }
        const userName = ref('管理员')
        //computed
        const onMenuSvg = computed( () => root.$store.state.isCollapse ? "menu-on": "menu-off" );
        return {
            onMenuState,
            userName,
            onMenuSvg,
        }
    }
}
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
     @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, .1));
    @include webkit(transition, all .3s ease 0s);
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
    +.heaber-icon {
        padding: 0 28px;
    }
    img {
        display: inline-block;
        margin-bottom: -16px;
        margin-right: 18px;
    }
}

.open {
    #header-wrap { left: $navMenu; }
}
.close {
    #header-wrap { left: $navMenuMin; }
}
</style>