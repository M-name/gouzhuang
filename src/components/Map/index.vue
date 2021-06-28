<template>
  <div>
    <div class="amap-wrapper">
      <el-amap
        class="amap-box"
        :plugin="plugin"
        :center="center"
        :zoom="zoom"
        :vid="'amap-vue'"
      ></el-amap>
    </div>
    <!-- <div class="toolbar">
        <span v-if="loaded">
        location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    let self = this;
    return {
      zoom:17,
      center: [120.078509,30.349092],
      lng: 0,
      lat: 0,
      loaded: false,
      plugin: [   //一些工具插件
        // {
        //   pName: 'Geolocation',   //定位
        //   events: {
        //     init(o) {
        //       // o 是高德地图定位插件实例
        //       o.getCurrentPosition((status, result) => {
        //         console.log(status, result,'13345678')
        //         if (result && result.position) {
        //           self.lng = result.position.lng;             //设置经度
        //           self.lat = result.position.lat;             //设置维度
        //           self.center = [self.lng, self.lat];         //设置坐标
        //           self.loaded = true;                         //load
        //           self.$nextTick();                           //页面渲染好后
        //         }
        //       })
        //     }
        //   }
        // },
        {
          pName: 'ToolBar',  //工具栏
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
     //    {
     //      pName: 'OverView',  //鹰眼
     //      events: {
     //        init(instance) {
     //          // console.log(instance);
     //        }
     //      }
     //    },
        // {
        //   pName: 'MapType',  //地图类型
        //   defaultType: 0,
        //   events: {
        //     init(instance) {
        //       // console.log(instance);
        //     }
        //   }
        // }
      ]
    };
  },
};
</script>

<style>
 * { touch-action: pan-y; } 
.amap-wrapper {
  /* width: 500px; */
  height: 460px;
}
 .amap-logo,.amap-copyright { display:none !important; }
</style>