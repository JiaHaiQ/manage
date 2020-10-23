<template>
  <div>
    <el-table
      :height="data.tableConfig.height"
      v-loading="data.tableConfig.tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, .5)"
      border
      style="width: 100%"
      :data="data.tableData"
      @selection-change="thatSelectCheckbox"
    >
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
    <div class="table-footer">
      <el-row>
        <el-col :span="4">
          <slot name="tableFooterLeft"></slot>
        </el-col>
        <el-col :span="20">
          <el-pagination
            class="pull-right"
            v-if="data.tableConfig.paginationShow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageData.currentPage"
            :page-sizes="pageData.pageSizes"
            :page-size="pageData.pageSize"
            :layout="data.tableConfig.paginationLayout"
            :total="pageData.total"
            background
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { onBeforeMount, reactive, watch } from "@vue/composition-api";
import { loadTableDataFunc } from "./loadTableData";
import { paginationHook } from "./paginationHook";
export default {
  name: "tableComponents",
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    tableRow: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, emit }) {
    //加载表数据
    const { tableData, loadTableData } = loadTableDataFunc({ root });
    // 分页
    const {
      pageData,
      handleSizeChange,
      handleCurrentChange,
      totalCount
    } = paginationHook();
    const data = reactive({
      // table配置
      tableConfig: {
        // Loading
        tableLoading: false,
        // height
        height: 460,
        // 多选
        selection: true,
        // 接口data
        requestData: {},
        // 表头
        tHead: [],
        // 分页
        paginationLayout: "total, sizes, prev, pager, next, jumper",
        paginationShow: true
      },
      // 表数据
      tableData: []
    });
    // 数据监听
    watch(
      [() => tableData.item, () => tableData.total],
      ([tableData, total]) => {
        if (tableData) {
          data.tableConfig.tableLoading = false;
        }
        data.tableData = tableData;
        totalCount(total);
      }
    );
    // 页码监听
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        let requestData = data.tableConfig.requestData;
        if (requestData.data) {
          requestData.data.pageNumber = currentPage;
          requestData.data.pageSize = pageSize;
          loadTableData(data.tableConfig.requestData);
        }
      }
    );
    /** 处理传入数据 */
    const initPropsValue = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };
    // 勾选checkbox时触发
    const thatSelectCheckbox = val => {
      let rowData = {
        idItem: val.map(item => item.id)
      };
      emit("update:tableRow", rowData);
    };
    /** 刷新数据 */
    const refreshData = () => {
      loadTableData(data.tableConfig.requestData);
    };
    /** 带参数刷新数据 */ 
    const paramsLoadData = params => {
      let requestData = Object.assign({}, params, {
        pageNumber: 1,
        pageSize: 10
      });
      data.tableConfig.requestData.data = requestData;
      console.log(data.tableConfig.requestData.data);
      loadTableData(data.tableConfig.requestData);
    };
    onBeforeMount(() => {
      initPropsValue();
      loadTableData(data.tableConfig.requestData);
    });
    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange,
      thatSelectCheckbox,
      refreshData,
      paramsLoadData
    };
  }
};
</script>
<style lang="scss" scoped>
.table-footer {
  padding: 15px 0;
}
</style>
<!--
说明：
组件目录位置：src/components/Table/index.vue;
组件引用方式：import TableVue from "@c/Table";
template：<TableVue :config="data.configTable" />

参数（Object）配置：
//table配置
configTable: {
  // 表loading状态
  tableLoading: true,
  // 表高
  height: 200,
  // 多选
  // selection: false,
  //表头array
  tHead: [
    { label: "表头", rowKey: "显示字段", width: 行宽 }，
    { label: "操作", columnType: "slot", slotName: "operation" }// 插槽
  ],
  // 请求参数
  requestData: {
    url: "getUserList",
    data: {
      pageNumber: 1,
      pageSize: 10
    }
  }
}
返回数据：tableRow(勾选项数据)

-->