<template>
  <div id="app">
    <div v-show="amapShow" class="amap-demo">
      <el-amap
        ref="map"
        vid="amap"
        :plugin="plugin"
        :amap-manager="amapManager"
        :zoom="zoom"
        :center="center"
      >
        <el-amap-circle
          ref="amapCircle"
          :center="marker.center"
          :radius="marker.radius"
          :strokeColor="marker.strokeColor"
          :fill-color="marker.fillColor"
          :fill-opacity="marker.fillOpacity"
          :events="marker.events"
        ></el-amap-circle>
      </el-amap>
    </div>
    <!-- <div style="height:20%;padding-top:20px;" v-show="!amapShow">
      <el-steps direction="vertical" :active="active">
        <el-step title="上班打卡">
          <template slot="description" v-if="currentStartPosition">
            <div class="slot-style">
              打卡时间:<span>{{ workStartTime }}</span>
            </div>
            <div>
              <i class="el-icon-location"></i
              ><span>{{ currentStartPosition }}</span>
            </div>
          </template>
        </el-step>
        <el-step title="下班打卡">
          <template slot="description" v-if="currentEndPosition">
            <div class="slot-style">
              打卡时间:<span>{{ workEndTime }}</span>
            </div>
            <div>
              <i class="el-icon-location"></i
              ><span>{{ currentEndPosition }}</span>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>-->
    <div class="check" v-show="amapShow">
      <el-button
        circle
        :type="buttonType"
        @click="clickPositon"
        :disabled="buttonStatus"
        class="buttonStyle"
      >
        <div style="font-size:23px;">{{ clickName }}</div>
        <div style="font-size:20px; margin-top: 10px;">{{ nowTime }}</div>
      </el-button>
      <el-button type="text" @click="checkMap">查看地图</el-button>
    </div>
    <div class="toolbar" v-show="amapShow">
      <div>当前位置：{{ currentPosition }}</div>
      <div>精度范围:{{ range }}</div>
      <div>定位结果的来源:{{ location_type }}</div>
      <div>是否经过坐标纠偏:{{ isConverted }}</div>
      <!-- <div>key:c91607badc2777c98085643173b9c1ef</div> -->
      <div>
        <span v-if="loaded">location: lng = {{ lng }} lat = {{ lat }}</span>
        <span v-else>正在定位</span>
      </div>
      <div>是否在打卡范围内：{{ this.checkposition }}</div>
      <div>
        <el-button @click="getLocation">重新定位</el-button>
        <el-button @click="getInfo">获取位置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { AMapManager } from "vue-amap";
import axios from "axios";
let amapManager = new AMapManager();
export default {
  data() {
    let self = this;
    return {
      isConverted: "",
      location_type: "",
      range: "",
      examp: null, //地图实例
      clickName: "上班打卡",
      active: 1,
      workStartTime: "",
      workEndTime: "",
      noworkTime: "",
      buttonStatus: false,
      buttonType: "primary",
      nowTime: "",
      amapShow: true,
      checkposition: "",
      amapManager,
      zoom: 12,
      msg: "vue-amap向你问好！",
      center: [121.59996, 31.197646],
      lng: 0,
      currentStartPosition: "",
      currentEndPosition: "",
      currentPosition: "",
      lat: 0,
      loaded: false,
      marker: {
        center: [116.43137, 39.94024],
        radius: 100,
        fillOpacity: 0.5,
        fillColor: "#4196ff",
        strokeColor: "#4196ff",
        events: {
          click: () => {
            // alert('click')
          }
        }
      },
      events: {
        // init: o => {
        //   console.log(o.getCenter());
        //   console.log(this.$refs.map.$$getInstance());
        //   o.getCity(result => {
        //     console.log(result);
        //   });
        // },
        moveend: () => {},
        zoomchange: () => {},
        click: () => {
          alert("map clicked");
        }
      },
      plugin: [
        {
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          // timeout: 100, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          useNative: true,
          convert: true,
          zoomToAccuracy: true,
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
          extensions: "all",
          pName: "Geolocation", //定位
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              self.examp = o;
              self.getLocation();

              // console.log("初始化");
              // o.getCurrentPosition((status, result) => {
              //   console.log(result);
              //   self.range = result.accuracy;
              //   self.isConverted = result.isConverted;
              //   self.location_type = result.location_type;
              //   self.currentPosition = result.formattedAddress;
              //   if (result && result.position) {
              //     console.log(status, result);
              //     self.lng = result.position.lng; //设置经度
              //     self.lat = result.position.lat; //设置维度
              //     self.center = [self.lng, self.lat]; //设置中心坐标
              //     self.marker.center = self.center;
              //     // self.marker.center = [self.lng, self.lat]
              //     self.loaded = true;
              //     self.$nextTick(() => {
              //       self.checkPosition();
              //       self.getInfo();
              //       // self.getLocation();
              //     });
              //   }
              // });
            },
            click() {
              // console.log(o);
            }
          }
        }
        // 'ToolBar'
        // {
        //   pName: 'MapType',
        //   defaultType: 0,
        //   events: {
        //     init(o) {
        //       console.log(o)
        //     }
        //   }
        // }
      ]
    };
  },
  methods: {
    getInfo() {
      axios
        .get(
          // "https://restapi.amap.com/v3/geocode/regeo?key=c91607badc2777c98085643173b9c1ef&location=155.898651,39.244955"
          `https://restapi.amap.com/v3/geocode/regeo?location=${this.center[0]},${this.center[1]}&key=c91607badc2777c98085643173b9c1ef`
        )
        .then(res => {
          console.log(res.data.regeocode.formatted_address);
          this.currentPosition = res.data.regeocode.formatted_address;
        });
    },
    checkMap() {
      this.amapShow = true;
    },
    checkPosition() {
      let circle = this.$refs.amapCircle.$$getInstance();
      let result = circle.contains(this.center);
      if (result) {
        this.checkposition = "是";
      } else {
        this.checkposition = "否";
      }
    },
    clickPositon() {
      if (!this.workStartTime) {
        this.workStartTime = this.nowTime;
        this.active = 2;
        this.currentStartPosition = this.currentPosition;
        this.clickName = "下班打卡";
      } else {
        this.workEndTime = this.nowTime;
        this.currentEndPosition = this.currentPosition;
      }
    },
    //重新获取地理位置
    getLocation() {
      let self = this;
      // console.log(AMap);
      // AMap.service(["AMap.Geolocation"], () => {
      // sessionStorage中没有缓存，则开始定位
      // const geolocation = new AMap.Geolocation({
      //   enableHighAccuracy: false, //是否使用高精度定位，默认:true
      //   timeout: 5000 //超过5秒后停止定位，默认：无穷大
      // });
      // let geolocation = this.$refs.map.$$getInstance();
      //  获取位置信息
      console.log("重新定位");

      this.examp.getCurrentPosition((status, result) => {
        console.log(result);
        self.range = result.accuracy;
        self.isConverted = result.isConverted;
        self.location_type = result.location_type;
        self.currentPosition = result.formattedAddress;
        if (result && result.position) {
          console.log(status, result);
          self.lng = result.position.lng; //设置经度
          self.lat = result.position.lat; //设置维度
          self.center = [self.lng, self.lat]; //设置中心坐标
          self.marker.center = [self.lng, self.lat];
          self.loaded = true;
          self.$nextTick(() => {
            self.checkPosition();
            self.getInfo();
          });
        }
      });
      // 获取位置信息完成触发事件
      // });
    }
  },
  created() {
    let _this = this;
    setInterval(function() {
      var time = new Date(); //获取当日的日期和时间
      var h = time.getHours(); //获取Date对象当日的小时
      var m = time.getMinutes(); //获取Date对象当日的分钟
      var s = time.getSeconds(); //获取Date对象当日的小时毫秒
      _this.nowTime = h + ":" + m + ":" + s; //使用innerHTML将内容写p标签DOM节点，不会导致页面重绘。
      // 附：document.write()和document.innerHTML()的区别：document.write()是直接写入页面的内容流，如果写之前没有调用document.open，浏览器会自动调用open。每次写完关闭之后重新调用该函数，会导致页面被重写。
    }, 1000);
  }
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.getlocation {
  margin-left: 4rem;
  font-size: 15px;
  font-weight: 500;
  padding-top: 0.3rem;
}
.amap-demo {
  height: 50%;
}
.check {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.buttonStyle {
  width: 150px;
  height: 150px;
}
.slot-style {
  font-size: 15px;
  padding-bottom: 5px;
}
.toolbar {
  height: 10%;
}
</style>
