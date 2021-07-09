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
              <img :src="userInfo.lstx" alt />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                老师姓名
                <div class="pull-right">{{ userInfo.lsxm }}</div>
              </li>
              <li class="list-group-item">
                性别
                <div class="pull-right">
                  <span v-if="userInfo.xb == '0'">女</span>
                  <span v-else>男</span>
                </div>
              </li>
              <li class="list-group-item">
                联系电话
                <div class="pull-right">{{ userInfo.dhhm }}</div>
              </li>
              <li class="list-group-item">
                毕业学校
                <div class="pull-right">{{userInfo.byxx}}</div>
              </li>
              <li class="list-group-item">
                毕业专业
                <div class="pull-right">{{ userInfo.byzy }}</div>
              </li>
              <li class="list-group-item">
                日语等级
                <div class="pull-right">{{ userInfo.kzzd3 }}</div>
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
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files1"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList1"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="毕业证扫描件" name="byzsmj">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files2"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList2"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="学位证扫描件" name="xwzsmj">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files3"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList3"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="个人证件照白底蓝底" name="grzjzbdld">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files4"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList4"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="日语登记证书" name="rydjzs">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files5"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList5"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="教师资格证" name="jszgz">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files6"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList6"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="其他证书" name="qtzs">
              <div
                style="float:left; margin-right : 10px;margin-bottom : 10px"
                v-for="(item,index) in files7"
                :key="index"
              >
                <div class="demo-image__preview">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item.wjlj"
                    :preview-src-list="urlList7"
                  ></el-image>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTeacher } from "@/api/basic/teacher";
import { selectFileList } from "@/api/tool/common";
import { secretKey } from "@/utils/tools";
export default {
  name: "teacherInformation",

  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "grsfzsmz",
      id: "", // 老师id
      userInfo: {},
      files1: [],
      files2: [],
      files3: [],
      files4: [],
      files5: [],
      files6: [],
      files7: [],
      urlList1: [],
      urlList2: [],
      urlList3: [],
      urlList4: [],
      urlList5: [],
      urlList6: [],
      urlList7: []
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getUser(this.id);
  },
  methods: {
    /** 修改按钮操作 */
    getUser(id) {
      getTeacher(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改老师信息";
        this.userInfo = response.data;
        this.selectPhotoList(
          (this.form.grsfzsmz = this.form.grsfzsmz || secretKey()),
          "files1",
          "urlList1"
        ); // 个人身份证正反扫描照
        this.selectPhotoList(
          (this.form.byzsmj = this.form.byzsmj || secretKey()),
          "files2",
          "urlList2"
        ); // 毕业证扫描件
        this.selectPhotoList(
          (this.form.xwzsmj = this.form.xwzsmj || secretKey()),
          "files3",
          "urlList3"
        ); // 学位证扫描件
        this.selectPhotoList(
          (this.form.grzjzbdld = this.form.grzjzbdld || secretKey()),
          "files4",
          "urlList4"
        ); // 个人证件照白底蓝底
        this.selectPhotoList(
          (this.form.rydjzs = this.form.rydjzs || secretKey()),
          "files5",
          "urlList5"
        ); // 日语登记证书
        this.selectPhotoList(
          (this.form.jszgz = this.form.jszgz || secretKey()),
          "files6",
          "urlList6"
        ); // 教师资格证
        this.selectPhotoList(
          (this.form.qtzs = this.form.qtzs || secretKey()),
          "files7",
          "urlList7"
        ); // 其他证书
      });
    },
    // 查询证件照
    selectPhotoList(glid, file, urlList) {
      let kzzdJson = {
        kzzd1: glid
      };
      selectFileList(kzzdJson).then(res => {
        this.photoNum = res.total;
        this[file] = res.rows;
        if (res.rows.length > 0) {
          res.rows.forEach(value => {
            this[urlList].push(value.url);
          });
        }
      });
    }
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
