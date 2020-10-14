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
              <el-col :span="8"
                ><el-input placeholder="请输入关键字"></el-input
              ></el-col>
              <el-col :span="9"
                ><el-button type="primary" icon="el-icon-search" size="small"
                  >搜索</el-button
                ></el-col
              >
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="4"
        ><el-button
          type="success"
          icon="el-icon-circle-plus-outline"
          size="small"
          >添加用户</el-button
        ></el-col
      >
    </el-row>
    <div class="black-space-30"></div>
    <!-- table组件 -->
    <TableVue :config="data.configTable">
      <template v-slot:status="slotData">
        <el-switch antive-color="#13c66" inactive-color="#ff4949"></el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="deleteItem(slotData.data)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="deleteItem(slotData.data)"
          >删除</el-button
        >
      </template>
    </TableVue>
  </div>
</template>
<script>
import { reactive } from "@vue/composition-api";
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue },
  setup(props, { root }) {
    const data = reactive({
      // 下接菜单的数据
      configOption: {
        init: ["truename", "phone"]
      },
      selectData: {},
      //table配置
      configTable: {
        // 多选
        // selection: false,
        //表头
        tHead: [
          { label: "邮箱", rowKey: "email", width: 200 },
          { label: "姓名", rowKey: "name", width: 120 },
          { label: "号码", rowKey: "phone", width: 150 },
          { label: "地区", rowKey: "address", width: 280 },
          { label: "角色", rowKey: "role" },
          {
            label: "禁启用",
            rowKey: "status",
            width: 80,
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        requestData: {
          url: "getUserList",
          data: {
            pageNumber: 1,
            pageSize: 10
          }
        }
      }
    });
    // methods
    /** 删除 */
    const deleteItem = params => {
      console.log(params);
    };
    return {
      data,
      deleteItem
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
