<template>
  <el-dialog
    :title="data.dialogTitle"
    width="760px"
    :visible.sync="data.dialogAddFlag"
    @opened="openDialogAdd"
    @close="closeDialog"
  >
    <el-form :model="data.form" :rules="data.rules" ref="addForm">
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="username"
      >
        <el-input
          v-model="data.form.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="密码："
        :label-width="data.formLabelWidth"
        prop="password"
      >
        <el-input
          type="password"
          v-model="data.form.password"
          placeholder="请输入6~20数字+字母"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="truename"
      >
        <el-input
          v-model="data.form.truename"
          placeholder="请输入姓名"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="phone"
      >
        <el-input
          v-model.number="data.form.phone"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="region"
      >
        <CityPicker :cityPickerData.sync="data.cityPickerData" />
      </el-form-item>

      <el-form-item
        label="禁启用："
        :label-width="data.formLabelWidth"
        prop="status"
      >
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>

      <el-form-item
        label="角色："
        :label-width="data.formLabelWidth"
        prop="role"
      >
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox
            v-for="item in data.roleItem"
            :key="item.role"
            :label="item.role"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" icon="el-icon-circle-close" @click="closeDialog"
        >取 消</el-button
      >
      <el-button
        type="success"
        icon="el-icon-circle-check"
        :loading="data.submitLoading"
        @click="submit('addForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref, watchEffect } from "@vue/composition-api";
import { GetRole, UserAdd, UserEdit } from "api/user";
import { stripscript, validateEmail, validatePass } from "utils/validate";
import sha1 from "js-sha1";
// 地图组件
import CityPicker from "@c/CityPicker";
export default {
  name: "dialogAdd",
  components: { CityPicker },
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit, refs }) {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 编辑状态不需要校验
      if (data.form.id && !value) {
        callback();
      }
      if ((data.form.id && value) || !data.form.id) {
        if (value) {
          data.form.password = stripscript(value);
          value = data.form.password;
        }
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (validatePass(value)) {
          callback(new Error("密码为6至20位数字+字母"));
        } else {
          callback();
        }
      }
    };
    // data
    const data = reactive({
      dialogAddFlag: false,
      submitLoading: false,
      dialogTitle: "",
      formLabelWidth: "90px",
      cityPickerData: {},
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        status: "1",
        role: [],
        btnPerm: ""
      },
      // 规则
      rules: reactive({
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }]
      }),
      // 角色
      roleItem: []
    });
    // watch
    watchEffect(() => (data.dialogAddFlag = props.flag));
    // methods
    /** 打开弹窗 */
    const openDialogAdd = () => {
      getRole();
      // 初始值处理
      let editData = props.editData;
      if (editData.id) {
        // 编辑
        data.dialogTitle = "编辑";
        editData.role = editData.role ? editData.role.split(",") : []; // 数组
        // 循环JSON对象
        for (let key in editData) {
          data.form[key] = editData[key];
        }
      } else {
        // 添加
        data.dialogTitle = "新增";
        data.form.id && delete data.form.id;
      }
    };
    /** 关闭弹窗 */
    const closeDialog = () => {
      data.dialogAddFlag = false;
      props.editData.id = "";
      resetForm();
      emit("update:flag", false);
    };
    /** 重置form */
    const resetForm = () => {
      data.cityPickerData = {};
      refs.addForm.resetFields();
    };
    /** 请求角色 */
    const getRole = () => {
      if (data.roleItem.length === 0) {
        GetRole().then(res => {
          data.roleItem = res.data.data;
        });
      }
      // if (data.btnPerm.length === 0) {
      //   GetPermButton().then(res => {
      //     data.btnPerm = res.data.data;
      //   });
      // }
    };
    /** 添加 */
    const userAdd = requestData => {
      UserAdd(requestData)
        .then(res => {
          requestSuccess(res);
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    /** 编辑 */
    const userEdit = requestData => {
      UserEdit(requestData)
        .then(res => {
          requestSuccess(res);
        })
        .catch(error => {
          data.submitLoading = false;
        });
    };
    /** 添加 || 编辑成功时执行 */
    const requestSuccess = res => {
      data.submitLoading = false;
      root.$message.success(res.data.message);
      emit("updateTableData");
      closeDialog();
    };
    /** 提交 */
    const submit = formName => {
      refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          let requestData = Object.assign({}, data.form);
          requestData.role = requestData.role.join();
          requestData.region = JSON.stringify(data.cityPickerData);
          requestData.password = sha1(requestData.password);
          data.submitLoading = true;
          if (requestData.id) {
            // 编辑
            if (requestData.password) {
              requestData.password = sha1(requestData.password);
            } else {
              delete requestData.password;
            }
            userEdit(requestData);
          } else {
            // 添加
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }
        } else {
          return false;
        }
      });
    };
    return {
      // reactive
      data,
      // methods
      openDialogAdd,
      closeDialog,
      submit
    };
  }
};
</script>
<style lang="scss" scoped></style>
