<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="config.action"
      :data="allData.uploadKey"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="allData.image" :src="allData.image" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import { reactive, watch, onBeforeMount } from "@vue/composition-api";
import { QiniuToKen } from "api/commonApi";
export default {
  name: "uploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    //data
    const allData = reactive({
      image: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });
    /** 文件上传前 */
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isPNG) {
        root.$message.error("上传图片只能是 JPG 或者 PNG 格式!");
      }
      if (!isLt5M) {
        root.$message.error("上传头像图片大小不能超过 5MB!");
      }
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      allData.uploadKey.key = key;
      return (isJPG || isPNG) && isLt5M;
    };
    /** 文件上成功 */
    const handleAvatarSuccess = (res, file) => {
      //   let img = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
      let img = `${process.env.VUE_APP_UPLOADIMG_DATAURL}${res.key}`;
      allData.image = img;
      emit("update:imgUrl", img);
    };
    /** 获取七牛云token */
    const getQiniuToKen = () => {
      const { accesskey, secretkey, buckety } = props.config;
      let requestData = {
        accesskey,
        secretkey,
        buckety
      };
      QiniuToKen(requestData).then(res => {
        allData.uploadKey.token = res.data.data.token;
      });
    };
    // watch
    watch(
      () => props.imgUrl,
      value => {
        allData.image = value;
      }
    );
    // onBeforeMount
    onBeforeMount(() => {
      getQiniuToKen();
    });
    return {
      // reactive
      allData,
      // methods
      beforeAvatarUpload,
      handleAvatarSuccess
    };
  }
};
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 270px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 270px;
  height: 178px;
  display: block;
}
</style>
<!--
说明：
组件目录位置：src/components/Select/index.vue;
组件引用方式：import SelectVue from "@c/Select";
template：<UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />

参数配置：
（Object）：
uploadImgConfig = reactive({
  action: 上传路径,
  accesskey: 七牛云AK,
  secretkey: 七牛云SK,
  buckety: 七牛云BUCKETY(空间名称)
});
返回数据：
imgUrl：图片显示URL
-->