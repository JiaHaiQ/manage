<template>
  <div id="category">
    <el-button
      type="success"
      icon="el-icon-circle-plus-outline"
      size="small"
      @click="addFirst"
      >添加一级分类</el-button
    >
    <hr class="dividingLine" />
    <div class="black-space-30"></div>
    <div>
      <el-row :gutter="30">
        <!-- 左边start -->
        <el-col :span="8">
          <div class="category-warp">
            <div
              class="category"
              v-for="firstItem in category.item"
              :key="firstItem.id"
            >
              <!--一级分类-->
              <h4>
                <svg-icon icon-class="plus" />
                {{ firstItem.category_name }}
                <div class="button-group">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    round
                    @click="
                      editCategory({ data: firstItem, type: 'editFirst' })
                    "
                    >编辑</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    icon="el-icon-plus"
                    round
                    @click="
                      addChildren({ data: firstItem, type: 'addChildren' })
                    "
                    >添加子集</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    round
                    @click="deleteCategoryConfirm(firstItem.id)"
                    >删除</el-button
                  >
                </div>
              </h4>
              <!--子级分类-->
              <ul v-if="firstItem.children">
                <li
                  v-for="childrenItem in firstItem.children"
                  :key="childrenItem.id"
                >
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-edit"
                      round
                      @click="
                        editChildrenCategory({
                          data: firstItem,
                          type: 'editChildren'
                        })
                      "
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      icon="el-icon-delete"
                      round
                      @click="deleteCategoryConfirm(childrenItem.id)"
                      >删除</el-button
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <!-- 右边start -->
        <el-col :span="16">
          <h4 class="menu-title">{{ refData.categoryText }}</h4>
          <el-form label-width="142px" class="from-wrap" ref="categoryFrom">
            <el-form-item
              label="一级分类名称："
              v-if="refData.categoryFirstInput"
            >
              <el-input
                v-model="form.categoryName"
                :disabled="refData.categoryFirstDisabled"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="二级分类名称："
              v-if="refData.categoryChildrenInput"
            >
              <el-input
                v-model="form.secCategoryName"
                :disabled="refData.categoryChildrenDisabled"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-circle-check"
                size="small"
                :disabled="refData.submitDisabled"
                :loading="refData.submitLoading"
                @click="submit"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from "@vue/composition-api";
import {
  AddFristCategory,
  AddChildrenCategory,
  GetCategory,
  GetCategoryAll,
  DeleteCategory,
  EditCategory
} from "api/info";
import { global } from "utils/global";
export default {
  name: "infoCategory",
  setup(props, { root, refs }) {
    const { confirm } = global(); //MessageBox提示
    /** data */
    const refData = reactive({
      categoryText: "分类",
      // 分类vif Disabled Loading type
      categoryFirstInput: true,
      categoryChildrenInput: true,
      categoryFirstDisabled: true,
      categoryChildrenDisabled: true,
      submitDisabled: true,
      submitLoading: false,
      submitBtnType: "",
      deleteId: "",
      parentId: ""
    });
    // 添加分类form
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    // 分类data
    const category = reactive({ item: [], current: [] });
    /** onMounted */
    onMounted(() => {
      getInfoCategoryAll();
    });
    /** methods */
    /** 获取全部分类 */
    const getInfoCategoryAll = () => {
      root.$store.dispatch("common/getInfoCategoryAll").then(res => {
        category.item = res;
      });
    };
    // +一级分类按钮
    const addFirst = () => {
      refData.categoryText = "一级分类添加";
      refData.submitBtnType = "addFirst";
      refData.categoryFirstInput = true;
      refData.categoryChildrenInput = false;
      refData.categoryFirstDisabled = false;
      refData.submitDisabled = false;
      form.categoryName = "";
    };
    /** submit按钮 */
    const submit = () => {
      if (refData.submitBtnType === "addFirst") {
        addFristCategory();
      }
      if (refData.submitBtnType === "addChildren") {
        addChildrenCategory();
      }
      if (
        refData.submitBtnType === "editFirst" ||
        refData.submitBtnType === "editChildren"
      ) {
        editFirstCategory(refData.submitBtnType);
      }
    };
    /** 添加一级分类 */
    const addFristCategory = () => {
      if (!form.categoryName) {
        root.$message.error("分类名称不能为空！");
        return false;
      }
      refData.submitLoading = true;
      AddFristCategory({ categoryName: form.categoryName })
        .then(res => {
          let data = res.data;
          root.$message.success(data.message);
          category.item.push(data.data);
          refData.submitLoading = false;
          form.categoryName = "";
        })
        .catch(error => {
          refData.submitLoading = false;
          form.categoryName = "";
        });
    };
    /** 添加子级分类 */
    const addChildren = params => {
      form.categoryName = params.data.category_name;
      refData.parentId = params.data.id;
      refData.submitBtnType = params.type;
      refData.categoryText = "子级分类添加";
      refData.categoryChildrenInput = true;
      refData.categoryFirstDisabled = true;
      refData.categoryChildrenDisabled = false;
      refData.submitDisabled = false;
    };
    const addChildrenCategory = () => {
      if (!form.secCategoryName) {
        root.$message.error("子集分类名称不能为空！");
        return false;
      }
      refData.submitLoading = true;
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: refData.parentId
      };
      AddChildrenCategory(requestData).then(res => {
        refData.submitLoading = false;
        root.$message.success(res.data.message);
        form.secCategoryName = "";
        getInfoCategoryAll();
      });
    };
    /** 提示分类删除弹窗 */
    const deleteCategoryConfirm = id => {
      refData.deleteId = id;
      confirm({
        content: "确认删除选择的分类数据，确认后将无法恢复！",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => {
          refData.deleteId = "";
        }
      });
    };
    /** 删除分类 */
    const deleteCategory = () => {
      DeleteCategory(refData.deleteId).then(res => {
        let data = res.data;
        root.$message.success(data.message);
        getInfoCategoryAll();
        // let index = category.item.findIndex(
        //   item => item.id == refData.deleteId
        // );
        //删除数组元素
        // category.item.splice(index, 1);
      });
    };
    /** 编辑一级分类 */
    const editCategory = psrams => {
      refData.categoryChildrenInput = false;
      refData.categoryFirstDisabled = false;
      refData.submitDisabled = false;
      category.current = psrams.data;
      form.categoryName = psrams.data.category_name;
      refData.submitBtnType = psrams.type;
      refData.categoryText = "一级分类编辑";
    };
    /** 编辑子级分类 */
    const editChildrenCategory = params => {
      form.categoryName = params.data.category_name;
      form.secCategoryName = params.data.children[0].category_name;
      category.current.id = params.data.children[0].id;
      refData.submitBtnType = params.type;
      refData.categoryText = "子级分类编辑";
      refData.categoryChildrenInput = true;
      refData.categoryFirstDisabled = true;
      refData.categoryChildrenDisabled = false;
      refData.submitDisabled = false;
    };
    /** 编辑分类 */
    const editFirstCategory = type => {
      if (!form.categoryName || !form.secCategoryName) {
        root.$message.error("分类名称不能为空！");
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName:
          type === "editFirst" ? form.categoryName : form.secCategoryName
      };
      refData.submitLoading = true;
      EditCategory(requestData)
        .then(res => {
          let resDate = res.data;
          root.$message.success(resDate.message);
          if (type === "editFirst") {
            form.categoryName = "";
            category.current = [];
          }
          refData.submitLoading = false;
          getInfoCategoryAll();
        })
        .catch(error => {
          refData.submitLoading = false;
        });
    };

    return {
      // reactive
      refData,
      form,
      category,
      // methods
      addFirst,
      addChildren,
      submit,
      deleteCategoryConfirm,
      editCategory,
      editChildrenCategory
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/styles/config.scss";
// 分割线
.dividingLine {
  width: calc(100% + 60px);
  margin-left: -30px;
  border: none;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e9e9e9;
}
// 左边
.category-warp {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
    svg {
      position: absolute;
      left: 14px;
      top: 14px;
      background-color: #fff;
      font-size: 17px;
    }
  }
  li {
    position: relative;
    padding-left: 36px;
    margin-left: 24px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 22px;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  li,
  h4 {
    &:hover {
      @include webkit(transition, all 0.5s ease 0s);
      background-color: #f3f3f3;
      .button-group {
        display: block;
      }
    }
  }
}
// 左边子按钮
.button-group {
  display: none;
  position: absolute;
  z-index: 2;
  right: 11px;
  top: -1px;
  button {
    font-size: 12px;
  }
}
// 右边
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.from-wrap {
  width: 410px;
  padding-top: 26px;
}
</style>
