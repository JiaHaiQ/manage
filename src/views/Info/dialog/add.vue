<template>
  <el-dialog
    title="新增"
    width="580px"
    :visible.sync="data.dialogAddFlag"
    @opened="openDialogAdd"
    @close="closeDialogAdd"
  >
    <el-form :model="data.form" ref="addForm">
      <el-form-item
        label="类型："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-select v-model="data.form.categoryId" placeholder="请选择">
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
          v-model="data.form.title"
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
          v-model="data.form.content"
          placeholder="请输入内容"
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="danger"
        icon="el-icon-circle-close"
        @click="closeDialogAdd"
        >取 消</el-button
      >
      <el-button
        type="success"
        icon="el-icon-circle-check"
        :loading="data.submitLoading"
        @click="submitAdd"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref, watchEffect } from "@vue/composition-api";
import { AddInfo } from "api/info";
export default {
  name: "dialogAdd",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { root, emit, refs }) {
    // data
    const data = reactive({
      dialogAddFlag: false,
      submitLoading: false,
      formLabelWidth: "70px",
      categoryOptions: [],
      form: {
        categoryId: "",
        title: "",
        content: ""
      }
    });
    // watch
    watchEffect(() => (data.dialogAddFlag = props.flag));
    // methods
    /** 打开弹窗 */
    const openDialogAdd = () => {
      data.categoryOptions = props.category;
    };
    /** 关闭弹窗 */
    const closeDialogAdd = () => {
      data.dialogAddFlag = false;
      // 重置form
      refs.addForm.resetFields();
      emit("update:flag", false);
    };
    /** 提交添加 */
    const submitAdd = () => {
      if (!data.form.categoryId) {
        root.$message.error("请选择类型！");
        return false;
      }
      if (!data.form.title) {
        root.$message.error("请输入标题！");
        return false;
      }
      if (!data.form.content) {
        root.$message.error("请输入内容！");
        return false;
      }
      data.submitLoading = true;
      AddInfo(data.form)
        .then(res => {
          root.$message.success(res.data.message);
          data.submitLoading = false;
          emit("getListEmit");
          closeDialogAdd();
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    return {
      // reactive
      data,
      // methods
      openDialogAdd,
      closeDialogAdd,
      submitAdd
    };
  }
};
</script>
<style lang="scss" scoped></style>
