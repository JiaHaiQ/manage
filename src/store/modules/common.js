import { GetCategory, GetCategoryAll } from "api/info";

const actions = {
  /** 获取分类 */
  getInfoCategory(content, repuestData) {
    return new Promise((resolve, reject) => {
      GetCategory({})
        .then(res => {
          resolve(res.data.data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  /** 获取分类（包含子集） */
  getInfoCategoryAll(content, repuestData) {
    return new Promise((resolve, reject) => {
      GetCategoryAll({})
        .then(res => {
          resolve(res.data.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  actions
};
