<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label>关键字：</label>
          <div class="warp-content">
            <el-row :gutter="16">
              <el-col :span="3"
                ><SelectVue
                  :config="data.configOption"
                  :selectData.sync="data.selectData"
              /></el-col>
              <el-col :span="4"><el-input placeholder="请输入关键字"></el-input></el-col>
              <el-col :span="16"
                ><el-button type="primary" icon="el-icon-search"
                  >搜索</el-button
                ></el-col
              >
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="4"
        ><el-button type="success" icon="el-icon-circle-plus-outline"
          >添加用户</el-button
        ></el-col
      >
    </el-row>
  </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
import SelectVue from "@c/Select";
export default {
  name: "userIndex",
  components: { SelectVue },
  setup(props, { root }) {
    const data = reactive({
      // 下接菜单的数据
      configOption: {
        init: ["truename", "phone"]
      },
      selectData: {}
    });
    return {
      data
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.label-wrap {
  @include labelDom(right, 60, 40);
}
</style>
