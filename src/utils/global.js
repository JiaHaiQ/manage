import { MessageBox } from "element-ui";
import { ref } from "@vue/composition-api";
/** 全局提示删除消息框 */
export function global() {
  const str = ref("");
  const confirm = params => {
    MessageBox.confirm(params.content, params.tip || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: params.type || "warning",
      center: true
    })
      .then(() => {
        str.value = params.id || "";
        params.fn && params.fn(params.id || "");
      })
      .catch(() => {
        params.catchFn && params.catchFn();
      });
  };

  return {
    str,
    confirm
  };
}
