<template>
  <el-dialog
    title="修改"
    width="580px"
    :visible.sync="data.dialogEditFlag"
    @opened="openDialogEdit"
    @close="closeDialogEdit"
  >
    <el-form :model="data.editForm" ref="editForm">
      <el-form-item
        label="类型："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-select v-model="data.editForm.categoryId" placeholder="请选择">
          <el-option
            v-for="item in data.categoryOptions"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="标题："
        :label-width="data.formLabelWidth"
        prop="title"
      >
        <el-input
          v-model="data.editForm.title"
          placeholder="请输入标题"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="概况："
        :label-width="data.formLabelWidth"
        prop="content"
      >
        <el-input
          type="textarea"
          v-model="data.editForm.content"
          placeholder="请输入内容"
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="closeDialogEdit"
        >取 消</el-button
      >
      <el-button
        type="success"
        icon="el-icon-circle-check"
        :loading="data.submitLoading"
        @click="submitEdit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref, watchEffect, watch } from "@vue/composition-api";
import { EdidInfo, GetList } from "api/info";
export default {
  name: "dialogEdit",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    },
    editRowId: {
      type: String,
      default: ""
    }
  },
  setup(props, { root, emit, refs }) {
    // data
    const data = reactive({
      dialogEditFlag: false,
      submitLoading: false,
      formLabelWidth: "70px",
      categoryOptions: [],
      editForm: {
        id: "",
        categoryId: "",
        title: "",
        content: ""
      }
    });
    // watch
    watchEffect(() => (data.dialogEditFlag = props.flag));
    // methods
    /** 打开弹窗 */
    const openDialogEdit = () => {
      data.categoryOptions = props.category;
      getProps();
    };
    /** 关闭弹窗 */
    const closeDialogEdit = () => {
      data.dialogEditFlag = false;
      // 重置form
      refs.editForm.resetFields();
      emit("update:flag", false);
    };
    const getProps = () => {
      data.editForm.id = props.editRowId;
      let request = {
        id: data.editForm.id,
        pageNumber: 1,
        pageSize: 10
      };
      GetList(request).then(res => {
        let resData = res.data.data.data[0];
        data.editForm.categoryId = resData.categoryId;
        data.editForm.title = resData.title;
        data.editForm.content = resData.content;
      });
    };
    /** 提交修改 */
    const submitEdit = () => {
      if (!data.editForm.categoryId) {
        root.$message.error("请选择类型！");
        return false;
      }
      if (!data.editForm.title) {
        root.$message.error("请输入标题！");
        return false;
      }
      if (!data.editForm.content) {
        root.$message.error("请输入内容！");
        return false;
      }
      data.submitLoading = true;
      EdidInfo(data.editForm)
        .then(res => {
          root.$message.success(res.data.message);
          data.submitLoading = false;
          emit("getListEmit");
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    return {
      // reactive
      data,
      // methods
      openDialogEdit,
      closeDialogEdit,
      submitEdit
    };
  }
};
</script>
<style lang="scss" scoped></style>
