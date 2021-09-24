<template>
  <div class="lessonHome">
    <el-form ref="form" :model="form" :inline="true" label-width="80px">
      <el-form-item label="班级">
        <el-select v-model="form.region" placeholder="请选择班级">
          <el-option label="曾都二中21班" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份">
        <el-select v-model="form.region" placeholder="请选择年份">
          <el-option label="2021" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月份">
        <el-select v-model="form.region" placeholder="请选择月份">
          <el-option label="1" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期">
        <el-select v-model="form.region" placeholder="请选择学期">
          <el-option label="上学期" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="Information-bar">
      <div class="bar-top">
        <div class="bar-item">
          <div class="bar-info">
            <img
              style="height : 100%;margin-right : 10px"
              src="https://img2.baidu.com/it/u=3872949038,3863745906&fm=26&fmt=auto"
              alt
            />
            <div class="info-item">
              <h4 style="line-height : 30px;margin : 5px 0">正常进度</h4>
              <Ul style="list-style : none">
                <li>
                  <span>姓名:</span>
                  <span>吴珂</span>
                </li>
                <li>
                  <span>班级:</span>
                  <span>曾都二中21班</span>
                </li>
              </Ul>
            </div>
          </div>
          <!-- <div>
          <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
          </div>-->
        </div>
        <div class="step-item">
          <ul>
            <li>
              <div style="display:flex;justify-content: space-around; margin-bottom : 10px">
                <span
                  style="color : #67c23a;"
                  v-for="(item,index) in arr"
                  :key="index"
                >{{item.name}}</span>
              </div>
              <el-progress
                :text-inside="true"
                color="#67c23a"
                :stroke-width="20"
                :percentage="100"
                status="success"
              ></el-progress>
            </li>
          </ul>
        </div>
      </div>
      <div class="bar-bottom">
        <div class="bar-item">
          <div class="bar-info">
            <img
              style="height : 100%;margin-right : 10px"
              src="https://img2.baidu.com/it/u=3872949038,3863745906&fm=26&fmt=auto"
              alt
            />
            <div class="info-item">
              <h4 style="line-height : 30px;margin : 5px 0">正常进度</h4>
              <Ul style="list-style : none">
                <li>
                  <span>姓名:</span>
                  <span>吴珂</span>
                </li>
                <li>
                  <span>班级:</span>
                  <span>曾都二中21班</span>
                </li>
              </Ul>
            </div>
          </div>
        </div>
        <div class="step-item">
          <ul>
            <li>
              <div style="display:flex;justify-content: space-around; margin-bottom : 10px">
                <span
                  style="color : #f56c6c;"
                  v-for="(item,index) in arr"
                  :key="index"
                >{{item.name}}</span>
              </div>
              <el-progress
                :text-inside="true"
                color="#f56c6c"
                :stroke-width="20"
                :percentage="100"
                status="success"
              ></el-progress>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="outline">
      <h4>课程大纲</h4>
      <div>
        <el-button size="mini" type="primary">课程补充</el-button>
        <el-button size="mini" type="danger">删除补充</el-button>
        <el-button size="mini" type="info">默认课程</el-button>
        <el-button size="mini" type="warning">手动添加</el-button>
      </div>
      <div class="outline-list">
        <ul style="list-style : none">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      arr: [
        {
          num: 100,
          name: "第一课"
        },
        {
          num: 100,
          name: "第二课"
        },
        {
          num: 100,
          name: "第三课"
        },
        {
          num: 100,
          name: "第四课"
        }
      ],
      arr1: [
        {
          num: 10,
          name: "第一课"
        },
        {
          num: 50,
          name: "第二课"
        },
        {
          num: 100,
          name: "第三课"
        },
        {
          num: 100,
          name: "第四课"
        }
      ]
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    }
  }
};
</script>

<style lang="scss">
.lessonHome {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .Information-bar {
    width: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px;
    box-sizing: border-box;
    .bar-top {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .bar-item {
        width: 30%;
        height: 120px;
        background: #67c23a;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .bar-info {
          width: 100%;
          height: 100%;
          display: flex;
          .info-item {
            ul {
              width: 100%;
              margin: 0px;
              padding: 0px;
              li {
                width: 100%;
                line-height: 30px;
              }
            }
          }
        }
      }
      .step-item {
        width: 68%;
        height: 120px;
        ul {
          width: 100%;
          display: flex;
          list-style: none;
          // justify-content: space-between;
          li {
            width: 100%;
          }
        }
      }
    }
    .bar-bottom {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;
      .bar-item {
        width: 30%;
        height: 120px;
        background: #f56c6c;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        color: #fff;
        .bar-info {
          width: 100%;
          height: 100%;
          display: flex;
          .info-item {
            ul {
              width: 100%;
              margin: 0px;
              padding: 0px;
              li {
                width: 100%;
                line-height: 30px;
              }
            }
          }
        }
      }
      .step-item {
        width: 68%;
        height: 120px;
        ul {
          width: 100%;
          display: flex;
          list-style: none;
          // justify-content: space-between;
          li {
            width: 100%;
          }
        }
      }
    }
  }
  .outline {
    width: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 20px;
    .outline-list {
      width: 100%;
      ul {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        li {
          width: 49%;
          height: 400px;
          background: coral;
          margin-top: 30px;
        }
      }
    }
  }
}
</style>
