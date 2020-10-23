<template>
  <el-select v-model="data.selectValue" placeholder="请选择" @change="select"
    ><el-option
      v-for="item in data.initOption"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option
  ></el-select>
</template>
<script>
import { reactive, onBeforeMount } from "@vue/composition-api";
export default {
  name: "Select",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    const data = reactive({
      selectValue: "",
      initOption: [],
      option: [
        { value: "truename", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });
    /**
     * 初始化下拉选择
     */
    const initOption = () => {
      let initData = props.config.init;
      let optionArr = [];
      // 数据检验
      if (JSON.stringify(props.config) == "{}" || initData.length === 0) {
        root.$message.error("config的参数是空的，无法显示下拉菜单！");
        console.log("config的参数是空的，无法显示下拉菜单！");
        return false;
      }
      initData.forEach(item => {
        let arr = data.option.filter(elem => elem.value == item);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });
      // 数据检验
      if (optionArr.length === 0) {
        root.$message.error("匹配的数据为空！");
        console.log("匹配的数据为空！");
        return false;
      }
      // 初始化赋值
      data.initOption = optionArr;
      // 初始化搜索类型
      data.selectValue = optionArr[0].value;
      // 返回初始值
      emit("update:selectData", optionArr[0]);
    };
    /**
     * 选择触发
     */
    const select = val => {
      let filterData = data.option.filter(item => item.value == val)[0];
      emit("update:selectData", filterData);
    };
    onBeforeMount(() => {
      initOption();
    });
    return {
      data,
      select
    };
  }
};
</script>
<style lang="scss" scoped></style>
<!--
说明：
组件目录位置：src/components/UploadImg/index.vue;
组件引用方式：import SelectVue from "@c/Select";;
template：<SelectVue :config="data.configOption" :selectData.sync="data.selectData" />

参数（Object）配置：
configOption: {
    init: ["name", "phone"]
}
init：
    数据类型: Array; 
    可配置的数据："name", "phone", "email", "id", "title"
返回数据：selectData // 字段

-->