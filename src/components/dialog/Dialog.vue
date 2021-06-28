<template>
  <el-dialog
    :title="dialogInform.title"
    :visible.sync="dialogVisible"
    :before-close="dialogCloses"
    width="800px"
  >
    <el-form ref="forms" :model="form" label-width="120px" :rules="dialogInform.rules">
      <el-form-item
        class="item"
        v-for="(item, index) in dialogInform.list"
        :key="index"
        :label="item.lable"
        :prop="item.value"
      >
        <el-input
          v-if="item.type == 'input'"
          :placeholder="item.placeholder"
          v-model="form[item.value]"
        ></el-input>
        <el-select v-if="item.type == 'select'"  v-model="form[item.value]">
          <el-option
            v-for="child in item.children"
            :key="child.label"
            :label="child.label"
            :value="child.value"
          >
          </el-option>
        </el-select>
        <div style="width: 480px" v-if="item.type == 'radio'">
          <el-radio v-model="form[item.value]" v-for="(child, index) in item.children" :key="index" :label="child.label">{{
            child.value
          }}</el-radio>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogCloses">取 消</el-button>
      <el-button size="small" type="primary" @click="commit">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "carFiles",
  props: {
    // dialogShow: {
    //   type: Boolean,
    //   default: false,
    // },
    dialogInform: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      userInform: JSON.parse(localStorage.getItem("userInfo")),
    };
  },

  methods: {
    // 取消
     dialogCloses() {
      this.dialogVisible = false;
    },

    // 提交后通知父组件并关闭弹框
    dialogClose() {
      this.dialogVisible = false;
      this.$emit("close", false);
    },
    // 提交后通知父组件并关闭弹框
    areaClose() {
      this.dialogVisible = false;
      this.$emit("closeArea", false);
    },
    commit() {
       let that = this;
       this.$refs["forms"].validate((valid) => {
         if(valid){
           if (this.dialogInform.title == "新增车位区域") {
        this.$request
          .parkingAreaAdd(Object.assign(this.form))
          .then((res) => {
            if (res.data.status == 200) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              that.areaClose();
            } else {
              this.$message.error("提交失败");
            }
          })
          .catch((err) => {
            this.$message.error("提交失败");
          });
      }
      if (this.dialogInform.title == "修改车位区域") {
        this.$request
          .parkingAreaUpdate(
            Object.assign(this.dialogInform.updateInform, this.form)
          )
          .then((res) => {
            if (res.data.status == 200) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              that.areaClose();
            } else {
              this.$message.error("提交失败");
            }
          })
          .catch((err) => {
            this.$message.error("提交失败");
          });
      }
       if (this.dialogInform.title == "新增车位") {
        this.$request
          . parkingAdd(
            this.form
          )
          .then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              that.dialogClose();
            } else {
              this.$message.error("提交失败");
            }
          })
          .catch((err) => {
            this.$message.error("提交失败");
          });
      }
       if (this.dialogInform.title == "修改车位") {
        this.$request
          . parkingInfoUpdate(
           Object.assign(this.dialogInform.updateInform, this.form)
          )
          .then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              that.dialogClose();
            } else {
              this.$message.error("修改失败");
            }
          })
          .catch((err) => {
            this.$message.error("修改失败");
          });
      }
         }
       });
     
    },
  },
  watch: {
    dialogShow: function () {
      this.dialogVisible = this.dialogShow;
    },
    dialogInform: function () {
      let that = this;
      this.form = this.dialogInform.list.reduce((result, item) => {
        if (!!item.data) {
          result[item.value] = item.data;
        } else {
          result[item.value] = "";
        }
        return result;
      }, {});
    
    },
  },
};
</script>
<style scoped lang="scss">
// /deep/.el-dialog {
//   border-radius: 8px;
// }
// /deep/.el-dialog__header {
//   border-bottom: 1px solid #e1e1e1;
//   opacity: 1;
//   font-size: 20px;
//   font-family: PingFang SC, PingFang SC-Bold;
//   font-weight: 700;
//   text-align: left;
//   color: #333333;
// }
// /deep/.el-dialog__body {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 30px 0;
//   .item {
//     width: 600px;
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     margin-bottom: 16px;
//     .el-form-item__label {
//       white-space: nowrap;
//     }
//   }
// }
/deep/.el-dialog__body {
  padding: 30px 30px 30px 5px  !important;
}
.el-form-item__content .el-select {
  width: 100% !important;
}
.el-form-item__content .el-input {
  width: 100% !important;
}
</style>