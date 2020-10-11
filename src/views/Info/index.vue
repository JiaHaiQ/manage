<template>
  <div>
    <!-- search start-->
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for="">分类：</label>
          <div class="warp-content">
            <el-select
              style="width: 100%;"
              size="small"
              v-model="searchData.categoryId"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="label-wrap date">
          <label for="">日期：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-date-picker
              style="width: 100%;"
              size="small"
              v-model="allData.dateValue"
              type="datetimerange"
              align="right"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
              clearable
            >
            </el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="label-wrap key-word">
          <label for="">关键字：&nbsp;&nbsp;</label>
          <div class="warp-content">
            <el-select
              style="width: 100%;"
              size="small"
              v-model="allData.keyWork.key"
              placeholder="请选择"
              @change="keyWorkChange"
            >
              <el-option
                v-for="item in options.searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-input
          style="width: 100%;"
          size="small"
          v-model="allData.keyWork.value"
          placeholder="请输入内容"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button
          class="searchBtn"
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="submitSearch"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="2">
        <el-button
          class="pull-right searchBtn"
          type="success"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click="allData.dialogAdd = true"
          >添加</el-button
        >
      </el-col>
    </el-row>
    <!-- table start -->
    <div class="black-space-30"></div>
    <el-table
      :data="allData.tableData"
      border
      style="width: 100%"
      height="460"
      v-loading="allData.tableLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, .5)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="title" label="标题" width=""> </el-table-column>
      <el-table-column
        prop="categoryId"
        label="分类"
        width="150"
        :formatter="toCategory"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="日期时间"
        width="200"
        :formatter="toDate"
      >
      </el-table-column>
      <!-- <el-table-column prop="user" label="管理员" width="120"></el-table-column> -->
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editInfo(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :loading="allData.deleteBtnLoading"
            @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="detailed(scope.row)"
            >编辑详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="black-space-30"></div>
    <el-row>
      <el-col :span="12">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          :loading="allData.deleteBtnLoading"
          @click="deleteAll"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="12">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="allData.total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增 -->
    <DialogAdd
      :flag.sync="allData.dialogAdd"
      :category="options.category"
      @getListEmit="getList"
    />
    <!-- 编辑 -->
    <DialogEdit
      :flag.sync="allData.dialogEdit"
      :category="options.category"
      :editRowId="allData.editRowId"
      @getListEmit="getList"
    />
    <!-- end -->
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "@vue/composition-api";
import DialogAdd from "./dialog/add";
import DialogEdit from "./dialog/edit";
import { GetList, DeleteInfo } from "api/info";
// import { common } from "api/common";
import { global } from "utils/global";
import { timestampToTime, filterNullVal } from "utils/commonUtils";
export default {
  name: "infoIndex",
  components: { DialogAdd, DialogEdit },
  setup(props, { root }) {
    // const { getInfoCategory, categoryItem } = common();
    const { confirm } = global(); //MessageBox提示
    /** data */
    const allData = reactive({
      // 日期
      dateValue: "",
      // 关键字
      keyWork: {
        key: "id",
        value: ""
      },
      // 新增
      dialogAdd: false,
      // 编辑
      dialogEdit: false,
      editRowId: "",
      // 表格
      tableData: [],
      tableLoading: true,
      // 分页
      total: 0,
      // 删除
      deleteBtnLoading: false,
      deleteInfoId: []
    });
    // 搜索参数
    const searchData = reactive({
      categoryId: "",
      startTiem: "",
      endTime: "",
      // id: "",
      // title: "",
      pageNumber: 1,
      pageSize: 10
    });
    // select数据
    const options = reactive({
      category: [],
      searchOptions: [
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });
    // watch
    // watch(
    //   () => categoryItem.item,
    //   value => {
    //     options.category = value;
    //   }
    // );
    /** onMounted */
    onMounted(() => {
      // 获取分类
      root.$store.dispatch("common/getInfoCategory").then(res => {
        options.category = res;
      });
      // 获取列表
      getList();
    });
    /** methods */
    /** 搜索 */
    const submitSearch = () => {
      // 日期
      searchData.startTiem = allData.dateValue[0];
      searchData.endTime = allData.dateValue[1];
      // 关键字
      searchData[allData.keyWork.key] = allData.keyWork.value;
      getList();
    };
    /** 获取列表 */
    const getList = () => {
      // 过滤参数中空值数据
      let request = filterNullVal(searchData);
      GetList(request).then(res => {
        allData.tableLoading = false;
        let resData = res.data.data;
        allData.tableData = resData.data;
        allData.total = resData.total;
      });
    };
    /** 页条数 */
    const handleSizeChange = val => {
      searchData.pageSize = val;
      getList();
    };
    /** 翻页 */
    const handleCurrentChange = val => {
      searchData.pageNumber = val;
      getList();
    };
    /** 类型id匹配 */
    const toCategory = row => {
      let categoryData = options.category.filter(
        item => item.id == row.categoryId
      )[0];
      if (!categoryData) {
        return false;
      }
      // console.log(categoryData.category_name);
      return categoryData.category_name;
    };
    /** 时间戳转换 */
    const toDate = row => {
      return timestampToTime(row.createDate);
    };
    /** 编辑 */
    const editInfo = id => {
      allData.editRowId = id;
      allData.dialogEdit = true;
    };
    /**
     * 详情页
     */
    const detailed = data => {
      root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          sessionKey: "infoId",
          session: true
        },
        title: {
          value: data.title,
          sessionKey: "infoTitle",
          session: true
        }
      });
      // 跳转页面
      root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };
    /** 删除单条 */
    const deleteItem = id => {
      allData.deleteInfoId = [id];
      confirm({
        content: "此操作将永久删除该文件, 是否继续?",
        fn: deleteInfo
      });
    };
    /** 批量删除 */
    const deleteAll = () => {
      if (!allData.deleteInfoId || allData.deleteInfoId.length == 0) {
        root.$message.error("请选择需要删除的数据！");
        return false;
      }
      confirm({
        content: "确认删除选择的数据，确认后将无法恢复！",
        tip: "警告",
        fn: deleteInfo
      });
    };
    /** 删除信息 */
    const deleteInfo = () => {
      allData.deleteBtnLoading = true;
      DeleteInfo({ id: allData.deleteInfoId })
        .then(res => {
          allData.deleteBtnLoading = false;
          allData.deleteInfoId = [];
          root.$message.success(res.data.message);
          getList();
        })
        .catch(error => {
          allData.deleteBtnLoading = false;
        });
    };
    /** 多选信息 */
    const handleSelectionChange = val => {
      allData.deleteInfoId = val.map(item => item.id);
    };
    const keyWorkChange = val => {
      if (val !== "id" || val !== "title") {
        allData.keyWork.value = "";
      }
    };
    return {
      //reactive
      options,
      allData,
      searchData,
      //methods
      submitSearch,
      getList,
      handleSizeChange,
      handleCurrentChange,
      toCategory,
      toDate,
      editInfo,
      detailed,
      deleteItem,
      deleteAll,
      handleSelectionChange,
      keyWorkChange
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 32);
  }
  &.date {
    @include labelDom(right, 93, 32);
  }
  &.key-word {
    @include labelDom(right, 99, 32);
  }
}
.searchBtn {
  width: 100%;
  margin-top: -3px;
}
</style>
