<template>
  <div class="Whole-view">
    <div class="Whole-right-item">
      <div class="wrap-Whole" v-for="(item,index) in WholeList.children" :key="index">
        <ul class="ksItem">
          <li>
            <div style="display :flex; align-items : center">
              <i class="el-icon-d-arrow-left"></i>
              <h3 style="margin :5px 5px">{{ WholeList.name}} {{item.name}}</h3>
              <i class="el-icon-d-arrow-right"></i>
            </div>
            <br />
            <div v-for="(list,index) in item.children" :key="index">
              <h4
                style="margin :5px 0px ;color : #67C23A; margin-left : 20px"
              >{{++index}} ) {{list.name}}</h4>
              <div
                style="display: flex;justify-content: space-between;align-items: center"
                v-for="(items,j) in list.children"
                :key="j"
              >
                <div style="width : 98%;">
                  <div
                    style=" display: flex;justify-content: space-between;align-items: center;margin-left : 60px"
                  >
                    <div>
                      <h4 style="margin : 10px 0px ;color : #E6A23C">{{items.name}}</h4>
                    </div>
                    <div>
                      <h4
                        style="margin : 10px 0px;color : #E6A23C"
                      >{{formatTime(items.ksrq)}} - {{formatTime(items.jzrq)}}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { queryGenerateTeachingPlanData } from "@/api/teaching/generate";
export default {
  data() {
    return {
      WholeList: {}
    };
  },
  props: ["item"],
  methods: {
    toGrade() {
      if (this.item && typeof this.item.zfx == "object") {
        this.item.zfx = this.item.zfx.join(",");
      }
      if (this.item.rybjid) {
        queryGenerateTeachingPlanData(this.item).then(res => {
          if (res.code == 200 && res.data.allData.length > 0) {
            this.WholeList = res.data.allData[0];
          } else {
            this.WholeList = [];
          }
        });
      }
    },
    formatTime(time) {
      time = new Date(time);
      let F = time.getFullYear().toString();
      let M = String(time.getMonth() + 1);
      let D = time.getDate().toString();
      M = M.length == 1 ? `0${M}` : M;
      D = D.length == 1 ? `0${D}` : D;
      return F + "-" + M + "-" + D;
    }
  }
};
</script>

<style lang="scss" scoped>
.Whole-view {
  width: 100%;
  height: 100%;
  .Whole-right-item {
    width: 100%;
    .wrap-Whole {
      width: 100%;
      .ksItem {
        width: 100%;
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          // display: flex;
          // justify-content: space-between;
          // align-items: center;
        }
      }
    }
  }
}
</style>

