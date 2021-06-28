<template>
  <div class="common-table">
    <el-table
      :header-cell-style="{
        background: headerColor,
        height: headerHeight + 'px',
      }"
      v-loading="loading"
      :data="dataList"
      :stripe="options.stripe != undefined ? options.stripe : true"
      :border="options.border"
      :highlight-current-row="options.highlightCurrentRow"
      :span-method="tableSpanMethod"
      :row-class-name="rowClassMethod"
      ref="mutipleTable"
      @row-click="rowClick"
      @select="onSelect"
      @select-all="onSelectAll"
      @selection-change="handleSelectionChange"
      @sort-change="columnSortChangeHandler"
    >
    <!-- 无数据时的提示 -->
    <template slot="empty">
			<img class="image" style="margin-top:20px"  src="@/assets/nodate.png" alt="">
			<div class="nodata">暂无数据</div>
    </template>
      <!-- 选择框 -->
      <el-table-column
        v-if="options.multiSelect"
        type="selection"
        width="55"
        align="center"
      />

      <!--region 数据列-->
      <template v-for="(column, index) in tableHeader">
        <!-- slot 添加自定义配置项 -->
        <slot v-if="column.slot" :name="column.slot"></slot>

        <!-- 默认渲染列 -->
        <el-table-column
          v-else
          :show-overflow-tooltip="tooltipShow"
          :prop="column.prop"
          :key="column.prop"
          :label="column.label"
          :align="column.align ? column.align : 'center'"
          :width="column.width"
          :sortable="column.sortable"
        >
          <template slot-scope="scope">
            <template v-if="!column.render">
              <template v-if="!column.formatter">
                <template v-if="column.type == 'image'">
                  <el-image
                  v-if="scope.row[column.prop]"
                    style="width: 50px; height: 50px"
                    :src="scope.row[column.prop]"
                    :preview-src-list="[scope.row[column.prop]]"
                  >
                  </el-image>
                </template>
                <template v-else>
                  <span>{{ scope.row[column.prop] }}</span>
                </template>
              </template>
              <template v-else>
                <span
                  v-html="
                    column.formatter(scope.row, scope.column, scope.index)
                  "
                ></span>
              </template>
            </template>
            <template v-else>
              <expand-dom
                :column="column"
                :row="scope.row"
                :render="column.render"
                :index="index"
              ></expand-dom>
            </template>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        prop="tableOperations"
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="operations && operations.length > 0"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(opt, optIndex) in operations"
            v-show="opt.isShow == undefined || opt.isShow(scope.row)"
            :size="opt.size ? opt.size : 'mini'"
            :type="opt.type ? opt.type : 'text'"
            :icon="opt.icon ? opt.icon : 'el-icon-edit'"
            @click="opt.handler(scope.row)"
            :style="opt.style"
            :class="opt.class"
            :key="optIndex"
            >{{ opt.label }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableKey && tableKey != 'defaultTableKey'"
        align="center"
        width="40"
        fixed="right"
      >
      <!-- <template slot="header" slot-scope="scope"> -->
        <template slot="header" >
          <el-popover placement="bottom-end" trigger="click">
            <el-checkbox-group
              v-model="showColumns"
              :min="2"
              @change="showColumnChange"
            >
              <el-row v-for="item in defColumns" :key="item.prop">
                <el-checkbox :label="item.prop" :key="item.prop">{{
                  item.label
                }}</el-checkbox>
              </el-row>
            </el-checkbox-group>
            <i class="el-icon-s-tools columns-setting-icon" slot="reference" />
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="paginationChange"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  //组件
  components: {
    Pagination,
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null,
        },
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index,
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
      },
    },
  },
  props: {
    tableKey: {
      type: String,
      default: () => "defaultTableKey",
    },
    loading: {
      // loading状态
      type: Boolean,
      default: false,
    },
    // 表格列超出隐藏
    tooltipShow: {
      // loading状态
      type: Boolean,
      default: false,
    },
    //表格头部背景颜色
    headerColor: {
      // loading状态
      type: String,
      default: "#F4F4F4",
    },
    //表格头部高度
    headerHeight: {
      // loading状态
      type: String,
      default: "48",
    },
    // handleSelectionChange: {
    //    type: Function,
    // },
    dataList: {
      // 表格内容数组
      type: Array,
      default: function() {
			return []
		}
    },
    page: {
      // 分页参数,第几页
      type: Number,
      default: 1,
    },
    limit: {
      // 分页参数,每页条数
      type: Number,
      default: 10,
    },
    total: {
      // 总数
      type: Number,
      default: 0,
    },
    defColumns: {
      // 表格列定义
      type: Array,
      default: [],
    },
    options: {
      // 操作
      type: Object,
      default: {
        border: false, //边框
        stripe: true, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
    },
    operations: {
      type: Array,
      default: () => [],
      required: false,
    },
    orderColumn: {
      type: String,
      default: "",
      required: false,
    },
    rowKey: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      tableHeader: [],
      showColumns: [],
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
    orderBy: {
      get() {
        return this.orderColumn;
      },
      set(val) {
        this.$emit("update:orderColumn", val);
      },
    },
    selectIds: {
      get() {
        return (
          (this.$refs.mutipleTable &&
            this.$refs.mutipleTable.selection.map((item) => {
              return item[this.rowKey];
            })) ||
          []
        );
      },
      set(val) {},
    },
  },
  watch: {
    defColumns: {
      handler: function (val) {
        let self = this;
        let tableHeader = [],
          defColumns = this.defColumns;
        for (var i in defColumns) {
          tableHeader.push(defColumns[i]);
        }
        this.tableHeader = tableHeader;
      },
    },
    showColumns(val) {
      let self = this;
      let tableHeader = [],
        defColumns = this.defColumns;
      for (var i in defColumns) {
        if (val.indexOf(defColumns[i].prop) > -1) {
          tableHeader.push(defColumns[i]);
        }
      }
      this.tableHeader = tableHeader;
    },
  },
  mounted() {
    this.getShowColumns();
  },
  methods: {
    // 列排序事件
    columnSortChangeHandler(change) {
      let param = "";
      if (change.order) {
        let orderDesc = "asc";
        if (change.order == "descending") {
          orderDesc = "desc";
        }
        param = change.prop + " " + orderDesc;
      } else {
        param = "";
      }
      this.orderBy = param;
      this.$emit("update:orderColumn", param);
      this.$emit("update:page", 1);
      this.$nextTick(() => {
        this.paginationChange({ page: 1, limit: this.limit });
      });
    },
    // 表格列显示
    getShowColumns() {
      let isColumnsSet = false; //是否设置判断
      let showColumns = [];
      // 读取缓存的列设置
      if (!!this.tableKey && this.tableKey != "defaultTableKey") {
        let tableSetting = this.$store.getters.tableSetting;
        if (typeof tableSetting == "string") {
          tableSetting = JSON.parse(tableSetting || "{}");
        }
        showColumns =
          (!!tableSetting &&
            !!tableSetting[this.tableKey] &&
            tableSetting[this.tableKey].split(",")) ||
          [];
      }
      const defColumns = this.defColumns;
      if (!!showColumns && showColumns.length > 0) {
        isColumnsSet = true;
      }
      // 未设置,则取全部
      if (!isColumnsSet) {
        for (let i in defColumns) {
          showColumns.push(defColumns[i].prop);
        }
      }
      this.showColumns = showColumns;
    },
    // 选择列显示改变事件
    showColumnChange(val) {
      // 写入缓存
      if (!!this.tableKey && this.tableKey != "defaultTableKey") {
        this.$store.dispatch("saveTableColumns", {
          tableKey: this.tableKey,
          columns: val.join(","),
        });
      }
    },
    // 合并操作和设置列
    tableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.tableKey && this.tableKey != "defaultTableKey") {
        if (column.property == "tableOperations") {
          return [1, 2];
        }
      }
      return [1, 1];
    },
    // 分页事件
    paginationChange(val) {
      if (this.orderColumn) {
        val = {
          ...val,
          orderBy: this.orderColumn,
        };
      }
      this.$emit("pagination", val);
    },
    // 表单选择事件
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    },
    // 勾选checkBox事件
    onSelect(selection, row) {
      this.$emit("onSelect", selection, row);
    },
    // 全选
    onSelectAll(selection) {
      this.$emit("onSelectAll", selection);
    },
    // 清空选择
    clearSelection() {
      this.$refs.mutipleTable.clearSelection();
    },
    // 行选择
    toggleRowSelectionHandle(row, selected) {
      if (row && Array.isArray(row)) {
        row.forEach((r) => {
          this.$refs.mutipleTable.toggleRowSelection(r);
        });
      } else {
        this.$refs.mutipleTable.toggleRowSelection(row);
      }
    },
    // 行点击事件
    rowClick(row, column, event) {
      this.$emit("rowClick", row, column, event);
    },
    // 行样式
    rowClassMethod({ row, rowIndex }) {
      if (this.selectIds.includes(row[this.rowKey])) {
        return "selectRowClass";
      }
      return "";
    },
  },
};
</script>
<style scoped lang="scss">
/* .common-table .headstyle {
  background-color: #ffffff;
} */
/* .el-table__row {
  background-color: #fafafa !important;
}
.el-table__row--striped td {
  background-color: #fff !important;
} */
.common-table {
  text-align: center;
  margin-top: 10px;
}
/** 表格设置按钮 */
.common-table .columns-setting-icon {
  font-size: 16px;
  vertical-align: middle;
}
/** 表格选中行样式 */
.common-table .el-table .selectRowClass > td {
  background-color: #e5f0ff !important;
}
.nodata{
margin-top: -20px;
}
.image{
  width: 90px;
  height: 90px;
}
/deep/.el-button [class*=icon-]+span {
    margin-left: 1px;
}
/* .el-button--text span{
  margin-left: 3px  !important;
} */
</style>