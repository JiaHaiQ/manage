<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <el-col :span="6" v-if="init.province">
        <el-select v-model="data.provinceValue" @change="handlerProvince" placeholder="请选择省份">
          <el-option
            v-for="item in data.provinceData"
            :key="item.PROVINCE_CODE"
            :value="item.PROVINCE_CODE"
            :label="item.PROVINCE_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="data.cityValue" @change="handlerCity" placeholder="请选择城市">
          <el-option
            v-for="item in data.cityData"
            :key="item.CITY_CODE"
            :value="item.CITY_CODE"
            :label="item.CITY_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="data.areaValue" @change="handlerArea" placeholder="请选择区县">
          <el-option
            v-for="item in data.areaData"
            :key="item.AREA_CODE"
            :value="item.AREA_CODE"
            :label="item.AREA_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="data.streetValue" @change="handlerStreet" placeholder="请选择村镇">
          <el-option
            v-for="item in data.streetData"
            :key="item.STREET_CODE"
            :value="item.STREET_CODE"
            :label="item.STREET_NAME"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { watch, onBeforeMount, reactive } from "@vue/composition-api";
import { cityPickerFunc } from "./cityPickerData";
export default {
  name: "cityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => []
    },
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    // 初始化省市区街联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });
    // 地图逻辑组件方法
    const {
      getProvince,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet,
      data,
      resultData
    } = cityPickerFunc();
    /**
     * 初始化
     */
    const initCieyPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length == 0) {
        for (let key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach(item => {
          init[item] = true;
        });
      }
    };
    watch(
      [
        () => resultData.provinceValue,
        () => resultData.cityValue,
        () => resultData.areaValue,
        () => resultData.streetValue
      ],
      ([province, city, area, street]) => {
        emit("update:cityPickerData", resultData);
      }
    );

    onBeforeMount(() => {
      // 初始化
      initCieyPicker();
      // 获取省份
      getProvince();
    });

    return {
      init,
      data,
      handlerProvince,
      handlerCity,
      handlerArea,
      handlerStreet
    };
  }
};
</script>
<style lang="scss" scoped></style>
<!--
说明：
组件目录位置：src/components/CityPicker/index.vue;
组件引用方式：import CityPicker from "@c/CityPicker";
template：<CityPicker :cityPickerData.sync="data.cityPickerData" />
参数（Object）配置：
//配置
cityPickerData: {
  
}
v-if(需要显示的省份、城市、区县、街道)
cityPickerLevel:{
  province: false,
  city: false,
  area: false,
  street: false
}
返回数据：

-->