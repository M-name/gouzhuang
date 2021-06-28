<template>
  <div class="content">
    <div class="tabs">
      <el-tabs v-model="orderParam.feeName" @tab-click="getOrderStatis">
        <el-tab-pane label="住宅托管费" name="住宅托管费"> </el-tab-pane>
        <el-tab-pane label="房屋能耗费" name="房屋能耗费"></el-tab-pane>
        <el-tab-pane label="车位管理费" name="车位管理费"></el-tab-pane>
        <el-tab-pane label="车位租赁费" name="车位租赁费"></el-tab-pane>
      </el-tabs>

      <p class="cost">
        <span style="display: block"
          ><i class="el-icon-mobile-phone" style="margin-right: 10px"></i
          >费用说明</span
        >
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span
          >费用类别：{{ orderList.feeName ? orderList.feeName : "无" }}</span
        ><span
          >费用名称：{{
            orderList.feeContent ? orderList.feeContent : "无"
          }}</span
        ><span
          >费用编码：{{ orderList.feeCode ? orderList.feeCode : "无" }}</span
        ><span
          >费用说明：{{ orderList.feeName ? orderList.feeName : "无" }}</span
        ><span
          >收费标准：{{ orderList.feeRate ? orderList.feeRate : "无" }}</span
        >
      </p>

      <div class="cost-form">
        <i class="el-icon-mobile-phone" style="margin-right: 10px"></i
        ><span style="display: inline-block; margin-bottom: 20px"
          >费用计算数据</span
        >
        <el-form label-width="90px">
          <el-row :gutter="30">
            <el-col :span="6"
              ><el-form-item label="收费年度:" prop="orderYear">
                <el-input
                  v-model="form.orderYear"
                  placeholder="请输入"
                /> </el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item
                :label="
                  orderParam.feeName == '车位管理费' ||
                  orderParam.feeName == '车位租赁费'
                    ? '年费用:'
                    : '月单价/m²'
                "
                prop="price"
              >
                <el-input
                  v-model="form.price"
                  placeholder="请输入"
                /> </el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item
                label="收费起始:"
                label-width="110px"
                prop="serviceStartTime"
              >
                <el-date-picker
                  clearable
                  style="width: 200px"
                  v-model="form.serviceStartTime"
                  type="date"
                  :picker-options="startDatePicker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="起始时间"
                ></el-date-picker></el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item
                label="收费截止:"
                label-width="110px"
                prop="serviceEndTime"
              >
                <el-date-picker
                  clearable
                  style="width: 200px"
                  v-model="form.serviceEndTime"
                  type="date"
                  :picker-options="endDatePicker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="截止时间"
                ></el-date-picker></el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <el-checkbox v-model="checked">设置为费用计算默认值</el-checkbox>
      </div>
    </div>
    <div class="cost-content">
      <el-aside>
        <div class="house">
          <p>
            {{
              orderParam.feeName == "车位管理费" ||
              orderParam.feeName == "车位租赁费"
                ? "车位区域"
                : "房屋楼栋"
            }}
          </p>
          <el-radio-group
            v-model="tabPosition"
            @change="changeType"
            style="width: 100%"
            size="mini"
          >
            <el-radio-button class="choose-btn" label="all"
              >全部</el-radio-button
            >
            <el-radio-button class="choose-btn" label="noneCreate"
              >未生成</el-radio-button
            >
            <el-radio-button class="choose-btn" label="created"
              >已生成</el-radio-button
            >
          </el-radio-group>
          <div class="tree">
            <el-tree
              v-if="
                orderParam.feeName == '车位管理费' ||
                orderParam.feeName == '车位租赁费'
              "
              @check="chooseTreeCar"
              :data="parkingList"
              show-checkbox
              node-key="id"
              ref="treesCar"
            >
            </el-tree>
            <el-tree
              v-else
              @check="chooseTree"
              :data="data"
              show-checkbox
              node-key="id"
              ref="treeHouse"
              :props="defaultProps"
            >
            </el-tree>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="search-box">
          <CommonSearch
            @resetQuery="resetQuery"
            @handleQuery="handleQuery"
            :queryParams.sync="params"
            :searchList="
              orderParam.feeName == '车位管理费' ||
              orderParam.feeName == '车位租赁费'
                ? carCommonSearchList
                : commonSearchList
            "
          />
          <div class="btn">
            <el-button
              size="small"
              :disabled="multiple"
              @click="generatedBills(false)"
              type="primary"
              >选中生成账单</el-button
            >
            <el-button size="small" @click="generatedBills(true)" type="primary"
              >一键生成账单</el-button
            >
            <el-button size="small" @click="importBill" type="primary"
              >批量导入账单</el-button
            >
            <el-button size="small" type="success" @click="download"
              >导出账单模板</el-button
            >
            <CommonTable
              v-if="
                orderParam.feeName == '车位管理费' ||
                orderParam.feeName == '车位租赁费'
              "
              :total="total"
              :loading="loading"
              :defColumns="carColumn"
              @pagination="createChoose"
              :dataList="carTableData"
              :page.sync="params.page"
              :limit.sync="params.pageSize"
              :options="tableOptions"
              :operations="tableOperations"
              @selection-change="handleSelectionChange"
            ></CommonTable>
            <CommonTable
              v-else
              :total="total"
              :loading="loading"
              :defColumns="column"
              :page.sync="params.page"
              :limit.sync="params.pageSize"
              @pagination="createChoose"
              :dataList="tableData"
              :options="tableOptions"
              :operations="tableOperations"
              @selection-change="handleSelectionChange"
            ></CommonTable>
          </div>
        </div>
      </el-main>
    </div>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="900px"
      append-to-body
    >
      <el-form
        ref="billForm"
        :model="billForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="收费年度:" prop="orderYear">
          <el-input
            v-model="billForm.orderYear"
            placeholder="请输入"
          /> </el-form-item
        ><el-form-item
          :label="
            orderParam.feeName == '车位管理费' ||
            orderParam.feeName == '车位租赁费'
              ? '年费用:'
              : '月单价/m²'
          "
          prop="price"
        >
          <el-input
            v-model="billForm.price"
            placeholder="请输入"
          /> </el-form-item
        ><el-form-item
          label="收费起始:"
          label-width="110px"
          prop="serviceStartTime"
        >
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="billForm.serviceStartTime"
            type="date"
            :picker-options="startDatePickers"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="起始时间"
          ></el-date-picker></el-form-item
        ><el-form-item
          label="收费截止:"
          label-width="110px"
          prop="serviceEndTime"
        >
          <el-date-picker
            clearable
            style="width: 200px"
            v-model="billForm.serviceEndTime"
            type="date"
            :picker-options="endDatePickers"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="截止时间"
          ></el-date-picker
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :before-close="billsCancel"
      :visible.sync="billsOpen"
      width="500px"
      append-to-body
    >
      <div style="text-align: center">
        <el-upload
          :headers="header"
          drag
          :limit="1"
          :auto-upload="false"
          accept=".xlsx"
          :action="UploadUrl()"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传Excel文件，且不超过 500kb</div>
          </template>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadFile">确 定</el-button>
        <el-button @click="billsCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      header: {
        "Content-Type": "multipart/form-data",
      },
      fileList: [], // excel文件列表
      // 导入账单弹框显示
      billsOpen: false,
      // 车位区域数据
      parkingList: [],
      checked: false,
      //控住结束时间晚于开始时间
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      startDatePickers: this.beginDates(),
      endDatePickers: this.processDates(),
      // 查询或请求参数
      params: {
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        page: 1,
        pageSize: 20,
        orderYear: 2021,
        buildingList: [],
        parkingCode: undefined,
      },
      // 表格参数
      tableData: [],
      carTableData: [],
      //加载状态
      loading: false,
      // 总条数
      total: 0,
      // 表格参数
      tableOptions: {
        stripe: false, // 斑马纹
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        multiSelect: true, //多选框
      },
      //表格操作列内容
      tableOperations: [],
      // 表格列
      column: [
        { prop: "buildingCode", label: "房屋编码", width: "120" },
        { prop: "userName", label: "住户姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "buildingArea", label: "房屋面积(㎡)" },
        { prop: "houseType", label: "户型" },
      ],
      carColumn: [
        { prop: "parkingCode", label: "车位编码", width: "120" },
        { prop: "userName", label: "所有人姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
        { prop: "liveType", label: "所有人类型" },
        { prop: "zoneName", label: "车位区域" },
      ],
      // 搜索配置
      commonSearchList: [
        { prop: "userName", label: "住户姓名" },
        { prop: "buildingCode", label: "房屋编码" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
      ],
      carCommonSearchList: [
        { prop: "userName", label: "所有人姓名" },
        { prop: "parkingCode", label: "车位编码" },
        { prop: "mobile", label: "手机号" },
        { prop: "certificateCode", label: "证件号码" },
      ],
      // 树状下拉参数
      data: [],
      // 树状下拉配置参数
      defaultProps: {
        children: "buildingDictDTOList",
        label: "label",
      },
      // 查询费用所需参数
      orderParam: {
        feeName: "住宅托管费",
      },
      // 费用字典展示
      orderList: {},
      // tabs切换
      tabPosition: "all",
      // 默认费用表单
      form: {
        orderYear: undefined,
        price: undefined,
        serviceEndTime: undefined,
        serviceStartTime: undefined,
      },
      billForm: {
        orderYear: undefined,
        price: undefined,
        serviceEndTime: undefined,
        serviceStartTime: undefined,
        buildingList: undefined,
      },
      // 表单校验
      rules: {
        orderYear: [this.$rules.requiredSelect("年度不能为空", "change")],
        price: [this.$rules.requiredSelect("价格不能为空", "change")],
        serviceStartTime: [
          this.$rules.requiredSelect("起始时间未选择", "change"),
        ],
        serviceEndTime: [
          this.$rules.requiredSelect("截止时间未选择", "change"),
        ],
      },
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表格选中的值
      ids: [],
      billList: [],
      // 弹出层标题
      title: "",
      // 弹出层显示
      open: false,
      // 是否生成全部账单
      isBothbills: false,
    };
  },
  mounted() {
    this.getOrderStatis();
    this.$request.orderGetBuilding().then((res) => {
      if (res.data.status == 200) {
        let list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          list[i].id = i + 1;
          list[i].type = 1;
          list[i].label = i + 1 + "幢";
          for (var j = 0; j < list[i].buildingDictDTOList.length; j++) {
            list[i].buildingDictDTOList[j].id = j + i + 1;
            list[i].buildingDictDTOList[j].label = j + 1 + "单元";
            list[i].buildingDictDTOList[j].parentsId = i + 1;
            list[i].buildingDictDTOList[j].type = 2;
          }
        }
        console.log(list);
        this.data = list;
      } else {
        this.$message.error(res.data.msg);
      }
    });
    this.$request.orderGetParking().then((res) => {
      if (res.data.status == 200) {
        let list = [];
        for (var i = 0; i < res.data.data.length; i++) {
          list.push({
            label: res.data.data[i].zoneName,
            id: i,
            parking: res.data.data[i].zoneName,
          });
        }
        console.log(list);
        this.parkingList = list;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  },
  methods: {
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(
        `只能选择 ${this.limitNum} 个文件，当前共选择了 ${
          files.length + fileList.length
        } 个`
      );
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log(file.raw);
      this.fileList.push(file.raw);
      console.log(this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
      console.log("before upload");
      console.log(file);
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 10) {
        this.$message.warning("文件大小不得超过10M");
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return "";
    },
    uploadFile() {
      if (this.fileList.length === 0) {
        this.$message.warning("请上传文件");
      } else {
        let form = new FormData();
        form.append("excelFile", this.fileList[0]);
        this.$request.orderUploadExcel(form).then((res) => {
          if (res.data.status == 200) {
            this.$message.success("上传成功");
            this.billsOpen = false;
            this.fileList = [];
          } else {
            this.$message.error(res.data.msg);
            this.billsOpen = false;
            this.fileList = [];
          }
        });
      }
    },
    // 导入账单提交按钮
    billsSubmitForm() {},
    // 导入账单取消按钮
    billsCancel() {
      this.billsOpen = false;
      this.fileList = [];
    },
    // 导入账单
    importBill() {
      this.billsOpen = true;
    },
    // 全部、已生成，未生成状态改变
    changeType() {
      this.params.page = 1;
      this.createChoose();
    },
    // 房屋楼栋树状图选择
    chooseTree(val, arr) {
      this.params.buildingList = [];
      console.log(arr.checkedNodes);
      if (arr.checkedNodes.length > 0) {
        arr.checkedNodes.forEach((item) => {
          if (item.type == 2) {
            console.log(item.type);
            this.params.buildingList.push({
              building: item.parentsId,
              unitNo: item.unitNo,
            });
          }
        });
      } else {
        this.params.buildingList = [];
      }
      this.createChoose();
    },
    // 车位区域树状图选择
    chooseTreeCar(val, arr) {
      console.log(arr);
      console.log(arr.checkedNode);
      if (arr.checkedNodes.length > 0) {
        arr.checkedNodes.forEach((item) => {
          this.params.zoneName.push(item.parking);
        });
      } else {
        this.params.zoneName = [];
      }
      this.createChoose();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.billList = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 根据已提交/未提交或者费用不同请求不同的接口
    createChoose() {
      this.loading = true;
      this.params.feeName = this.orderParam.feeName;
      if (this.orderParam.feeName == "车位管理费") {
        if (this.tabPosition == "all") {
          this.loading = true;
          this.$request.orderFindParkingQuery(this.params).then((res) => {
            if (res.data.status == 200) {
              this.carTableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.tabPosition == "created") {
          this.loading = true;
          this.$request
            .orderFindParkingQueryAlready(this.params)
            .then((res) => {
              if (res.data.status == 200) {
                this.carTableData = res.data.data.rows;
                this.total = res.data.data.total;
                this.params.page = res.data.data.page;
                this.loading = false;
              } else {
                this.loading = false;
                this.$message.error(res.data.msg);
              }
            });
        } else if (this.tabPosition == "noneCreate") {
          this.loading = true;
          this.$request.orderFindParkingQueryNot(this.params).then((res) => {
            if (res.data.status == 200) {
              this.carTableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        }
      } else if (this.orderParam.feeName == "车位租赁费") {
        if (this.tabPosition == "all") {
          this.loading = true;
          this.$request.orderRentByQuery(this.params).then((res) => {
            if (res.data.status == 200) {
              this.carTableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.tabPosition == "created") {
          this.loading = true;
          this.$request.orderRentByQueryAlready(this.params).then((res) => {
            if (res.data.status == 200) {
              this.carTableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.tabPosition == "noneCreate") {
          this.loading = true;
          this.$request.orderRentByQueryNot(this.params).then((res) => {
            if (res.data.status == 200) {
              this.carTableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        }
      } else {
        if (this.tabPosition == "all") {
          this.loading = true;
          this.$request.orderFindQuery(this.params).then((res) => {
            if (res.data.status == 200) {
              this.tableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.tabPosition == "created") {
          this.loading = true;
          this.$request.orderFindQueryAlready(this.params).then((res) => {
            if (res.data.status == 200) {
              this.tableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        } else if (this.tabPosition == "noneCreate") {
          this.loading = true;
          this.$request.orderFindQueryNot(this.params).then((res) => {
            if (res.data.status == 200) {
              this.tableData = res.data.data.rows;
              this.total = res.data.data.total;
              this.params.page = res.data.data.page;
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error(res.data.msg);
            }
          });
        }
      }
    },
    // 提交
    submitForm() {
      this.$refs["billForm"].validate((valid) => {
        if (valid) {
          this.billForm.feeCode = this.orderList.feeCode;
          this.billForm.feeName = this.orderList.feeName;
          this.billForm.price = Number(this.billForm.price);
          if (this.orderParam.feeName == "车位管理费") {
            if (this.isBothbills) {
              if (this.params.zoneName) {
                this.billForm.zoneName = this.params.zoneName;
              }
              this.$request.orderSaveAllParkingt(this.billForm).then((res) => {
                if (res.data.status === 200) {
                  this.msgSuccess("生成成功");
                  this.open = false;
                  this.createChoose();
                  this.$refs.billForm.resetFields();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else {
              this.billForm.buildingAndUserDTOList = undefined;
              this.billForm.parkingAndUserDTOList = this.billList;
              this.$request
                .orderSaveBatchParkingt(this.billForm)
                .then((res) => {
                  if (res.data.status === 200) {
                    this.msgSuccess("生成成功");
                    this.open = false;
                    this.createChoose();
                    this.$refs.billForm.resetFields();
                  } else {
                    this.$message.error(res.data.msg);
                  }
                });
            }
          } else if (this.orderParam.feeName == "车位租赁费") {
            if (this.isBothbills) {
              if (this.params.zoneName) {
                this.billForm.zoneName = this.params.zoneName;
              }
              this.$request.orderSaveAllRent(this.billForm).then((res) => {
                if (res.data.status === 200) {
                  this.msgSuccess("生成成功");
                  this.open = false;
                  this.createChoose();
                  this.$refs.billForm.resetFields();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else {
              this.billForm.buildingAndUserDTOList = undefined;
              this.billForm.parkingAndUserDTOList = this.billList;
              this.$request.orderSaveBatchRent(this.billForm).then((res) => {
                if (res.data.status === 200) {
                  this.msgSuccess("生成成功");
                  this.open = false;
                  this.createChoose();
                  this.$refs.billForm.resetFields();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          } else {
            if (this.isBothbills) {
              if (this.params.buildingList.length) {
                this.billForm.buildingList = this.params.buildingList;
              }
              this.$request.orderSaveAllt(this.billForm).then((res) => {
                if (res.data.status === 200) {
                  this.msgSuccess("生成成功");
                  this.open = false;
                  this.createChoose();
                  this.$refs.billForm.resetFields();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else {
              this.billForm.parkingAndUserDTOList = undefined;
              this.billForm.buildingAndUserDTOList = this.billList;
              this.$request.orderSaveBatch(this.billForm).then((res) => {
                if (res.data.status === 200) {
                  this.msgSuccess("生成成功");
                  this.open = false;
                  this.createChoose();
                  this.$refs.billForm.resetFields();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.billForm.resetFields();
    },
    // 表单重置
    reset() {
      this.billForm = {
        orderYear: undefined,
        price: undefined,
        serviceEndTime: undefined,
        serviceStartTime: undefined,
        buildingList: undefined,
      };
    },
    // 获取费用字典
    getOrderStatis() {
      this.params = {
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        orderYear: 2021,
        buildingList: [],
        parkingCode: undefined,
        zoneName: [],
        feeName: undefined,
        page: 1,
        pageSize: 20,
      };
      this.tabPosition = "all";
      this.createChoose();
      this.$request.orderGetFeeDict(this.orderParam).then((res) => {
        if (res.data.status == 200) {
          this.orderList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 生成账单按钮
    generatedBills(type) {
      this.isBothbills = type;
      this.open = true;
      this.title = "费用标准";
      if (this.checked) {
        this.billForm = Object.assign({}, this.form);
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.createChoose();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.params = {
        userName: undefined,
        buildingCode: undefined,
        mobile: undefined,
        certificateCode: undefined,
        orderYear: 2021,
        buildingList: [],
        parkingCode: undefined,
        zoneName: [],
        feeName: undefined,
        page: 1,
        pageSize: 20,
      };
      this.tabPosition = "all";
      if (
        this.orderParam.feeName == "车位管理费" ||
        this.orderParam.feeName == "车位租赁费"
      ) {
        this.$nextTick(() => {
          this.$refs.treesCar.setCheckedKeys([]);
        });
      } else {
        this.$nextTick(() => {
          this.$refs.treeHouse.setCheckedKeys([]);
        });
      }

      this.handleQuery();
    },
    //确定开始时间和结束时间
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.serviceEndTime) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.form.serviceEndTime).getTime() < time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.serviceStartTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.form.serviceStartTime).getTime() > time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    //确定开始时间和结束时间
    beginDates() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.billForm.serviceEndTime) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.billForm.serviceEndTime).getTime() < time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDates() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.billForm.serviceStartTime) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.billForm.serviceStartTime).getTime() >
              time.getTime()
            );
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    // 下载模板
    download() {
      window.location.href = "http://gzjy-iot.weetsoft.com/templateExcel.xlsx";
    },
    // 删除
    handleDelete(row) {
      let that = this;
      this.$confirm("是否确认删除该记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          that.$request.orderDelete(row.id).then(() => {
            if (res.data.status == 200) {
              that.getList();
              that.msgSuccess("删除成功");
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })

        .catch(function () {});
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  height: calc(100% - 228px);
}
.el-header {
  height: none;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
}

.el-aside {
  width: 280px !important;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
}

.el-main {
  background-color: #fff;
  color: #333;
  height: 100%;
  margin-left: 24px;
  padding: 0;
  border-radius: 4px;
}
.tabs {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.tabs-change {
  height: 110px;
  background: #999;
}
/deep/.el-tabs__nav {
  margin-left: 20px;
}
.cost {
  line-height: 40px;
  padding: 0 20px;
  span {
    margin-right: 50px;
    font-size: 14px;
    color: #333333;
  }
}
.cost-form {
  padding: 0 20px;
  margin: 20px 0;
}
// /deep/.el-input {
//   width: 100% !important;
// }
.cost-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  .house {
    p {
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 700;
    }
    .choose-btn {
      width: 33%;
      border: none;
    }
    .tree {
      padding: 24px;
    }
  }
}
.search-box {
  /deep/.common-search {
    box-sizing: border-box;
    padding-left: 24px;
  }
}
.btn {
  padding: 0 24px;
}
/deep/.el-radio-button__inner {
  border: none !important;
}
/deep/.el-radio-button__inner {
  width: 100%;
  border: none;
  background: #e9e9e9;
  color: #333;
  border-radius: 0 !important;
}
/deep/.el-radio-group {
  display: flex;
  justify-content: space-between;
}
.el-divider--horizontal {
  margin: 0;
}
.el-checkbox {
  margin-left: 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
/deep/.el-dialog__body {
  padding: 30px 35px 30px 10px;
}
</style>