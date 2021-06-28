<template>
  <div class="contant">
    <i class="el-icon-menu" style="font-size: 16px; color: #409eff"></i>
    <span class="info">报修信息</span>
    <el-divider></el-divider>
    <el-form label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="报修时间:">
            <span>{{ form.createTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修编号:">
            <span>{{ form.repaireCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修类型:">
            <span>{{ form.repairType }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="报修用户:">
            <span>{{ form.userName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="处理状态:">
            <span>{{ form.repaireStatu }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报修房屋:">
            <span>{{ form.buildingCode }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="报修描述:">
        <span>{{ form.repairDesc }}</span>
      </el-form-item>

      <el-form-item v-if="form.repaireImageList" label-width="0px">
         <el-image
            v-for="item in form.repaireImageList"
            style="width: 100px; height: 100px; margin-right: 10px"
            :key="item"
            :src="item"
            :preview-src-list="form.repaireImageList"
          >
          </el-image>
      </el-form-item>
    </el-form>
    <div style="margin-top: 30px">
      <el-tabs v-model="activeName">
        <el-tab-pane v-if="type == 1" label="派单操作" name="first">
          <div style="margin-top: 20px">
            <span>派单操作</span>
            <el-radio-group v-model="radio" size="mini">
              <el-radio label="0">单人派单</el-radio>
              <el-radio label="1">报修抢单</el-radio>
            </el-radio-group>
          </div>
          <div style="margin-top: 40px; width: 600px">
            <tree-transfer
              :title="title"
              :from_data="fromData"
              :to_data="toData"
              :mode="mode"
              height="400px"
              filter
              openAll
            >
            </tree-transfer>
          </div>
          <div style="margin-top: 20px">
            <el-button
              style="display: inline-block"
              @click="cancel($store.getters.rightNav)"
              >取消</el-button
            >
            <el-button
              style="display: inline-block"
              type="primary"
              @click="submit($store.getters.rightNav)"
              >提交</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="type == 0 || type == 1 || type == 2"
          label="报修进展"
          name="second"
        >
          <div style="margin-top: 20px; padding-left: 10px">
            <el-timeline>
              <el-timeline-item
                type="primary"
                v-for="(activity, index) in form.repaireProgresses"
                :key="index"
                :timestamp="activity.progressTime"
              >
                {{ activity.progressStatus }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="type == 2" label="报修评价" name="third">
          <el-form v-if="form.repaireAppraise">
             <el-form-item label="评价时间：">
             <p>{{form.repaireAppraise.appraiseTime}}</p>
            </el-form-item>
            <el-form-item label="报修整体评价：">
              <div style="display:inline-block">
                <el-rate v-model="form.repaireAppraise.appraiseScore" disabled  text-color="#ff9900">
              </el-rate>
              </div>
            </el-form-item>
            <el-form-item label="报修服务评价：">
              <div style="display:inline-block">
                <el-rate v-model="form.repaireAppraise.timelyScore" disabled  text-color="#ff9900">
              </el-rate>
              </div>
            </el-form-item>
            <el-form-item label="服务态度：">
              <div style="display:inline-block">
                <el-rate v-model="form.repaireAppraise.attitudeScore" disabled  text-color="#ff9900">
              </el-rate>
              </div>
            </el-form-item>
            <el-form-item label="处理效果：">
              <div style="display:inline-block">
                <el-rate v-model="form.repaireAppraise.effectScore" disabled  text-color="#ff9900">
              </el-rate>
              </div>
            </el-form-item>
            <el-form-item label="评价详情：">
             <p>{{form.repaireAppraise.appariseDesc}}</p>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="type == 2" label="回访评价" name="fourth"
          >
          <el-form v-if="form.repaireRevisit">
             <el-form-item label="回访时间：">
             <p>{{form.repaireRevisit.revisitTime}}</p>
            </el-form-item>
            <el-form-item label="回访评价：">
               <p>{{form.repaireRevisit.revisitContent}}</p>
            </el-form-item>
            <el-form-item label="回访人：">
               <p>{{form.repaireRevisit.createBy}}</p>
            </el-form-item>
          </el-form></el-tab-pane
        >
      </el-tabs>
    </div>
  </div>
</template>
<script>
import treeTransfer from "el-tree-transfer";
export default {
  name: "listDetail",
  components: {
    treeTransfer,
  },
  data() {
    return {
      // 穿梭框格式
      mode: "transfer",
      // 穿梭框左右标题
      title: ["未选择", "已选择"],
      // 穿梭框已选择列表
      toData: [],
      // 穿梭框未选择列表（初始未全部列表）
      fromData: [],
      // 单人或多人派单判断
      radio: "0",
      // 判断是派单或者查看
      type: undefined,
      // 详情参数
      form: {},
      activeName: "first",
      // 父级code
      parentCode: undefined,
    };
  },
  mounted() {
    // 父级传递的参数处理
    if (this.$route.params.code) {
      localStorage.setItem("details", JSON.stringify(this.$route.params));
      this.parentCode = this.$route.params.code;
      this.type = this.$route.params.type;
    } else {
      this.parentCode = JSON.parse(localStorage.getItem("details")).code;
      this.type = JSON.parse(localStorage.getItem("details")).type;
    }
    // 查询报修处理详情
    this.$request.selectOrderDetails(this.parentCode).then((res) => {
      if (res.data.status == 200) {
        if (this.type == 1) {
          this.activeName = "first";
        } else {
          this.activeName = "second";
        }
        this.form = res.data.data;
        let peopleList = res.data.data.manageUserDtoMap;
        let arr = {};
        let list = [];
        // 派单人员数据结构转换
        if (res.data.data.manageUserDtoMap) {
          for (var i = 0; i < Object.keys(peopleList).length; i++) {
            arr.id = i + 1;
            arr.pid = 0;
            arr.children = [];
            arr.label = Object.keys(peopleList)[i];
            peopleList[Object.keys(peopleList)[i]].forEach((item) => {
              arr.children.push({
                pid: i + 1,
                id: i + 1 + "-" + item.id,
                label: item.realName,
                code: item.managerCode,
              });
            });
            list.push(arr);
            arr = {};
          }
        }
        this.fromData = list;
      }
    });
  },
  methods: {
    cancel(tabItem) {
      this.$router.go(-1);
      this.$store.dispatch("removeTab", {
        tabItem,
        fullPath: this.$route.fullPath,
        router: this.$router,
      });
    },
    // 提交
    submit(tabItem) {
      let codeList = [];
      let that = this;
      for (var i = 0; i < this.toData.length; i++) {
        if (this.toData[i].children.length) {
          this.toData[i].children.forEach((item) => {
            codeList.push(item.code);
          });
        }
      }
      if (this.radio == "0" && codeList.length > 1) {
        this.$message.error("单人派单只能提交一个人");
      } else if (codeList.length <= 0) {
        this.$message.error("请选择派单人员");
      } else {
        this.form.manageCodeList = codeList;
        this.form.publishType = Number(this.radio);
        this.$request.repairUpdateRepair(this.form).then((res) => {
          if (res.data.status == 200) {
            that.$message.success("提交成功");
            that.$router.go(-1);
            that.$store.dispatch("removeTab", {
              tabItem,
              fullPath: this.$route.fullPath,
              router: this.$router,
            });
          } else {
            that.$message.error(res.data.msg);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.contant {
  // text-align: center;
  padding: 16px;
  background: #fff;
  .info {
    font-size: 18px;
  }
}
.el-form-item {
  margin: 0;
}
/deep/.is-top {
  font-size: 16px !important;
}
/deep/.el-button {
  display: block;
  width: 90px;
  text-align: center;
  padding: 0;
  height: 40px;
  border-radius: 5px;
  line-height: 40px;
}
</style>