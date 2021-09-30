<template>
  <div class="teaching-plan-list">
    <el-form :inline="true">
      <el-form-item label="教材">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择教材">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开班时间">
        <el-date-picker
          v-model="teachingPlanForm.value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="学期">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择学期">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所需天数">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择学期">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="届数">
        <el-input v-model="teachingPlanForm.input" placeholder="请输入所需天数"></el-input>
      </el-form-item>
      <el-form-item label="校区">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择校区">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择班级">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老师">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择老师">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学进度">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="教学内容">
        <el-select filterable v-model="teachingPlanForm.value" placeholder="请选择教学内容">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="central-navigation">
      <ul>
        <li>
          <el-button type="primary" class="el-icon-plus" size="mini">新增教学计划</el-button>
        </li>
        <li>
          <div style="display : flex;width : 100%">
            <div style="width : 180px">进度条颜色标注</div>
            <ul class="navigation-title">
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #409EFF;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">超前</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #67C23A;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">正常</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #F56C6C;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">滞后</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #E6A23C;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">复习</span>
              </li>
            </ul>
          </div>
          <div style="display : flex;width : 100%">
            <div style="width : 180px">班级信息卡标注</div>
            <ul class="navigation-title">
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #409EFF;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">测验</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #67C23A;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">新课</span>
              </li>
              <li>
                <span
                  style="display : inline-block;width : 10px;height : 10px;background : #E6A23C;margin-right : 5px"
                ></span>
                <span style="isplay : inline-block;margin-right : 10px">复习</span>
              </li>
              <li></li>
            </ul>
          </div>
        </li>
        <li>
          <div style="display : flex; align-items: center;">
            <div style="margin-right : 20px">
              <h5>教学计划</h5>
            </div>
            <div>
              <span
                style="cursor: pointer;"
                :class="['SemesterView' == ifContent ? 'active-color' : '']"
                @click="toComponent('SemesterView')"
              >学期</span>
              <el-divider direction="vertical"></el-divider>
              <span
                style="cursor: pointer;"
                :class="['MonthView' == ifContent ? 'active-color' : '']"
                @click="toComponent('MonthView')"
              >月</span>
              <el-divider direction="vertical"></el-divider>
              <span
                style="cursor: pointer;"
                :class="['WholeView' == ifContent ? 'active-color' : '']"
                @click="toComponent('WholeView')"
              >全部</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="teaching-plan-item">
      <ul class="teaching-list-content">
        <li v-for="(item,index) in 10" :key="index">
          <div class="content-top">
            <div class="content-top-left">
              <div class="info-left">
                <h4>陇南扬名20级22届（高二上）</h4>
                <div>
                  <span>当前课程 :</span>
                  <span>第三课</span>
                </div>
                <div>
                  <span>时间区间 :</span>
                  <span>2020-08-01至2022-06-07</span>
                </div>
                <div>
                  <span>老师: 张三</span>
                  <span>教学进度: 超前</span>
                  <span>新课</span>
                </div>
              </div>
              <div class="info-right">
                <el-button size="mini" style="width :80px">修正|查看</el-button>
                <br />
                <el-button size="mini" style="width :80px">调用</el-button>
                <br />
                <el-button size="mini" style="width :80px">导出</el-button>
              </div>
            </div>
            <div class="content-top-right">
              <el-scrollbar style="height:100%">
                <ul>
                  <li v-for="(item,index) in 10" :key="index">
                    <h4>异常记录</h4>
                    <div>
                      <span>时间 :</span>
                      <span>2021-08-09</span>
                    </div>
                    <div>
                      <span>记录 :</span>
                      <span>张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。张三将高二下学期9月第一周的课进行了延后操作。</span>
                    </div>
                    <div>
                      <span>原因 :</span>
                      <span>学校运动会</span>
                    </div>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
          </div>
          <div class="content-bottom">
            <div class="content-sj">
              <ul>
                <li v-for="(item,index) in 7" :key="index">
                  <el-divider>10月</el-divider>
                </li>
              </ul>
            </div>
            <div
              class="progress"
              style="width : 100% ;height : 15px;background : #eee;border-radius: 10px;"
            >
              <div style="width : 30%; height : 100%;background : #909399"></div>
              <div style="width : 30%; height : 100%;background : #409EFF"></div>
              <div style="width : 30%; height : 100%;background : #67C23A"></div>
              <div style="width : 40%; height : 100%;background : #E6A23C"></div>
              <div style="width : 10%; height : 100%;background : #F56C6C"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teachingPlanForm: {},
      ifContent: null
    };
  },
  methods: {
    // 组件
    toComponent(value) {
      this.ifContent = value;
    }
  }
};
</script>

<style lang="scss">
.teaching-plan-list {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .central-navigation {
    width: 100%;
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      li {
        width: 30%;
        .navigation-title {
          width: 100%;
          li {
            width: 100%;
            float: left;
          }
        }
        .active-color {
          color: #409eff;
        }
      }
    }
  }
  .teaching-plan-item {
    width: 100%;
    height: 100%;
    -webkit-box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #e6ebf5;
    padding: 20px 30px;
    box-sizing: border-box;
    .teaching-list-content {
      width: 100%;
      height: 100%;
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        width: 100%;
        height: 100%;
        border: 2px solid #ccc;
        margin-bottom: 20px;
        .content-top {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          .content-top-left {
            width: 40%;
            height: 100%;
            display: flex;
            padding: 20px;
            box-sizing: border-box;
            border: 2px solid #ccc;
            border-left: none;
            border-top: none;
            border-bottom: none;
            .info-left {
              width: 65%;
              height: 100%;
              h4 {
                margin: 5px 0px;
              }
              div {
                span {
                  line-height: 30px;
                }
              }
            }
            .info-right {
              width: 40%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          }
          .content-top-right {
            width: 100%;
            height: 100%;
            // border-bottom: 2px solid #ccc;
            padding-top: 10px;
            .el-scrollbar__wrap {
              overflow-x: hidden;
            }
            ul {
              width: 600px;
              height: 180px;
              list-style: none;
              white-space: nowrap;
              margin: 0;
              padding: 0;
              li {
                width: 300px;
                height: 180px;
                margin-right: 20px;
                display: inline-block;
                padding: 10px;
                box-sizing: border-box;
                h4 {
                  margin: 0;
                  margin-bottom: 5px;
                }
                div {
                  width: 100%;
                  padding-left: 10px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  span {
                    white-space: pre-wrap !important;
                    line-height: 30px;
                    color: olive;
                  }
                }
              }
              li:nth-child(1) {
                margin-left: 20px;
              }
            }
          }
        }
        .content-bottom {
          widows: 100%;
          height: 80px;
          // background: crimson;
          border-top: 2px solid #ccc;
          padding: 0 10px;
          box-sizing: border-box;
          .progress {
            display: flex;
            margin-top: 0;
          }
          .content-sj {
            width: 100%;
            margin-top: 10px;
            ul {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: space-between;
              list-style: none;
              text-align: center;
              li {
                height: 45px;
                border: 1px solid #ccc;
                border-top: 0;
                border-bottom: 0;
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
