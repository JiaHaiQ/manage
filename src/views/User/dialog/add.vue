<template>
  <el-dialog
    title="新增"
    width="760px"
    :visible.sync="data.dialogAddFlag"
    @opened="openDialogAdd"
    @close="closeDialogAdd"
  >
    <el-form :model="data.form" ref="addForm">
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-input placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-input placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <CityPicker />
      </el-form-item>

      <el-form-item
        label="禁启用："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-input></el-input>
      </el-form-item>
      <el-form-item
        label="用户角色："
        :label-width="data.formLabelWidth"
        prop="categoryId"
      >
        <el-input></el-input>
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
// 组件
import CityPicker from "@c/CityPicker";
export default {
  name: "dialogAdd",
  components: { CityPicker },
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
      formLabelWidth: "90px",
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
