<template>
  <div>
    <el-aside id="asideNav">
      <div class="logo-name">
        <!-- <p >XU</p> -->
        <div style="text-align: center" v-if="$store.getters.logoShow">
          <img class="smail-img" src="@/assets/company.png" alt="" />
        </div>

        <div v-else>
          <img class="big-img" src="@/assets/company.png" alt="" />
          <span>勾庄佳苑智慧物业</span>
        </div>
      </div>
       <!-- 自动跳转 :router="$store.getters.uniquerouter" -->
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        @select="selectmenu"
        :collapse="$store.getters.isCollapse"
        background-color="#03152A"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#ffffff"
       
        :unique-opened="$store.getters.uniquerouter"
        :collapse-transition="true"
      >
        <template
          v-for="(item, index) in $store.getters.routers"
          v-if="!item.hidden"
        >
          <el-submenu
            v-if="!item.alone && item.children.length > 0"
            :index="index + ''"
            :key="index"
          >
            <template slot="title">
              <i :class="item.iconCls ? item.iconCls : [fa, fa - server]"></i>
              <span slot="title">{{ $t(`routeName.${item.name}`) }}</span>
            </template>

            <menu-tree :menuData="item.children"></menu-tree>
          </el-submenu>
          <el-menu-item :index="item.path" v-else :key="item.path">
            <i :class="item.iconCls ? item.iconCls : [fa, fa - file]" />
            <span slot="title">{{ $t(`routeName.${item.name}`) }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import menuTree from "./menuTree";

export default {
  name: "asideNav",
  components: {
    menuTree,
  },
  watch: {
    // 监听浏览器直接输入路由，将此路由添加到tabnavBox
    "$route.path": function (val) {
      if (val == "/commerViews") {
        console.log("23453");
      } else {
        this.selectmenu(val);
      }
    },
  },
  methods: {
    selectmenu(key) {
      if (key == "/commerViews") {
        const routeLink = this.$router.resolve({
          path: key,
        });
        window.open(routeLink.href, "_blank");
      } else {
        let router = this.$store.getters.routers;
        let name = "";
        let navTitle = function (path, routerARR) {
          for (let i = 0; i < routerARR.length; i++) {
            if (
              routerARR[i].children.length > 0 ||
              routerARR[i].path === path
            ) {
              if (
                routerARR[i].path === path &&
                routerARR[i].children.length < 1
              ) {
                name = routerARR[i].name;
                break;
              }
              navTitle(path, routerARR[i].children);
            }
          }
          return name;
        };
        this.$store.dispatch("addTab", {
          title: navTitle(key, router),
          path: key,
        });
        this.$router.push({ path:key})
      }
    },
  },
};
</script>

<style lang="scss">
$top: top;
$bottom: bottom;
$left: left;
$right: right;
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}

#asideNav {
  width: auto !important;
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;
  .logo-name {
    background-color: #03152a !important;
    @extend %w100;
    font-weight: 300;
    z-index: 999;

    span {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      margin-left: 5px;
      color: #fff;
    }
    .big-img {
      width: 25px;
      height: 25px;
      display: inline-block;
      margin-left: 10px;
      vertical-align: middle;
      margin-top: -4px;
    }
    .smail-img {
      width: 25px;
      height: 25px;
      margin-top: 10px;
    }
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    @extend %h100;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .el-menu {
    flex: 1;
    overflow: inherit;
    border-right: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
    .el-menu-item {
      background-color: #020f1d !important;
      border-bottom: 1px solid #020f1d;
      &:hover {
        color: #ffffff !important;
        background-color: #375573 !important;
      }
    }
    .el-menu-item.is-active {
      background-color: #56a9ff !important;
    }
    .is-opened > .el-submenu__title > .el-icon-arrow-down {
      color: #ffffff;
      font-weight: 500;
      font-size: 18px;
    }
  }
}
</style>
