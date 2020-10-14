<template>
  <el-table :data="data.tableData" border style="width: 100%">
    <!-- 多选 -->
    <el-table-column
      v-if="data.tableConfig.selection"
      type="selection"
      width="55"
    >
    </el-table-column>
    <template v-for="item in data.tableConfig.tHead">
      <!-- v-slot -->
      <el-table-column
        :key="item.rowKey"
        :prop="item.rowKey"
        :label="item.label"
        :width="item.width"
        v-if="item.columnType === 'slot'"
      >
        <template slot-scope="scope">
          <slot :name="item.slotName" :data="scope.row"></slot>
        </template>
      </el-table-column>
      <!-- 文本渲染 -->
      <el-table-column
        :key="item.rowKey"
        :prop="item.rowKey"
        :label="item.label"
        :width="item.width"
        v-else
      >
      </el-table-column
    ></template>
  </el-table>
</template>
<script>
import { onBeforeMount, reactive } from "@vue/composition-api";
import { requestUrl } from "api/requestUrl";
import { LoadTableData } from "api/commonApi";
export default {
  name: "tableComponents",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    const data = reactive({
      // table配置
      tableConfig: {
        // 多选
        selection: true,
        // 接口data
        requestData: {},
        // 表头
        tHead: []
      },
      // 表数据
      tableData: [
        {
          email: "2016-05-02",
          name: "王虎",
          phone: "12345678910",
          address: "上海市普陀区金沙江路 1518 弄",
          role: "超级管理员"
        },
        {
          email: "201ss2222-02",
          name: "小虎",
          phone: "12345678910",
          address: "上海市普陀区金沙江路 1518 弄",
          role: "超级管理员"
        }
      ]
    });
    /** 接口请求 */
    let loadData = () => {
      let { requestData } = data.tableConfig;
      requestData.url = requestUrl[requestData.url];
      LoadTableData(requestData).then(res => {
        let resData = res.data.data.data;
        if (resData.length > 0) {
          data.tableData = resData;
        }
      });
    };
    /** 处理传入数据 */
    let initPropsValue = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
          loadData();
        }
      }
    };
    onBeforeMount(() => {
      initPropsValue();
    });
    return {
      data
    };
  }
};
</script>
<style lang="scss" scoped></style>
<!--
说明：
组件目录位置：src/components/Table/index.vue;
组件引用方式：import TableVue from "@c/Table";
template：<TableVue :config="data.configTable" />

参数（Object）配置：
//table配置
configTable: {
  // 多选
  // selection: false,
  //表头array
  tHead: [
    { label: "表头", rowKey: "显示字段", width: 行宽 }
  ]
}
返回数据：

-->