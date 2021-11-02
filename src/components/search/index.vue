/*
* 下拉搜索
* props:
*   queryParams  Object   绑定父组件的查询条件 
*   hideShowMore Boolean  是否隐藏更多按钮 false:不隐藏,默认显示3个, true: 隐藏,显示全部
*   searchList   Array    绑定表单的数据
*     {
*       prop:             String      queryParams内对应的属性名
*       label:            String      显示的标签文案
*       type:             String      类型: input(default):文本框,select:下拉框, treeSelect: 树形下拉框, subuserSelect: 下级用户选择框, projectSelect: 项目选择下拉框, customerSelect: 客户查询
*       options:          Array       下拉框选项数组
*       optionLabel:      String      下拉框label对应options元素的属性名, type为select有效
*       optionValue:      String      下拉框value对应options元素的属性名, type为select有效
*       api:              Function    下拉框加载的接口方法, type为select有效
*       optionRespKey:    String      下拉框加载返回数据在res中对应的属性名
*     }
*   handleQuery  Event    查询按钮事件, 交由父组件处理
*   resetQuery   Event    重置按钮事件, 交由父组件处理
*/
<template>
  <div class="common-search">
    <!-- 条件筛选 -->
    <el-form ref="commonSearchForm" :inline="true" label-width="124px">
      <!-- 输入框 -->
      <el-form-item
        v-for=" (item, index) in !hideShowMore && !moreConditionShow ? searchList.slice(0,limit) : searchList"
        :key="index"
        :prop="item.prop"
      >
        <el-input
          v-if="item.type ==='input' || !item.type"
          v-model="params[item.prop]"
          :placeholder="item.label"
          clearable
          size="small"
        />
        <el-input
          v-if="item.type ==='numberInput'"
          v-model="params[item.prop]"
          :placeholder="item.label"
          :oninput="value=value.replace(/[^\d.]/g,'')"
          clearable
          size="small"
        />
        <el-select
          v-if="item.type ==='select'"
          v-model="params[item.prop]"
          :placeholder="item.label"
          :clearable="item.clearable != undefined ? item.clearable : true"
          style="width:100%"
          size="small"
        >
          <template v-if="!item.api">
            <el-option
              v-for="(opt,optIndex) in item.options ? item.options : []"
              :label="opt[item.optionLabel ? item.optionLabel : 'label']"
              :value="opt[item.optionValue ? item.optionValue : 'value']"
              :key="optIndex"
            ></el-option>
          </template>
          <template v-else>
            <el-option
              v-for="(opt,optIndex) in selectOptions[item.prop+'Options']"
              :label="opt[item.optionLabel ? item.optionLabel : 'label']"
              :value="opt[item.optionValue ? item.optionValue : 'value']"
              :key="optIndex"
            ></el-option>
          </template>
        </el-select>
        <el-date-picker
        v-if="item.type === 'picker'"
          size="small"
          style="width: 270px; "
          value-format="yyyy-MM-dd"
          v-model="params[item.prop]"
          type="date"
         :placeholder="item.label"
        ></el-date-picker>
        <el-date-picker
        v-if="item.type === 'yearPicker'"
          size="small"
          style="width: 270px; "
          value-format="yyyy"
          v-model="params[item.prop]"
          type="year"
         :placeholder="item.label"
        ></el-date-picker>
        <el-date-picker
          v-if="item.type === 'datePicker'"
          v-model="params[item.prop]"
          size="small"
          style="width: 240px; "
          value-format="yyyy-MM-dd"
          type="daterange"
          :range-separator="params[item.prop] ? '~' : ''"
          :start-placeholder="item.label"
          end-placeholder
        ></el-date-picker>
      </el-form-item>
      <!-- 功能按钮 -->
      <el-form-item size="medium" class="btnFormItem">
        <div class="Btn">
          <span
            v-if="searchList.length>limit && !hideShowMore"
            class="more-condition"
            @click="moreCondition"
          >
            <i :class="!moreConditionShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
            {{!moreConditionShow ? "更多" : "收起" }}
          </span>
          <el-button class="search" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button class="reset" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

export default {
  data() {
    return {
      label: "",
      moreConditionShow: false,
      selectOptions: {}, // 各个下拉选择框的选项
    };
  },
  props: {
    //搜索
    queryParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 是否显示更多 true(默认):显示全部, false: 默认显示3个
    hideShowMore: {
      type: Boolean,
      default: true,
    },
    //搜索条件列表
    searchList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    limit: {
      type: Number,
      default: 3
    }
  },
  created() {
    const that = this;
    for (let item in this.searchList) {
      if (item.api) {
        that.selectOptions[item.prop + "Options"] = [];
      }
    }
  },
  mounted() {
    // 下拉接口
    const that = this;
    this.searchList &&
      this.searchList.forEach((item) => {
        if (item.api) {
          const func = item.api;
          func().then((res) => {
            const data = res[item.optionRespKey];
            that.selectOptions[[item.prop + "Options"]] = data || [];
          });
        }
      });
  },
  computed: {
    params: {
      get() {
        return this.queryParams;
      },
      set(val) {
        this.$emit("update:queryParams", val);
      },
    },
  },
  methods: {
    // 更多条件或隐藏
    moreCondition() {
      this.moreConditionShow = !this.moreConditionShow;
    },
    //搜索
    handleQuery() {
      this.$emit("handleQuery");
    },
    //重置
    resetQuery() {
      // 清楚下级用户选择框对应的数据
      let self = this;
      this.searchList.forEach((item) => {
        if (item.type === "subuserSelect") {
          self.$refs.searchSubuserSelect[0].clearHandle();
        }
      });
      this.$nextTick(() => {
        this.$emit("resetQuery");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.common-search {
  background: #fff;
  padding: {
    top: 15px;
    bottom: 15px;
    left: 15px;
    right: 5px;
  }
  width: 100%;
//   display: inline-block;
}
.common-search .Btn {
//   display: inline-block;
//   vertical-align: middle;
//   float: right;
line-height: 40px;
  min-width: 200px;
  .search {
    width: 78px;
    height: 32px;
    font-size: 14px;
    background: #1790FD;
    color: #fff;
    border-radius: 4px;
    margin-right: 5px;
  }
  .reset {
    width: 78px;
    height: 32px;
    font-size: 14px;
    background: #fff;
    color: #999;
    border-radius: 4px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .more-condition {
    width: 78px;
    height: 32px;
    font-size: 14px;
    border: none;
    color: #1790FD;
    margin-right: 10px;
  }
}
.common-search .el-form-item {
  margin-top: 5px;
  margin-bottom: 5px;
}

.common-search .btnFormItem .el-form-item >>> .el-form-item__content {
  width: 100%;
}
.common-search .el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.common-search >>> .el-date-editor .el-range-input {
  text-align: left;
}
</style>