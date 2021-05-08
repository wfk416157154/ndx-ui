<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>老师信息</span>
          </div>
          <div class="wrap-info">
            <div class="text-center">
              <img
                src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                alt
              />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                用户名称
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                手机号码
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                所属部门
                <div class="pull-right" v-if="user.dept">{{ user.dept.deptName }} / {{ postGroup }}</div>
              </li>
              <li class="list-group-item">
                所属角色
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>证件资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人身份证正反扫描照" name="grsfzsmz">
              <div style="float:left; margin-right : 10px;margin-bottom : 10px" v-for="(item,index) in 3" :key="index">
                <img
                  width="200px"
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                  alt
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="毕业证扫描件" name="byzsmj">
              <div style="float:left; margin-right : 10px;margin-bottom : 10px" v-for="(item,index) in 2" :key="index">
                <img
                  width="200px"
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                  alt
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="学位证扫描件" name="xwzsmj">
              <div style="float:left; margin-right : 10px;margin-bottom : 10px" v-for="(item,index) in 1" :key="index">
                <img
                  width="200px"
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                  alt
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="个人证件照白底蓝底" name="grzjzbdld">
              <div style="float:left; margin-right : 10px;margin-bottom : 10px" v-for="(item,index) in 3" :key="index">
                <img
                  width="200px"
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                  alt
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="日语登记证书" name="rydjzs">
              <div style="float:left; margin-right : 10px;margin-bottom : 10px" v-for="(item,index) in 7" :key="index">
                <img
                  width="200px"
                  src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2356019866,341589594&fm=26&gp=0.jpg"
                  alt
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "teacherInformation",

  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "grsfzsmz"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {}
  }
};
</script>

<style lang="scss" scoped>
.wrap-info {
  position: relative;
  .text-center {
    width: 150px;
    height: 150px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }

}
</style>
