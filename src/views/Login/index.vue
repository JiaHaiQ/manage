<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: item.current }"
          v-for="item in menuTab"
          :key="item.id"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!--表单 start-->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium "
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                :type="codeButtonStatus.type"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >
                {{ codeButtonStatus.text }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            class="login-btn block"
            @click="submitForm('loginForm')"
            :disabled="loginButtonStatus"
          >
            {{ model === "login" ? "登录" : "注册" }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref, onMounted } from "@vue/composition-api";
import { GetSms, Register } from "api/login";
import sha1 from "js-sha1";
import {
  stripscript,
  validataEmail,
  validataPass,
  validateVCode
} from "utils/validata";
export default {
  name: "login",
  setup(props, { refs, root }) {
    /** data数据 */
    //验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validataEmail(value)) {
        callback(new Error("用户名格式不正确"));
      } else {
        callback();
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validataPass(value)) {
        callback(new Error("密码为6至20位的数字加字母"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePasswords = (rule, value, callback) => {
      //如果模块值为login时直接通过验证
      if (model.value == "login") {
        callback();
      }
      //过滤后的数据
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    // 模块值
    const model = ref("login");
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    //按钮状态
    const loginButtonStatus = ref(true);
    const codeButtonStatus = reactive({
      status: false,
      type: "success",
      text: "获取验证码"
    });
    //倒计时
    const timer = ref(null);
    //表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    /** methods函数 */
    /** 切换模块 */
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      //高光
      data.current = true;
      //修改模块值
      model.value = data.type;
      resetFormData();
      clearCountDown();
    };
    /** 重置表单 */
    const resetFormData = () => {
      refs.loginForm.resetFields();
    };
    /** 更新按钮状态 */
    const updateButtonStatus = parmas => {
      codeButtonStatus.status = parmas.status;
      codeButtonStatus.type = parmas.type || "success";
      codeButtonStatus.text = parmas.text;
    };
    /** 获取验证码 */
    const getSms = () => {
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }
      if (validataEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入");
        return false;
      }
      updateButtonStatus({
        status: true,
        text: "发送中"
      });
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      GetSms(requestData).then(res => {
        let data = res.data;
        root.$message.success(data.message);
        loginButtonStatus.value = false;
        countDown(60);
      });
    };
    /** 登录 */
    const login = () => {
      loginButtonStatus.value = true;
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code
      };
      root.$store
        .dispatch("app/login", requestData)
        .then(res => {
          loginButtonStatus.value = false;
          root.$message.success(res.data.message);
          root.$router.push({ name: "Console" });
        })
        .catch(error => {
          loginButtonStatus.value = true;
          countDown(15, error);
        });
    };
    /** 注册 */
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        module: "register"
      };
      Register(requestData)
        .then(res => {
          let data = res.data;
          root.$message.success(data.message);
          toggleMenu(menuTab[0]);
          clearCountDown();
        })
        .catch(error => {
          clearCountDown();
        });
    };
    /** 倒计时 */
    const countDown = (number, error) => {
      //判断定时器是否存在存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (error) {
          codeButtonStatus.type = "danger";
          codeButtonStatus.text = `${time}秒后重试`;
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
        if (time == 0) {
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        }
      }, 1000);
    };
    /** 清除倒计时 */
    const clearCountDown = () => {
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //清除倒计时
      clearInterval(timer.value);
    };
    /** 提交表单 */
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          return false;
        }
      });
    };
    onMounted(() => {});
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      rules,
      toggleMenu,
      submitForm,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap {
  width: 330px;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 80px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  label {
    display: block;
    margin-bottom: 1px;
    font-size: 14px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
