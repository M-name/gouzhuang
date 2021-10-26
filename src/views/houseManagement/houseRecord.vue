<template>
  <div class="container">
    <div class="choose" style="background: #fff">
      <el-form label-width="100px">
        <el-form-item v-if="houseList.length > 0" label="楼栋:">
          <el-radio-group
            @change="chooseRoom(1)"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.blockNo"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in houseList"
              :label="item.code"
              :key="index"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="unitList.length > 0" label="单元:">
          <el-radio-group
            @change="chooseRoom(2)"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.unitNo"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in unitList"
              :label="item.code"
              :key="index"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="levelList.length > 0" label="楼层:">
          <el-radio-group
            @change="chooseRoom(3)"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.floorNo"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in levelList"
              :label="item.code"
              :key="index"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="roomList.length > 0" label="房间号:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.roomNo"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in roomList"
              :label="item.code"
              :key="index"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="房屋性质:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.buildingProp"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.buildPropEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="监管状态:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.buildingMonitorStatus"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.buildingMonitorStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排查状态:">
          <el-radio-group
            @change="getList"
            text-color="#409EFF"
            fill="#fff"
            v-model="params.buildingCheckStatus"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in dicList.buildingCheckStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation">
      <div class="button">
        <el-row :gutter="10" class="operations-row">
          <el-col :span="1.5">
            <el-button
              @click="addList"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              >添加排查记录</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button class="update" icon="el-icon-folder-checked" size="mini"
              >修改房屋状态</el-button
            >
          </el-col> -->
          <div class="equipment-tongji">
            <div class="menjin">
              <i style="background: #fead3f"></i
              ><span style="color: #fead3f">关注类</span>
            </div>
            <div class="menjin">
              <i style="background: #fe6768"></i
              ><span style="color: #fe6768">严管类</span>
            </div>
            <div class="menjin">
              <i style="background: #5cc372"></i
              ><span style="color: #5cc372">放心类</span>
            </div>
          </div>
        </el-row>
      </div>
    </div>
    <div class="list-box">
      <div
        v-for="(item, index) in tableData"
        :key="index"
        class="list-item"
        @click="goDetail(item)"
      >
        <div style="padding: 20px">
          <div class="item-roomnum">
            <i class="iconfont icon-kongzhitai"></i>
            <span>{{ item.buildingCode }}</span>
            <div
              class="leixing"
              :class="
                item.buildingMonitorStatus == 0
                  ? 'fangxin'
                  : item.buildingMonitorStatus == 1
                  ? 'guanzhu'
                  : item.buildingMonitorStatus == 2
                  ? 'yanguan'
                  : ''
              "
            >
              <i></i><span>{{ item.buildingMonitorStatusStr }}</span>
            </div>
          </div>
          <p class="room-type">
            <span v-if="item.buildingPropStr">{{ item.buildingPropStr }}</span
            ><span v-if="item.buildingArea">{{ item.buildingArea }}㎡</span
            ><span
              >{{ item.roomNum ? item.roomNum + "室" : ""
              }}{{ item.hallNum ? item.hallNum + "厅" : ""
              }}{{ item.kitchenNum ? item.kitchenNum + "厨" : ""
              }}{{ item.washroomNum ? item.washroomNum + "卫" : "" }}</span
            >
          </p>
          <p class="people-num">
            常住人口：{{
              item.permanentPersonNum ? item.permanentPersonNum : 0
            }}&nbsp;流动人口：{{
              item.transientPersonNum ? item.transientPersonNum : 0
            }}
            / 出租房间数：{{ item.rentRoomNum ? item.rentRoomNum : 0 }}
          </p>
          <p v-if="item.buildingCheckStatus == 2" class="time">
            排查时间：{{ item.checkTime }}
          </p>
          <p style="text-align: right" class="nocheck">
            <span class="ischeck">{{ item.buildingCheckStatusStr }}</span>
          </p>
        </div>
      </div>
      <div class="pick"></div>
      <div class="pick"></div>
    </div>
    <div :class="{ hidden: hidden }" class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="title"
      :before-close="cancel"
      :visible.sync="open"
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="房屋编码" prop="buildingCode">
          <el-input
            v-model="form.buildingCode"
            placeholder="请输入房屋编码(例：8-1-5-504)"
          />
        </el-form-item>
        <el-form-item label="房屋性质" prop="buildingProp">
          <el-radio-group v-model="form.buildingProp">
            <el-radio
              v-for="(item, index) in dicList.buildPropEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="监管状态" prop="buildingMonitorStatus">
          <el-radio-group v-model="form.buildingMonitorStatus">
            <el-radio
              v-for="(item, index) in dicList.buildingMonitorStatusEnum"
              :label="item.type"
              :key="index"
              >{{ item.value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="常住人口数量" prop="permanentPersonNum">
          <el-input
            v-model="form.permanentPersonNum"
            placeholder="请输入常住人口数量"
          />
        </el-form-item>
        <el-form-item label="流动人口数量" prop="transientPersonNum">
          <el-input
            v-model="form.transientPersonNum"
            placeholder="请输入流动人口数量"
          />
        </el-form-item>
        <el-form-item label="出租房屋数" prop="rentRoomNum">
          <el-input v-model="form.rentRoomNum" placeholder="请输入出租房屋数" />
        </el-form-item>
        <el-form-item label="排查人员" prop="checkBy">
          <el-select v-model="form.checkBy" placeholder="请选择">
            <el-option-group
              v-for="group in staffList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="排查备注" prop="checkRemark">
          <el-input v-model="form.checkRemark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "userControl",
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        buildingCode: [
          { required: true, message: "房屋编码不能为空", trigger: "change" },
        ],
        buildingProp: [
          { required: true, message: "房屋性质未选择", trigger: "change" },
        ],
        buildingMonitorStatus: [
          { required: true, message: "监管状态未选择", trigger: "change" },
        ],
        permanentPersonNum: [
          {
            required: true,
            message: "常住人口数量不能为空",
            trigger: "change",
          },
          this.$rules.number("请输入整数", "change"),
        ],
        transientPersonNum: [
          {
            required: true,
            message: "流动人口数量不能为空",
            trigger: "change",
          },
          this.$rules.number("请输入整数", "change"),
        ],
        rentRoomNum: [
          { required: true, message: "出租房屋数不能为空", trigger: "change" },
          this.$rules.number("请输入整数", "change"),
        ],
        checkBy: [
          { required: true, message: "排查人员不能为空", trigger: "change" },
        ],
      },
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 表格参数
      tableData: [],
      // 总条数
      total: 0,
      // 工作人员列表
      staffList: [],
      // 表单参数
      form: {},
      hidden: true,
      houseList: [],
      unitList: [],
      levelList: [],
      roomList: [],
      // 字典列表
      dicList: [],
      // 查询房屋级联请求参数
      roomParams: {
        type: 0,
        code: undefined,
      },
      // 查询或请求参数
      params: {
        page: 1,
        pageSize: 20,
        buildingProp: "",
        buildingMonitorStatus: "",
        parkingCode: undefined,
        buildingCheckStatus: "",
        blockNo: "",
        unitNo: "",
        floorNo: "",
        roomNo: "",
      },
    };
  },

  created() {
    this.$request.alarmGetStaff().then((res) => {
      const list = res.data.data;
      let staff = [];
      for (var i = 0; i < Object.keys(list).length; i++) {
        let arr = { label: "", options: [] };
        arr.label = Object.keys(list)[i];
        for (var j = 0; j < list[Object.keys(list)[i]].length; j++) {
          arr.options.push({
            value:
              list[Object.keys(list)[i]][j].realName +
              "," +
              list[Object.keys(list)[i]][j].userCode,
            label: list[Object.keys(list)[i]][j].realName,
          });
        }
        staff.push(arr);
      }
      this.staffList = staff;
    });
    this.getList();
    this.getDict();
    this.getRoom(0);
  },
  methods: {
    // 跳转详情
    goDetail(row) {
      this.$router.push({
        path: "/roomDetail",
        name: "roomDetail",
        params: {
          id: row.id,
          code: row.buildingCode,
        },
      });
    },
    // 新增的提交
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$request.buildCheckCreate(this.form).then((res) => {
            if (res.data.status === 200) {
              this.msgSuccess("添加成功");
              this.open = false;
              this.getList();
              this.$refs.form.resetFields();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    // 新增
    addList() {
      this.reset();
      this.open = true;
      this.title = "添加排查记录";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    // 表单重置
    reset() {
      this.form = {
        buildingCode: "",
        buildingProp: "",
        buildingMonitorStatus: "",
        permanentPersonNum: 0,
        transientPersonNum: 0,
        rentRoomNum: "",
        checkBy: "",
        checkRemark: "",
      };
    },
    // 获取字典值
    getDict() {
      this.$request
        .buildFindEnum({
          blockNo: this.params.blockNo,
          unitNo: this.params.unitNo,
          floorNo: this.params.floorNo,
          roomNo: this.params.roomNo,
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.dicList = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 获取列表
    getList() {
      this.$request.buildCheckList(this.params).then((res) => {
        if (res.data.status == 200) {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.records;
          this.params.page = res.data.data.page;
          if (this.total <= 0) {
            this.hidden = true;
          } else {
            this.hidden = false;
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取楼栋字典
    getRoom(num) {
      // var code;
      if (this.params.floorNo != "") {
        this.roomParams.code =
          this.params.blockNo +
          "," +
          this.params.unitNo +
          "," +
          this.params.floorNo;
      } else if (this.params.unitNo != "") {
        this.roomParams.code = this.params.blockNo + "," + this.params.unitNo;
      } else if (this.params.blockNo != "") {
        this.roomParams.code = this.params.blockNo;
      }

      this.roomParams.type = num;
      this.$request.houseListAll(this.roomParams).then((res) => {
        if (num == 0) {
          this.houseList = res.data.data;
        } else if (num == 1) {
          this.unitList = res.data.data;
        } else if (num == 2) {
          this.levelList = res.data.data;
        } else if (num == 3) {
          this.roomList = res.data.data;
        }
      });
    },
    // 选择楼栋处理方法
    chooseRoom(num) {
      if (num == 1) {
        this.params.unitNo = "";
        this.params.floorNo = "";
        this.params.roomNo = "";
        this.unitList = [];
        this.levelList = [];
        this.roomList = [];
      } else if (num == 2) {
        this.params.floorNo = "";
        this.params.roomNo = "";
        this.levelList = [];
        this.roomList = [];
      } else if (num == 3) {
        this.params.roomNo = "";
        this.roomList = [];
      }
      if(num == 1 && this.params.blockNo == "") {
        this.getRoom(0);
      }else{
        this.getRoom(num);
      }
      
      
      this.getList();
    },
    // 条数的监听
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.getList();
    },
    // 页数的监听
    handleCurrentChange(val) {
      this.params.page = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  .choose {
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/.el-radio-button__inner {
      border: none;
    }
  }
}
.update {
  background: none;
  color: #409eff;
  border: 1px solid #409eff;
}
.operation {
  margin: 20px 0;
}
.equipment-tongji {
  display: flex;
  justify-content: space-around;
  height: 29px;
  line-height: 29px;
  float: right;
  margin-right: 7px;
  .menjin {
    margin-left: 20px;
    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    span {
      margin-left: 8px;
      font-size: 13px;
    }
  }
}
.list-box {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  justify-self: start;
  width: 100%;
  .list-item {
    width: 24%;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
    .item-roomnum {
      i {
        color: #409eff;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        margin-left: 5px;
      }
      .leixing {
        float: right;
        i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        span {
          margin-left: 8px;
          font-size: 13px;
        }
      }
      .guanzhu {
        i {
          background: #fead3f;
        }
        span {
          color: #fead3f;
        }
      }
      .yanguan {
        i {
          background: #fe6768;
        }
        span {
          color: #fe6768;
        }
      }
      .fangxin {
        i {
          background: #5cc372;
        }
        span {
          color: #5cc372;
        }
      }
    }
    p {
      margin-top: 17px;
    }
    .room-type {
      span {
        display: inline-block;
        margin-right: 10px;
        padding: 3px 10px;
        color: #409eff;
        font-size: 12px;
        border-radius: 20px;
        background: #f0f2f6;
      }
    }
    .people-num {
      font-size: 12px;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
    .ischeck {
      padding: 5px 15px;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      border-radius: 20px;
      background: #409eff;
    }
  }
  .list-item:nth-child(n + 5) {
    margin-top: 20px;
  }
}
.pick {
  width: 24%;
  overflow: hidden;
}
.pagination {
  text-align: center;
  margin-top: 34px;
  padding: 32px 16px;
}
.pagination.hidden {
  display: none;
}
/deep/.el-dialog__body {
  padding: 30px 25px 30px 10px;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
</style>