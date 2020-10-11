<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    v-loading="allData.formLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, .5)"
  >
    <el-form-item label="信息分类：">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in allData.category"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：">
      <el-input v-model="form.title" clearable></el-input>
    </el-form-item>

    <el-form-item label="缩列图：">
      <el-upload
        class="avatar-uploader"
        action="http://up-z2.qiniup.com"
        :data="allData.uploadKey"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="发布日期：">
      <el-date-picker
        type="date"
        placeholder="请选择日期"
        v-model="form.createDate"
        disabled
      ></el-date-picker>
    </el-form-item>

    <el-form-item label="详情内容：">
      <quillEditor
        v-model="form.content"
        ref="myQuillEditor"
        :options="allData.editorOption"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-circle-check"
        :loading="allData.submitLoading"
        @click="submitEdit"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { ref, reactive, onMounted } from "@vue/composition-api";
import { EdidInfo, GetList } from "api/info";
import { QiniuToKen } from "api/commonApi";
import { timestampToTime, filterNullVal } from "utils/commonUtils";
//富文本
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "detailed",
  components: { quillEditor },
  setup(props, { root }) {
    //data
    const allData = reactive({
      id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
      title:
        root.$route.params.title ||
        root.$store.getters["infoDetailed/infoTitle"],
      category: [],
      editorOption: {},
      formLoading: true,
      submitLoading: false,
      uploadKey: {
        token: "",
        key: ""
      }
    });
    // form data
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: ""
    });
    // methods
    /** 获取id详情 */
    const getInfo = () => {
      let request = {
        id: allData.id,
        pageNumber: 1,
        pageSize: 10
      };
      GetList(request)
        .then(res => {
          allData.formLoading = false;
          let resData = res.data.data.data[0];
          form.categoryId = resData.categoryId;
          form.title = resData.title;
          form.createDate = timestampToTime(resData.createDate);
          form.content = resData.content;
          form.imgUrl = resData.imgUrl;
        })
        .catch(error => {
          allData.formLoading = false;
        });
    };
    /** 提交修改 */
    const submitEdit = () => {
      form.id = allData.id;
      if (!form.title) {
        root.$message.error("请输入标题！");
        return false;
      }
      if (!form.content) {
        root.$message.error("请输入内容！");
        return false;
      }
      allData.submitLoading = true;
      EdidInfo(filterNullVal(form))
        .then(res => {
          root.$message.success(res.data.message);
          allData.submitLoading = false;
        })
        .catch(error => {
          allData.submitLoading = false;
        });
    };
    /** 获取七牛云token */
    const getQiniuToKen = () => {
      let requestData = {
        accesskey: "46xd_kvn0b2YwiZqCOpDc7wODFXtVaYEvYFTa4B_",
        secretkey: "7N7o7yBHkouCmCPQFcI554Ly8S4vtjm0MKIsOuEP",
        buckety: "jiahai"
      };
      QiniuToKen(requestData).then(res => {
        allData.uploadKey.token = res.data.data.token;
      });
    };
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
      form.imgUrl = `${root.$store.getters["common/qiniuUrl"]}${res.key}`;
    };
    // onMounted
    onMounted(() => {
      // 获取分类
      root.$store.dispatch("common/getInfoCategory").then(res => {
        allData.category = res;
      });
      getInfo();
      getQiniuToKen();
    });
    return {
      // reactive
      allData,
      form,
      // methods
      submitEdit,
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
  width: 278px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 278px;
  height: 178px;
  display: block;
}
</style>
