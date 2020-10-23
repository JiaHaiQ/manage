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
                ><el-input
                  v-model="data.searchWord"
                  :type="data.searchInputType"
                  placeholder="请输入关键字"
                  clearable
                ></el-input
              ></el-col>
              <el-col :span="9"
                ><el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="search"
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
          @click="data.dialogAdd = true"
          >添加用户</el-button
        ></el-col
      >
    </el-row>
    <div class="black-space-30"></div>
    <!-- table组件 -->
    <TableVue
      ref="userTable"
      :config="data.configTable"
      :tableRow.sync="data.tableRow"
    >
      <!-- 插槽 -->
      <template v-slot:status="slotData">
        <el-switch
          :disabled="slotData.data.id === data.userStatusId"
          @change="handlerSwitch(slotData.data)"
          v-model="slotData.data.status"
          active-value="2"
          inactive-value="1"
          antive-color="#13c66"
          inactive-color="#ff4949"
        ></el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="editItem(slotData.data)"
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
      <template v-slot:tableFooterLeft>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="deleteAll"
          >批量删除</el-button
        >
      </template>
    </TableVue>
    <!-- 新增 -->
    <UserDialog
      :flag.sync="data.dialogAdd"
      :editData="data.editData"
      @updateTableData="updateTableData"
    />
  </div>
</template>
<script>
import { reactive, watch } from "@vue/composition-api";
import { UserDel, UserActives } from "api/user";
import { global } from "utils/global";
import SelectVue from "@c/Select";
import TableVue from "@c/Table";
import UserDialog from "./dialog/userDialog";
export default {
  name: "userIndex",
  components: { SelectVue, TableVue, UserDialog },
  setup(props, { root, refs }) {
    const { confirm } = global(); //MessageBox提示
    const data = reactive({
      // 搜索
      searchWord: "",
      searchInputType: "text",
      // 新增
      dialogAdd: false,
      // 编辑
      dialogEdit: false,
      editData: {},
      // disabled
      userStatusId: "",
      updateUserStatusDisabled: false,
      // 下接菜单的数据
      configOption: {
        init: ["truename", "phone"]
      },
      selectData: {},
      // table选择的数据
      tableRow: {},
      //table配置
      configTable: {
        tableLoading: true,
        // height: 500,
        // 多选
        // selection: false,
        //表头
        tHead: [
          { label: "邮箱", rowKey: "username", width: 200 },
          { label: "姓名", rowKey: "truename", width: 120 },
          { label: "号码", rowKey: "phone", width: 150 },
          { label: "地区", rowKey: "region", width: 280 },
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
    watch(
      () => data.selectData,
      selectKey => {
        data.searchWord = "";
        data.searchInputType = "";
        if (selectKey.value === "phone") {
          data.searchInputType = "number";
        }
      }
    );
    // methods
    /** 搜索 */
    const search = () => {
      if (data.selectData.value === "phone") {
        data.searchWord = Number(data.searchWord);
      }
      let requesttData = {
        [data.selectData.value]: data.searchWord
      };
      refs.userTable.paramsLoadData(requesttData);
    };
    // 删除单条
    const deleteItem = params => {
      data.tableRow.idItem = [params.id];
      confirm({
        content: "确认删除当前用户信息，确认后将无法恢复！",
        tip: "警告",
        fn: deleteUser
      });
    };
    // 批量删除
    const deleteAll = () => {
      let userId = data.tableRow.idItem;
      if (!userId || userId.length === 0) {
        root.$message.error("请勾选需要删除的用户！");
        return false;
      }
      confirm({
        content: "确认删除当前所选用户信息，确认后将无法恢复！",
        tip: "警告",
        fn: deleteUser
      });
    };
    /** 删除用户 */
    const deleteUser = () => {
      UserDel({ id: data.tableRow.idItem }).then(res => {
        root.$message.success(res.data.message);
        updateTableData();
      });
    };
    /** 更新表数据 */
    const updateTableData = () => {
      refs.userTable.refreshData();
    };
    /**
     * 修改用户禁启用状态
     */
    const handlerSwitch = params => {
      data.userStatusId = params.id;
      UserActives({ id: params.id, status: params.status })
        .then(res => {
          root.$message.success(res.data.message);
          data.userStatusId = "";
        })
        .catch(error => {
          data.userStatusId = "";
        });
    };
    /** 编辑 */
    const editItem = params => {
      data.dialogAdd = true;
      // 子组件赋值
      data.editData = Object.assign({}, params);
    };
    return {
      data,
      // methods
      search,
      deleteItem,
      deleteAll,
      deleteUser,
      updateTableData,
      handlerSwitch,
      editItem
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
