import en from "../i18n/lang/en"
import Vue from "vue"
import Router from "vue-router"
import CommerViews from "@/views/commerViews"
import Login from "@/views/login/index"
import Layout from "@/views/layout/layout"
import HomeMain from "@/views/index/mainIndex"

// 不是必须加载的组件使用懒加载
const Populace = () => import("@/views/populace/index")
const addPeople = () => import("@/views/populace/addPeople")
const editPeople = () => import("@/views/populace/editPeople")
const VisitorThrough = () => import("@/views/populace/visitorThrough")
const VisitorEcord = () => import("@/views/populace/visitorEcord")
const PersonTurnover = () => import("@/views/populace/personTurnover")
const TenantRecord = () => import("@/views/populace/tenantRecord")
const TenantDetail = () => import("@/views/populace/tenantDetail")
const FloatingPopulation = () => import("@/views/populace/floatingPopulation")
const PeopleDetail = () => import("@/views/populace/peopleDetail")
const Transfer = () => import("@/views/questionnaire/transfer")
const QuestionDetail = () => import("@/views/questionnaire/questionDetail")
const HousingVote = () => import("@/views/servicePeople/housingVote")
const EpidemicPrevention = () => import("@/views/servicePeople/epidemicPrevention")
const HousingVoteDetail = () => import("@/views/servicePeople/housingVoteDetail")
const VoteRanking = () => import("@/views/servicePeople/voteRanking")
const QuestionAdd = () => import("@/views/questionnaire/questionAdd")
const userManagement = () => import("@/views/userManagement")
const propertyAdd = () => import("@/views/userManagement/propertyAdd")
const DataTable = () => import("@/views/table/dataTables")
const FilterTable = () => import("@/views/table/filterTable")
const OwnerRepairs = () => import("@/views/table/ownerRepairs")
const OwnerRepairsDetail = () => import("@/views/table/ownerRepairsDetail")
const detailInfo = () => import("@/views/table/listDetail")
const DragTable = () => import("@/views/table/dragTabe")
const completeRecords = () => import("@/views/table/completeRecords")
const Inform = () => import("@/views/graphic/inform")
const activity = () => import("@/views/graphic/activity")
const billboard = () => import("@/views/graphic/billboard")
const garbageSorting = () => import("@/views/graphic/garbageSorting")
const news = () => import("@/views/graphic/news")
const addDetail = () => import("@/views/graphic/addDetail")
const editDetail = () => import("@/views/graphic/editDetail")
const Markdown = () => import("@/views/editor/markdownView")
const WangeditorView = () => import("@/views/editor/wangeditorView")
const NotFound = () => import("@/views/page404")
const Housedata = () => import("@/views/houseManagement/housedata")
const HouseRecord = () => import("@/views/houseManagement/houseRecord")
const RoomDetail = () => import("@/views/houseManagement/roomDetail")
const NavClassify = () => import("@/views/syssetting/navClassify")
const placeDict = () => import("@/views/syssetting/placeDict")
const HelpCenter = () => import("@/views/syssetting/helpCenter")
const vavDetail = () => import("@/views/syssetting/vavDetail")
const secondPlace = () => import("@/views/syssetting/secondPlace")
const deptDict = () => import("@/views/syssetting/deptDict")
const userControl = () => import("@/views/syssetting/userControl")
const roleDict = () => import("@/views/syssetting/roleDict")
const WxSecondMenu = () => import("@/views/syssetting/wxSecondMenu")
const PcSecondMenu = () => import("@/views/syssetting/pcSecondMenu")
const MenuManagement = () => import("@/views/syssetting/menuManagement")
const thirdPlace = () => import("@/views/syssetting/thirdPlace")
const pagePermissions = () => import("@/views/permissions/pagePermissions")
const btnPermissions = () => import("@/views/permissions/btnPermissions")
const ExpenseCategory = () => import("@/views/propertyCost/expenseCategory")
const Expensedetail = () => import("@/views/propertyCost/expensedetail")
const BillCheck = () => import("@/views/propertyCost/billCheck")
const BillRecord = () => import("@/views/propertyCost/billRecord")
const FinanceCheck = () => import("@/views/propertyCost/financeCheck")
const PayRecord = () => import("@/views/propertyCost/payRecord")
const PayRecordDetail = () => import("@/views/propertyCost/payRecordDetail")
const UsersFees = () => import("@/views/propertyCost/usersFees")
const Advice = () => import("@/views/servicePeople/advice")
const carFiles = () => import("@/views/carManagement/carFiles")
const UserParking = () => import("@/views/carManagement/userParking")
const CarTurnover = () => import("@/views/carManagement/carTurnover")
const ParkingDetail = () => import("@/views/carManagement/parkingDetail")
const CarDetail = () => import("@/views/carManagement/carDetail")
const CarRecord = () => import("@/views/carManagement/carRecord")
const InvoiceManagement = () => import("@/views/invoice/invoiceManagement")
const ReceiptManagement = () => import("@/views/invoice/receiptManagement")
const MessageDict = () => import("@/views/message/messageDict")
const MessageTemplate = () => import("@/views/message/messageTemplate")
const MessageManage = () => import("@/views/message/messageManage")
const MessageDetail = () => import("@/views/message/messageDetail")
const MessageSecondDict = () => import("@/views/message/messageSecondDict")
const MessageManageDetail = () => import("@/views/message/messageManageDetail")
const UserIntegralRecord = () => import("@/views/userManagement/userIntegralRecord")
const EmergencyRecord = () => import("@/views/emergency/emergencyRecord")
const EmergencySubscription = () => import("@/views/emergency/emergencySubscription")
const EmergencyDict = () => import("@/views/emergency/emergencyDict")
const EmergencySecendDict = () => import("@/views/emergency/emergencySecendDict")
const IntelligentDustbin = () => import("@/views/deviceManagement/intelligentDustbin")
const IntelligentWelllid = () => import("@/views/deviceManagement/intelligentWelllid")
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)
let routeName = en.routeName;
let addRouter = [];
let router = [];
if(JSON.parse(localStorage.getItem("userInfo"))){
  let role = JSON.parse(localStorage.getItem("userInfo")).roleDTO.list;
  router = [
    // 房屋管理
    {
      path: "/",
      iconCls: "iconfont icon-fangwuguanli",
      name: routeName.article,
      menuCode:'M1',
      component: Layout,
      children: [
        {
          path: "/houseRecord",
          iconCls: "el-icon-tickets", // 一房一档
          name: routeName.houseRecord,
          menuCode:'M1-1',
          component: HouseRecord,
          children: []
        },
        {
          path: "/housedata",
          iconCls: "el-icon-tickets", // 楼幢数据管理
          name: routeName.housedata,
          menuCode:'M1-2',
          component: Housedata,
          children: []
        },
        {
          path: "/roomDetail",
          iconCls: "el-icon-tickets", // 一房一档详情
          name: routeName.roomDetail,
          component: RoomDetail,
          hidden: true,
          children: []
        }
      ]
    },
  
    //实口治理
    {
      path: "/",
      iconCls: "iconfont icon-shikouzhili",
      name: routeName.icon,
      component: Layout,
      menuCode:'M2',
      children: [
        {
          path: "/populace",
          iconCls: "el-icon-tickets", // 一人一档
          name: routeName.builtInIcon,
          menuCode:'M2-1',
          component: Populace,
          children: []
        },
        {
          path: "/addPeople",
          iconCls: "el-icon-tickets", // 一人一档新增
          name: routeName.addPeople,
          component: addPeople,
          hidden: true,
          children: []
        },
        {
          path: "/editPeople",
          iconCls: "el-icon-tickets", // 一人一档修改
          name: routeName.editPeople,
          component: editPeople,
          hidden: true,
          children: []
        },
        {
          path: "/visitorThrough",
          iconCls: "el-icon-tickets", // 访客放行管理
          name: routeName.visitorThrough,
          menuCode:'M2-2',
          component: VisitorThrough,
          children: []
        },
        {
          path: "/visitorEcord",
          iconCls: "el-icon-tickets", // 访客放行记录
          name: routeName.visitorEcord,
          menuCode:'M2-3',
          component: VisitorEcord,
          children: []
        },
        {
          path: "/tenantRecord",
          iconCls: "el-icon-tickets", // 租客信息管理
          name: routeName.tenantRecord,
          menuCode:'M2-6',
          component: TenantRecord,
          children: []
        },
        {
          path: "/floatingPopulation",
          iconCls: "el-icon-tickets", // 流动人口管理
          name: routeName.floatingPopulation,
          menuCode:'M2-4',
          component: FloatingPopulation,
          children: []
        },
        {
          path: "/personTurnover",
          iconCls: "el-icon-tickets", //人员进出记录
          name: routeName.personTurnover,
          menuCode:'M2-5',
          component: PersonTurnover,
          children: []
        },
        
        {
          path: "/tenantDetail",
          iconCls: "el-icon-tickets", // 租客信息详情
          name: routeName.tenantDetail,
          component: TenantDetail,
          hidden: true,
          children: []
        },
        {
          path: "/peopleDetail",
          iconCls: "el-icon-tickets", // 一人一档详情
          name: routeName.peopleDetail,
          component: PeopleDetail,
          hidden: true,
          children: []
        }
      ]
    },
    //车辆管理
    {
      path: "/",
      iconCls: "iconfont icon-cheliangguanli",
      name: routeName.carManagement,
      menuCode:'M3',
      component: Layout,
      children: [
        {
          path: "/carRecord",
          iconCls: "el-icon-tickets", //一车一档
          name: routeName.carRecord,
          menuCode:'M3-1',
          component: CarRecord,
          children: []
        },
        {
          path: "/carDetail",
          iconCls: "el-icon-tickets", //一车一档查看
          name: routeName.carDetail,
          component: CarDetail,
          hidden: true,
          children: []
        },
        {
          path: "/userParking",
          iconCls: "el-icon-tickets", //用户车位管理
          menuCode:'M3-2',
          name: routeName.userParking,
          component: UserParking,
          children: []
        },
        {
          path: "/carFiles",
          iconCls: "el-icon-tickets", //区域车位管理
          name: routeName.carFiles,
          menuCode:'M3-3',
          component: carFiles,
          children: []
        },
        {
          path: "/carTurnover",
          iconCls: "el-icon-tickets", //车辆进出记录
          name: routeName.carTurnover,
          menuCode:'M3-4',
          component: CarTurnover,
          children: []
        },
        {
          path: "/parkingDetail",
          iconCls: "el-icon-tickets", //用户车位查看
          name: routeName.parkingDetail,
          component: ParkingDetail,
          hidden: true,
          children: []
        },
      ]
    },
    // 设备管理
    {
      path: "/",
      iconCls: "iconfont icon-shebeiguanli",
      name: routeName.deviceManagement,
      menuCode:'M4',
      component: Layout,
      children: [
        {
          path: "/intelligentDustbin",
          iconCls: "el-icon-tickets", // 智能垃圾箱
          name: routeName.intelligentDustbin,
          component: IntelligentDustbin,
          menuCode:'M4-1',
          children: []
        },
        {
          path: "/intelligentWelllid",
          iconCls: "el-icon-tickets", // 智能井盖
          name: routeName.intelligentWelllid,
          component: IntelligentWelllid,
          menuCode:'M4-2',
          children: []
        },
      ]
    },
    // 告警中心
    {
      path: "/",
      iconCls: "iconfont icon-gaojingzhongxin",
      name: routeName.emergencyCenter,
      menuCode:'M5',
      component: Layout,
      children: [
        {
          path: "/emergencyRecord",
          iconCls: "el-icon-tickets", // 告警记录管理
          name: routeName.emergencyRecord,
          component: EmergencyRecord,
          menuCode:'M5-1',
          children: []
        },
        {
          path: "/emergencySubscription",
          iconCls: "el-icon-tickets", // 告警订阅
          name: routeName.emergencySubscription,
          component: EmergencySubscription,
          menuCode:'M5-2',
          children: []
        },
        {
          path: "/emergencyDict",
          iconCls: "el-icon-tickets", // 告警中心字典
          name: routeName.emergencyDict,
          component: EmergencyDict,
          menuCode:'M5-3',
          children: []
        },
        {
          path: "/emergencySecendDict",
          iconCls: "el-icon-tickets", // 告警中心二级字典
          name: routeName.emergencySecendDict,
          component: EmergencySecendDict,
          hidden: true,
          children: []
        },
      ]
    },
    // 物业缴费
    {
      path: "/",
      iconCls: "iconfont icon-wuyejiaofei",
      name: routeName.propertyCost,
      component: Layout,
      menuCode:'M6',
      children: [
  
        {
          path: "/expenseDetail",
          iconCls: "el-icon-tickets", // 费用类别二级
          name: routeName.expenseDetail,
          hidden: true,
          component: Expensedetail,
          children: []
        },
        {
          path: "/billRecord",
          iconCls: "el-icon-tickets", // 创建账单
          name: routeName.billRecord,
          component: BillRecord,
          menuCode:'M6-1',
          children: []
        },
        {
          path: "/billCheck",
          iconCls: "el-icon-tickets", //  账单生成记录
          name: routeName.billCheck,
          component: BillCheck,
          menuCode:'M6-2',
          children: []
        },
        {
          path: "/financeCheck",
          iconCls: "el-icon-tickets", // 财务复核
          name: routeName.financeCheck,
          component: FinanceCheck,
          menuCode:'M6-3',
          children: []
        },
        {
          path: "/usersFees",
          iconCls: "el-icon-tickets", // 住户缴费
          name: routeName.usersFees,
          component: UsersFees,
          menuCode:'M6-4',
          children: []
        },
        {
          path: "/payRecord",
          iconCls: "el-icon-tickets", // 费用支付记录
          name: routeName.payRecord,
          component: PayRecord,
          menuCode:'M6-5',
          children: []
        },
        {
          path: "/payRecordDetail",
          iconCls: "el-icon-tickets", // 费用支付记录统计
          name: routeName.payRecordDetail,
          component: PayRecordDetail,
          children: [],
          hidden:true,
        },
        {
          path: "/expenseCategory",
          iconCls: "el-icon-tickets", // 费用类别
          name: routeName.expenseCategory,
          component: ExpenseCategory,
          menuCode:'M6-6',
          children: []
        },
      ]
    },
  
    // 报修派单
    {
      path: "/",
      iconCls: "iconfont icon-baoxiupaidan", // 图标样式class
      name: routeName.table,
      component: Layout,
      menuCode:'M7',
      children: [
        {
          path: "/ownerRepairs",
          iconCls: "el-icon-tickets", // 业主报修管理
          name: routeName.ownerRepairs,
          component: OwnerRepairs,
          menuCode:'M7-1',
          children: []
        },
        {
          path: "/ownerRepairsDetail",
          iconCls: "el-icon-tickets", // 业主报修管理详情
          name: routeName.ownerRepairsDetail,
          hidden: true,
          component: OwnerRepairsDetail,
          children: []
        },
        {
          path: "/dataTable",
          iconCls: "el-icon-tickets", // 报修受理
          name: routeName.multiDataTable,
          component: DataTable,
          menuCode:'M7-2',
          children: []
        },
        {
          path: "/filterTable",
          iconCls: "el-icon-tickets", // 报修处理列表
          name: routeName.filterTable,
          component: FilterTable,
          menuCode:'M7-3',
          children: []
        },
        {
          path: "/dragTabe",
          iconCls: "el-icon-tickets", // 我的工单
          name: routeName.dragSort,
          component: DragTable,
          menuCode:'M7-4',
          children: []
        },
        {
          path: "/completeRecords",
          iconCls: "el-icon-tickets", // 报修完成记录
          name: routeName.completeRecords,
          component: completeRecords,
          menuCode:'M7-5',
          children: []
        },
        {
          path: "/detailInfo",
          iconCls: "el-icon-tickets", // 报修详情
          name: routeName.detailInfo,
          component: detailInfo,
          hidden: true,
          children: []
        }
      ]
    },
    // 收据发票
    {
      path: "",
      iconCls: "iconfont icon-shoujufapiao",
      name: routeName.receipt,
      component: Layout,
      menuCode:'M8',
      children: [
        {
          path: "/receiptManagement",
          iconCls: "el-icon-tickets", // 收据管理
          name: routeName.receiptManagement,
          component: ReceiptManagement,
          menuCode:'M8-1',
          children: []
        },
        {
          path: "/invoiceManagement",
          iconCls: "el-icon-tickets", // 发票管理
          name: routeName.invoiceManagement,
          component: InvoiceManagement,
          menuCode:'M8-2',
          children: []
        }
      ]
    },
    // 图文管理
    {
      path: "/",
      iconCls: "iconfont icon-gongzhigaoshi",
      name: routeName.uploads,
      component: Layout,
      menuCode:'M9',
      children: [
        {
          path: "/inform",
          iconCls: "el-icon-tickets", // 物业通知管理
          name: routeName.fileUpload,
          component: Inform,
          menuCode:'M9-1',
          children: []
        },
        {
          path: "/billboard",
          iconCls: "el-icon-tickets", // 小区告示管理
          name: routeName.billboard,
          component: billboard,
          menuCode:'M9-2',
          children: []
        },
        {
          path: "/news",
          iconCls: "el-icon-tickets", // 社区生活管理
          name: routeName.news,
          component: news,
          menuCode:'M9-3',
          children: []
        },
        {
          path: "/activity",
          iconCls: "el-icon-tickets", // 便民活动管理
          name: routeName.activity,
          component: activity,
          menuCode:'M9-4',
          children: []
        },
        {
          path: "/garbageSorting",
          iconCls: "el-icon-tickets", // 垃圾分类宣传
          name: routeName.garbageSorting,
          component: garbageSorting,
          menuCode:'M9-5',
          children: []
        },
        {
          path: "/detailgar",
          iconCls: "el-icon-tickets", // 新增表单页面
          name: routeName.addNew,
          component: addDetail,
          hidden: true,
          children: []
        },
        {
          path: "/editDetail",
          iconCls: "el-icon-tickets", // 修改表单页面
          name: routeName.editNew,
          component: editDetail,
          hidden: true,
          children: []
        }
  
      ]
    },
    // 消息管理
    {
      path: "",
      iconCls: "iconfont icon-xiaoxiguanli",
      name: routeName.information,
      component: Layout,
      menuCode:'M10',
      children: [
        {
          path: "/messageTemplate",
          iconCls: "el-icon-tickets",  //消息模板管理
          name: routeName.messageTemplate,
          component: MessageTemplate,
          menuCode:'M10-1',
          children: []
        },
        {
          path: "/messageManage",
          iconCls: "el-icon-tickets", // 消息发送记录
          name: routeName.messageManage,
          component: MessageManage,
          menuCode:'M10-2',
          children: []
        },
        {
          path: "/messageDetail",
          iconCls: "el-icon-tickets", // 消息批次管理
          name: routeName.messageDetail,
          component: MessageDetail,
          menuCode:'M10-3',
          children: []
        },
        {
          path: "/messageDict",
          iconCls: "el-icon-tickets", // 消息类型字典
          name: routeName.messageDict,
          component: MessageDict,
          menuCode:'M10-4',
          children: []
        },
        {
          path: "/messageSecondDict",
          iconCls: "el-icon-tickets", // 消息类型字典(二级)
          name: routeName.messageSecondDict,
          component: MessageSecondDict,
          hidden: true,
          children: []
        },
        {
          path: "/messageManageDetail",
          iconCls: "el-icon-tickets", // 批次详情
          name: routeName.messageManageDetail,
          component: MessageManageDetail,
          hidden: true,
          children: []
        }
      ]
    },
    // 民生服务
    {
      path: "/",
      iconCls: "iconfont icon-minshengfuwu",
      name: routeName.servicePeople,
      component: Layout,
      menuCode:'M11',
      children: [
        {
          path: "/advice",
          iconCls: "el-icon-tickets",  //投诉建议
          name: routeName.complaintAdvice,
          component: Advice,
          menuCode:'M11-1',
          children: []
        },
        {
          path: "/transfer",
          iconCls: "el-icon-tickets", // 问卷调查管理
          name: routeName.demoShuttle,
          component: Transfer,
          menuCode:'M11-2',
          children: []
        },
        {
          path: "/housingVote",
          iconCls: "el-icon-tickets", // 小区投票
          name: routeName.housingVote,
          component: HousingVote,
          menuCode:'M11-3',
          children: []
        },
        {
          path: "/epidemicPrevention",
          iconCls: "el-icon-tickets", // 疫情防控
          name: routeName.epidemicPrevention,
          component: EpidemicPrevention,
          menuCode:'M11-4',
          children: []
        },
        {
          path: "/housingVoteDetail",
          iconCls: "el-icon-tickets", // 投票内容
          name: routeName.housingVoteDetail,
          component: HousingVoteDetail,
          hidden: true,
          children: []
        },
        {
          path: "/voteRanking",
          iconCls: "el-icon-tickets", // 投票详情
          name: routeName.voteRanking,
          component: VoteRanking,
          hidden: true,
          children: []
        },
        {
          path: "/questionDetail",
          iconCls: "el-icon-tickets", // 问卷调查详情
          name: routeName.questionDetail,
          component: QuestionDetail,
          hidden: true,
          children: []
        },
        {
          path: "/questionAdd",
          iconCls: "el-icon-tickets", // 问卷调查内容添加
          name: routeName.questionAdd,
          component: QuestionAdd,
          hidden: true,
          children: []
        }
        // {
        //   path: "/erji3",
        //   iconCls: "el-icon-tickets",
        //   name: routeName["menu2-2"],
        //   component: propertyAdd,// 物业人员管理
        //   children: []
        // }
      ]
    },
    // 用户管理
    {
      path: "/",
      iconCls: "iconfont icon-yonghuguanli",
      name: routeName.multiDirectory,
      component: Layout,
      menuCode:'M12',
      children: [
  
        {
          path: "/userControl",
          iconCls: "el-icon-tickets", // 注册用户管理
          name: routeName.userControl,
          component: userControl,
          menuCode:'M12-1',
          children: []
        },
        {
          path: "/erji3",
          iconCls: "el-icon-tickets",
          name: routeName["menu2-2"],
          component: propertyAdd,// 物业人员管理
          menuCode:'M12-2',
          children: []
        },
        {
          path: "/userIntegralRecord",
          iconCls: "el-icon-tickets",
          name: routeName.userIntegralRecord,
          component: UserIntegralRecord,// 用户积分记录
          menuCode:'M12-3',
          children: []
        }
      ]
    },
  
    // 统计报表
    // {
    //   path: "/",
    //   iconCls: "iconfont icon-tongjibaobiao", // 图标样式class
    //   name: routeName.editor,
    //   component: Layout,
    //   // meta: { role: ["superAdmin", "admin"] },
    //   children: [
    //     {
    //       path: "/markdown",
    //       iconCls: "fa fa-file-code-o", // 图标样式class
    //       name: routeName.markdown,
    //       component: Markdown,
    //       children: []
    //     },
    //     // {
    //     //   path: "/wangeditor",
    //     //   iconCls: "fa fa-file-code-o", // 图标样式class
    //     //   name: routeName.wangeditor,
    //     //   component: WangeditorView,
    //     //   children: []
    //     // }
    //   ]
    // },
    // 系统设置
    {
      path: "/",
      iconCls: "iconfont icon-xitongshezhi",
      name: routeName.systemSettings,
      component: Layout,
      menuCode:'M13',
      children: [
        {
          path: "/navClassifies",
          iconCls: "el-icon-tickets", // 通用数据字典
          name: routeName.navMenu,
          component: NavClassify,
          menuCode:'M13-1',
          children: []
        },
        {
          path: "/placeDict",
          iconCls: "el-icon-tickets", // 区域数据字典
          name: routeName.placeMenu,
          component: placeDict,
          menuCode:'M13-2',
          children: []
        },
        {
          path: "/deptDict",
          iconCls: "el-icon-tickets", // 部门数据字典
          name: routeName.deptMenu,
          component: deptDict,
          menuCode:'M13-3',
          children: []
        },
        {
          path: "/roleDict",
          iconCls: "el-icon-tickets", // 系统角色管理
          name: routeName.roleMenu,
          component: roleDict,
          menuCode:'M13-4',
          children: []
        },
        {
          path: "/menuManagement",
          iconCls: "el-icon-tickets", // 系统菜单管理
          name: routeName.menuManagement,
          component: MenuManagement,
          menuCode:'M13-5',
          children: []
        },
        {
          path: "/helpCenter",
          iconCls: "el-icon-tickets", // 帮助中心
          name: routeName.helpCenter,
          component: HelpCenter,
          menuCode:'M13-6',
          children: []
        },
        {
          path: "/pcSecondMenu",
          iconCls: "el-icon-tickets", // PC二级菜单管理
          name: routeName.pcSecondMenu,
          hidden: true,
          component: PcSecondMenu,
          children: []
        },
        {
          path: "/wxSecondMenu",
          iconCls: "el-icon-tickets", // 小程序二级菜单管理
          name: routeName.wxSecondMenu,
          hidden: true,
          component: WxSecondMenu,
          children: []
        },
        {
          path: "/vavDetail", // 通用数据字典（二级）
          component: vavDetail,
          name: routeName.detail,
          hidden: true,
          children: []
        },
        {
          path: "/secondPlace", // 区域数据字典（二级）
          component: secondPlace,
          name: routeName.secondPlace,
          hidden: true,
          children: []
        },
        {
          path: "/thirdPlace", // 区域数据字典（三级）
          component: thirdPlace,
          name: routeName.thirdPlace,
          hidden: true,
          children: []
        }
      ]
    },
    {
      path: "*",
      redirect: "/404",
      hidden: true,
      children: []
    },
  ]
  for(var i = 0;i < router.length; i++) {
    role.forEach(item => {
      if(router[i].menuCode == item.menuCode){
        let arr = [];
        for(var j = 0; j < router[i].children.length;j++) {
          item.list.forEach(res =>{
            if(router[i].children[j].menuCode == res.menuCode || router[i].children[j].hidden) {
              arr.push(router[i].children[j])
            }
          })
        }
        router[i].children = arr;
        addRouter.push(router[i]);
      }
    });
  }
  console.log(addRouter)
}else{
  console.log('null')
}

let defaultRouter = [
  {
    path: "/",
    redirect: "/index",
    hidden: true,
    children: []
  },
  // 登陆
  {
    path: "/login",
    component: Login,
    name: "",
    hidden: true,
    children: []
  },
  // 首页
  {
    path: "/index",
    iconCls: "iconfont icon-kongzhitai", // 图标样式class
    name: routeName.home,
    component: Layout,
    alone: true,
    children: [
      {
        path: "/index",
        iconCls: "el-icon-kongzhitai", // 图标样式class
        name: routeName.home,
        component: HomeMain,
        children: []
      }
    ]
  },
  {
    path: "/404",
    component: NotFound,
    name: "404",
    hidden: true,
    children: []
  }
]


export default new Router({
  routes: defaultRouter
})
export { defaultRouter, addRouter }
