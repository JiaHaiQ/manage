<template>
    <div id="header-wrap">
        <div class="pull-left heaber-icon">
            <svg-icon iconClass="menu-off" className="menu-off" />
        </div>
        <div class="pull-right">
            <img class="pull-left userImg" src="../../../image/userInfo.jpg" alt="">
            <div class="pull-left user-info">
                管理员
            </div>
            <div class="pull-left heaber-icon">
                <svg-icon iconClass="signOut" className="signOut" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "heaber",
    setup(props, {root}){

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
    -webkit-box-shadow: 0 3px 16px 0 rgba(0,0,0,.1);
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
}
.userImg {
    width: 52px;
    height: 52px;
    padding: 10px 28px;
}
</style>