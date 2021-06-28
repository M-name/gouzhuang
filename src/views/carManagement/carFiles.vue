<template>
  <div class="pagebox">
    <aside>
      <el-button
        size="small"
        type="primary"
        @click="dialogOpen(false)"
        icon="el-icon-plus"
        >新增车位区域</el-button
      >
      <ul>
        <li
          style="cursor: pointer"
          :class="
            areaClick.id == item.id && areaClick.choose == true ? 'choose' : ''
          "
          v-for="(item, index) in parkingArea"
          :key="index"
        >
          <span @click="areaChoose(item)">{{ item.zoneName }}</span>
          <div>
            <span class="blue-text" @click="updateParkingArea(item, 1)"
              >修改</span
            >
            <span @click="deleteParkingArea(item)">删除</span>
          </div>
        </li>
      </ul>
    </aside>
    <article>
      <div class="search-box">
        <CommonSearch
          @resetQuery="resetQuery"
          @handleQuery="handleQuery"
          :queryParams.sync="params"
          :searchList="commonSearchList"
        />
        <el-button icon="el-icon-plus" size="small" @click="dialogOpen(true)"
          >新增车位</el-button
        >
      </div>

      <div v-if="areaClick.info.zoneName" class="search-title">
        <div class="span-group">
          <span>已选中</span>
          <span>{{
            areaClick.info.zoneName ? areaClick.info.zoneName : ""
          }}</span>
        </div>
      </div>
      <CommonTable
        :total="total"
        :loading="loading"
        :defColumns="column"
        @pagination="getList"
        :dataList="tableData"
        :options="tableOptions"
        :page.sync="params.page"
        :limit.sync="params.pageSize"
        :operations="tableOperations"
        @selection-change="handleSelectionChange"
      ></CommonTable>
    </article>
    <commonDialog
      ref="dialog"
      :dialogInform="dialogSetting"
      @close="closeDialog"
      @closeArea="closeArea"
    ></commonDialog>
  </div>
</template>

<script>
import CommonTable from "../../components/table/index";
import search from "../../components/search/index";
import commonDialog from "../../components/dialog/Dialog";

export default {
  components: {
    CommonTable,
    search,
    commonDialog,
  },
  name: "carFiles",
  data() {
    return {
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
        parkingStatus: undefined,
        zoneCode: undefined,
      },
      // 公用搜索组件内容
      commonSearchList: [
        { prop: "parkingCode", label: "请输入车位编号" },
        {
          prop: "parkingStatus",
          label: "选择车位状态",
          type: "select",
          options: [],
        },
      ],
      // 车位区域点击判断
      areaClick: {
        id: undefined,
        choose: false,
        info: {},
      },
      //加载状态
      loading: false,
      // 总条数
      total: 0,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: false, //多选框
      },
      //表格操作列内容
      tableOperations: [
        {
          label: "修改",
          icon: "el-icon-edit",
          handler: (row) => this.updateParkingArea(row, 0),
        },
        {
          label: "删除",
          style: { color: "#F56C6C" },
          icon: "el-icon-delete",
          handler: (row) => this.handleDelete(row),
        },
      ],
      //表格列
      column: [
        { prop: "zoneName", label: "车位区域" },
        { prop: "parkingCode", label: "车位编号", widht: "180" },
        { prop: "parkingStatusStr", label: "车位状态", widht: "180" },
        { prop: "remark", label: "车位备注" },
      ],
      // 表格参数
      tableData: [],
      //所需字典列表
      dicList: [],
      //弹窗
      dialogSetting: {},
      //停车位区域
      parkingArea: [],
    };
  },
  mounted() {
    this.$request.parkingFindEnum().then((res) => {
      this.dicList = res.data.data;
      this.commonSearchList.forEach((item) => {
        if (item.type == "select" && item.prop == "parkingStatus") {
          this.dicList.parkingStatusEnum.map((res) => {
            item.options.push({
              label: res.value,
              value: res.type,
            });
          });
        }
      });
    });
    this.getParkingArea();
    this.getList();
  },
  methods: {
    // 停车区选择
    areaChoose(item) {
      this.areaClick.id = item.id;
      this.areaClick.choose = true;
      this.areaClick.info = item;
      this.params.zoneCode = item.zoneCode;
      this.params.page = 1;
      this.getList();
    },
    //获取停车区域
    getParkingArea() {
      this.$request.parkingAreaSelect().then((res) => {
        if (res.data.status === 200) {
          this.parkingArea = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除车位信息
    handleDelete(row) {
      let that = this;
      const id = row.id;
      this.$confirm("是否确认删除该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.parkingDel(id).then(() => {
            if (res.data.status === 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
    //删除车位区域
    deleteParkingArea(item) {
      this.$confirm("此操作将永久删除此车位区域, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$request.parkingAreaDelete(item.id);
          if (res.data.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getParkingArea();
          } else {
            this.$message({
              type: "info",
              message: "删除失败",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      console.log(item);
    },
    //修改车位区域
    updateParkingArea(item, num) {
      if (num == 1) {
        this.$request.getParkingArea(item.id).then((res) => {
          this.$refs.dialog.dialogVisible = true;
          this.dialogSetting = {
            title: "修改车位区域",
            list: [
              {
                lable: "车位区域名称",
                type: "input",
                placeholder: "请输入车位区域名称",
                value: "zoneName",
                data: res.data.data.zoneName ? res.data.data.zoneName : "",
              },
              {
                lable: "车位区域编码",
                type: "input",
                placeholder: "请输入车位区域编码",
                value: "zoneCode",
                data: res.data.data.zoneCode ? res.data.data.zoneCode : "",
              },
              {
                lable: "车位数量",
                type: "input",
                placeholder: "请输入车位数量",
                value: "parkingNum",
                data: res.data.data.parkingNum ? res.data.data.parkingNum : "",
              },
              {
                lable: "区域备注",
                type: "input",
                placeholder: "请输入车辆备注",
                value: "remark",
                data: res.data.data.remark ? res.data.data.remark : "",
              },
            ],
            rules: {
              zoneName: [
                {
                  required: true,
                  message: "车位区域名称不能为空",
                  trigger: "change",
                },
              ],
              zoneCode: [
                {
                  required: true,
                  message: "车位区域编码不能为空",
                  trigger: "change",
                },
              ],
              parkingNum: [
                {
                  required: true,
                  message: "车位数量不能为空",
                  trigger: "change",
                },
              ],
            },
            updateInform: res.data.data,
          };
        });
      } else {
        const child = [];
        const statusChild = [];
        this.dicList.parkingStatusEnum.map((res) => {
          statusChild.push({
            label: res.type,
            value: res.value,
          });
        });
        this.parkingArea.map((item) => {
          child.push({
            label: item.zoneName,
            value: item.zoneCode,
          });
        });
        this.$request.parkingInfoFind(item.id).then((res) => {
          this.$refs.dialog.dialogVisible = true;
          console.log(res);
          this.dialogSetting = {
            title: "修改车位",
            list: [
              {
                lable: "车位区域",
                type: "select",
                placeholde: "请选择车位区域",
                children: child,
                value: "zoneCode",
                data: res.data.data.zoneCode ? res.data.data.zoneCode : "",
              },
              {
                lable: "车位编码",
                type: "input",
                placeholder: "请输入车位编号",
                value: "parkingCode",
                data: res.data.data.parkingCode
                  ? res.data.data.parkingCode
                  : "",
              },
              {
                lable: "车位状态",
                type: "radio",
                children: statusChild,
                value: "parkingStatus",
                data: res.data.data.parkingStatus
                  ? res.data.data.parkingStatus
                  : "",
              },
              {
                lable: "车位备注",
                type: "input",
                placeholder: "请输入车辆备注",
                value: "remark",
                data: res.data.data.remark ? res.data.data.remark : "",
              },
            ],
            rules: {
              zoneCode: [
                {
                  required: true,
                  message: "车位区域未选择",
                  trigger: "change",
                },
              ],
              parkingCode: [
                {
                  required: true,
                  message: "车位编码不能为空",
                  trigger: "change",
                },
              ],
              parkingStatus: [
                {
                  required: true,
                  message: "车位状态未选择",
                  trigger: "change",
                },
              ],
            },
            updateInform: res.data.data,
          };
        });
      }
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.params.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        page: 1,
        pageSize: 20,
        parkingCode: undefined,
        parkingStatus: undefined,
        zoneCode: undefined,
      };
      (this.areaClick = {
        id: undefined,
        choose: false,
        info: {},
      }),
        this.handleQuery();
    },
    //获取车位列表
    getList() {
      this.loading = true;
      this.$request.parkingSelect(this.params).then((res) => {
        if (res.data.status === 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.data.msg);
        }
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      selection.map((item) => {});
    },
    //打开弹窗
    dialogOpen(value) {
      this.$refs.dialog.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.dialog.$refs.forms.resetFields();
        this.$refs.dialog.$refs.forms.form = {};
      });

      if (value) {
        const statusChild = [];
        this.dicList.parkingStatusEnum.map((res) => {
          statusChild.push({
            label: res.type,
            value: res.value,
          });
        });
        const child = [];
        this.parkingArea.map((item) => {
          child.push({
            label: item.zoneName,
            value: item.zoneCode,
          });
        });
        this.dialogSetting = {
          title: "新增车位",
          list: [
            {
              lable: "车位区域",
              type: "select",
              placeholde: "请选择车位区域",
              children: child,
              value: "zoneCode",
            },
            {
              lable: "车位编码",
              type: "input",
              placeholder: "请输入车位编号",
              value: "parkingCode",
            },
            {
              lable: "车位状态",
              type: "radio",
              children: statusChild,
              value: "parkingStatus",
            },
            {
              lable: "车位备注",
              type: "input",
              placeholder: "请输入车辆备注",
              value: "remark",
            },
          ],
          rules: {
            zoneCode: [
              { required: true, message: "车位区域未选择", trigger: "change" },
            ],
            parkingCode: [
              {
                required: true,
                message: "车位编码不能为空",
                trigger: "change",
              },
            ],
            parkingStatus: [
              { required: true, message: "车位状态未选择", trigger: "change" },
            ],
          },
        };
      } else {
        this.dialogSetting = {
          title: "新增车位区域",
          list: [
            {
              lable: "车位区域名称",
              type: "input",
              placeholder: "请输入车位区域名称",
              value: "zoneName",
            },
            {
              lable: "车位区域编码",
              type: "input",
              placeholder: "请输入车位区域编码",
              value: "zoneCode",
            },
            {
              lable: "车位数量",
              type: "input",
              placeholder: "请输入车位数量",
              value: "parkingNum",
            },
            {
              lable: "区域备注",
              type: "input",
              placeholder: "请输入车辆备注",
              value: "remark",
            },
          ],
          rules: {
            zoneName: [
              {
                required: true,
                message: "车位区域名称不能为空",
                trigger: "change",
              },
            ],
            zoneCode: [
              {
                required: true,
                message: "车位区域编码不能为空",
                trigger: "change",
              },
            ],
            parkingNum: [
              {
                required: true,
                message: "车位数量不能为空",
                trigger: "change",
              },
            ],
          },
        };
      }
    },
    //关闭弹窗更新数据
    closeDialog() {
      this.getList();
    },
    //关闭弹窗更新数据
    closeArea() {
      this.getParkingArea();
    },
  },
};
</script>

<style scoped lang="scss" >
.pagebox {
  // height: 100%;
  display: flex;
  justify-content: space-between;
  aside {
    width: 290px;
    // height: 100%;
    background-color: #fff;
    padding: 24px;
    box-sizing: border-box;
    > span {
      opacity: 1;
      font-size: 14px;
      font-family: Microsoft YaHei, Microsoft YaHei-Regular;
      font-weight: 400;
      text-align: left;
      color: #1790fd;
      cursor: pointer;
    }
    ul {
      overflow: auto;
    }
    ul li {
      padding-left: 5px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      > span {
        opacity: 1;
        font-size: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
      }
      .blue-text {
        color: #1790fd;
        margin-right: 10px;
        cursor: pointer;
      }
      .blue-text + span {
        color: #999999;
        cursor: pointer;
      }
    }
  }
  article {
    width: calc(100% - 312px);
    // height: 100%;
    background-color: #fff;
    .search-box {
      display: flex;
      align-items: center;
      /deep/.common-search {
        box-sizing: border-box;
        padding-left: 24px;
      }
      .el-button {
        font-size: 14px;
        background: #1790fd;
        color: #fff;
        border-radius: 4px;
        margin-right: 5px;
        margin-right: 24px;
      }
    }
    .search-title {
      padding: 14px 16px;
      background-color: rgb(239, 246, 252);
      border: 1px solid rgb(169, 210, 248);
      margin: 16px 24px;
    }
    /deep/.common-table {
      box-sizing: border-box;
      margin: 16px 24px;
    }
  }
}
.choose {
  color: #1790fd;
}
</style>