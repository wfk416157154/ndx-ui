<template>
  <div style="width : 100%; height : 100%;padding : 40px;box-sizing : border-box;">
    <div style="text-align : center">
      <h3>新教师工作清单</h3>
      <h4>使用说明：本清单是接班第一个月的工作清单。每完成一项确认一项。</h4>
    </div>
    <div style="width : 100%;border : 1px solid #aaa;padding : 20px;box-sizing : border-box">
      <h4>日常工作</h4>
      <ul style="list-style : none">
        <li>1.每天按时按要求的填写工作日志并上传教室前后带水印照片</li>
        <li>2.重视课堂管控，依照班规对学生进行公平地奖惩</li>
        <li>3.参考教参和视频认真充分备课，写好教案，不断学习，提高教学能力</li>
        <li>4.布置的作业一定要检查完成，严格要求学生，培养学习习惯</li>
        <li>5.周考月考等考试成绩统计在表格中并及时上传系统</li>
        <li>6.每周至少跟两名学生谈话交流，关爱学生</li>
        <li>7.每月至少主动跟6个不同的家长沟通和联系，沟通时注意方法</li>
        <li>8.每周积极参与督导组讨论，发现问题及时解决问题</li>
        <li>9.每学期完成一次教学简报，期中开始，期末之前上交总部</li>
      </ul>
    </div>
    <div
      style="width : 100%;height : 100%;background : #eee;padding : 20px ; box-sizing : border-box;margin-top : 20px"
    >
      <div>
        <h4>试听课:</h4>
        <ul style="list-style : none">
          <li>1.课前准备:备课，PPT课件，U盘，扩音设备，教室多媒体等</li>
          <li>2.每天统计上课学生人数和名单，报告市场人员或总部</li>
          <li>3.试听课最后一天通知报名和收费方式</li>
        </ul>
      </div>
      <div>
        <h4>组班后:</h4>
        <ul style="list-style : none">
          <li>第一个月内：1. 统计学生基本信息，收集学生照片并上传系统</li>
          <li>2. 制定本班的教学进度计划，交教务老师审核备案（有模板）</li>
          <li>3. 收齐学费，将学费及时的汇回总部</li>
          <li>4. 跟学生商量共同进行教室文化布置（有参考方案）。</li>
        </ul>
      </div>
    </div>
    <div>
      <table
        style="width : 100%;border : 1px solid #eee;margin-top : 20px"
        border="1"
        cellspacing="0"
      >
        <thead>
          <tr>
            <th style="width : 20%">时间周期</th>
            <th>工作任务</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in weekDictType" :key="index">
            <th>{{item.dictLabel}}</th>
            <th>
              <ul v-if="item.dictValue == 'oneWeek'" style="list-style : none">
                <li
                  v-for="(items,index) in oneWeek"
                  :key="index"
                  style="display : flex;justify-content: space-between;align-items: center;"
                >
                  <p>{{items.dictLabel}}</p>
                  <div style="display : flex;justify-content: space-between;align-items: center;"  v-if="showBtn">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addSuccess(items.dictValue,'oneWeek')"
                      :disabled="oneWeekItem.includes(oneWeek[index].dictValue)"
                    >已完成</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      v-if="!oneWeekItem.includes(oneWeek[index].dictValue)"
                      disabled
                    >未完成</el-button>
                  </div>
                </li>
              </ul>
              <ul v-else-if="item.dictValue == 'twoWeek'" style="list-style : none"  >
                <li
                  v-for="(items,index) in twoWeek"
                  :key="index"
                  style="display : flex;justify-content: space-between;align-items: center;"
                >
                  <p>{{items.dictLabel}}</p>
                  <div style="display : flex;justify-content: space-between;align-items: center;" v-if="showBtn">
                    <el-button
                      size="mini"
                      type="success"
                      @click="addSuccess(items.dictValue,'twoWeek')"
                      :disabled="twoWeekItem.includes(twoWeek[index].dictValue)"
                    >已完成</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      v-if="!twoWeekItem.includes(twoWeek[index].dictValue)"
                      disabled
                    >未完成</el-button>
                  </div>
                </li>
              </ul>
              <ul v-else-if="item.dictValue == 'threeWeek'" style="list-style : none">
                <li
                  v-for="(items,index) in threeWeek"
                  :key="index"
                  style="display : flex;justify-content: space-between;align-items: center;"
                >
                  <p>{{items.dictLabel}}</p>
                  <div style="display : flex;justify-content: space-between;align-items: center;" v-if="showBtn" >
                    <el-button
                      size="mini"
                      type="success"
                      @click="addSuccess(items.dictValue,'threeWeek')"
                      :disabled="threeWeekItem.includes(threeWeek[index].dictValue)"
                    >已完成</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      v-if="!threeWeekItem.includes(threeWeek[index].dictValue)"
                      disabled
                    >未完成</el-button>
                  </div>
                </li>
              </ul>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  listTeacherTasklist,
  addTeacherTasklist
} from "@/api/basic/teacherTasklist";
export default {
  data() {
    return {
      weekDictType: [],
      oneWeek: [],
      twoWeek: [],
      threeWeek: [],
      oneWeekItem: "",
      twoWeekItem: "",
      threeWeekItem: "",
      checked1: true,
      // 是否显示按钮
      showBtn:true,
    };
  },
  created() {
    this.getDicts("oneWeek").then(res => {
      this.oneWeek = res.data;
    });
    this.getDicts("twoWeek").then(res => {
      this.twoWeek = res.data;
    });
    this.getDicts("threeWeek").then(res => {
      this.threeWeek = res.data;
    });
    this.getDicts("weekDictType").then(res => {
      this.weekDictType = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listTeacherTasklist({ lsid: this.$store.state.user.glrid }).then(res => {
        if (res.code == 200 && res.rows.length != 0) {
          let result = res.rows[0];
          if(0==result.sfkdj){
            this.msgError("此清单只针对新开班级！如有疑问请联系管理员")
            this.showBtn=false
          }
          this.oneWeekItem = result.oneWeek || "";
          this.twoWeekItem = result.twoWeek || "";
          this.threeWeekItem = result.threeWeek || "";
        }
      });
    },
    addSuccess(value, key) {
      if (value && key) {
        addTeacherTasklist({
          [key]: value,
          lsid: this.$store.state.user.glrid
        }).then(res => {
          if (res.code == 200) {
            this.msgSuccess("成功 : 操作成功");
            this.getList();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
th,
td {
  border: 1px solid #aaa;
  padding: 20px;
  box-sizing: border-box;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
}
</style>
