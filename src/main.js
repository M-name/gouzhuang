// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import ElementUI from "element-ui"
import App from "./App.vue"
import router from "./router"
import store from "./vuex"
import i18n from "./i18n/i18n"
import globalPlugin from "./utils/global"
import permission from "./directive/permission/button"
import NProgress from "nprogress"
import CommonSearch from "@/components/search";
import CommonTable from "@/components/table";
import "nprogress/nprogress.css"
import "element-ui/lib/theme-chalk/index.css"
import "@/assets/iconfont/iconfont.css"
import "@/assets/font_gz/iconfont.css"
import "font-awesome/css/font-awesome.css"
import "@/router/permission"
import 'default-passive-events'
import AMap from 'vue-amap';
Vue.use(AMap);

  // 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key:'39e4dcd382e625f84c7d7367534a51a7',
  // 插件集合 （插件按需引入）
  plugin: [ "AMap.Geolocation",'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
});

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(globalPlugin)
Vue.use(permission)
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}



Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}
Vue.component('CommonSearch', CommonSearch);
Vue.component('CommonTable', CommonTable)
NProgress.inc(0.2)
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false })

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App),
  components: {App},
  template: "<App/>"
})
