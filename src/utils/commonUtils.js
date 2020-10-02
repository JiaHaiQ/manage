/** 时间戳转换日期 */
export function timestampToTime(timestamp) {
    let now = new Date(timestamp * 1000);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
}
/** 过滤参数中空值数据 */
export function filterNullVal(params) {
    let data = Object.keys(params).reduce((result, key) => {
        if (params[key] !== "" && params[key] !== undefined && params[key] !== null) {
            result[key] = params[key];
        }
        return result;
    }, {});
    return data
}
