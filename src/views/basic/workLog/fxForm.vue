<template>
  <div>
    <div>
      <!-- <el-radio
        v-model="checkList"
        @change="seloectTopNode(item.id,1)"
        :label="item.id"
        v-for="(item,index) in topTemplate"
        :key="index"
      >{{item.jdmc}}</el-radio>-->
      <el-button
        type="success"
        size="mini"
        @click="seloectTopNode(item.id,1)"
        v-for="(item,index) in topTemplate"
        :key="index"
        plain
      >{{item.jdmc}}</el-button>
    </div>
    <el-dialog title="添加复习" :visible.sync="dialogTableVisible" :append-to-body="true">
      <div v-if="towTemolate.type == '2'">
        <el-checkbox-group v-model="towTemolate.idList">
          <el-checkbox
            :label="item.id"
            v-for="(item,index) in towTemolate.subList"
            :key="index"
            :checked="item.sfgx"
          >{{item.jdmc}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-else>
        <el-form ref="form" :inline="true">
          <el-form-item label="章" label-width="180px">
            <el-select
              v-model="towTemolate.idList"
              @change="seloectTopNode(towTemolate.idList,2)"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in towTemolate.subList"
                :key="index"
                :label="item.jdmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="lastTemplate.type == '1'">
            <el-form-item label="节" label-width="180px">
              <div>
                <el-select
                  v-model="lastTemplate.idList"
                  @change="seloectTopNode(lastTemplate.idList,3)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in lastTemplate.subList"
                    :key="index"
                    :label="item.jdmc"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </el-form-item>
            <div>
              <el-checkbox-group v-model="zsdTemplate.idList">
                <el-checkbox
                  :label="item.id"
                  v-for="(item,index) in zsdTemplate.subList"
                  :key="index"
                  :checked="item.sfgx"
                >{{item.jdmc}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>

          <div v-else>
            <el-checkbox-group v-model="lastTemplate.idList">
              <el-checkbox
                :label="item.id"
                v-for="(item,index) in lastTemplate.subList"
                :key="index"
                :checked="item.sfgx"
              >{{item.jdmc}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSbmit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  teachingReview,
  subListForWogLog,
  batchSaveReviewProgress
} from "@/api/basic/basicTeacherWorkLog";
export default {
  data() {
    return {
      checkList: [1],
      queryParams: {
        workLogId: null,
        rybjid: null,
        lsid: this.$store.state.user.glrid
      },
      dialogTableVisible: false,
      checkList: null,
      topTemplate: [],
      towTemolate: [],
      lastTemplate: [],
      zsdTemplate: []
    };
  },
  props: ["rzid", "bjid", "dialogFormVisible"],
  mounted() {
    if (this.rzid && this.bjid) {
      this.queryParams.workLogId = this.rzid;
      this.queryParams.rybjid = this.bjid;
      this.getTeachingReview();
    }
  },
  methods: {
    getTeachingReview() {
      teachingReview({ rybjid: this.queryParams.rybjid, cjlx: "1" }).then(
        res => {
          if (res.code == 200) {
            this.topTemplate = res.data;
          }
        }
      );
    },
    seloectTopNode(id, cj) {
      if (id) {
        this.queryParams.reviewId = id;
      }
      if (cj == 1) {
        this.towTemolate = [];
        this.lastTemplate = [];
        this.zsdTemplate = [];
      } else if (cj == 2) {
        this.lastTemplate = [];
        this.zsdTemplate = [];
      } else if (cj == 3) {
        this.zsdTemplate = [];
      }
      subListForWogLog(this.queryParams).then(res => {
        if (res.code == 200) {
          if (cj == 1) {
            this.towTemolate = res.data;
          } else if (cj == 2) {
            this.queryParams.fxzlid = id;
            this.lastTemplate = res.data;
          } else if (cj == 3) {
            this.zsdTemplate = res.data;
          }
        }
      });
      this.dialogTableVisible = true;
    },
    saveSbmit() {
      let arr = [];
      if (this.towTemolate.type == "2") {
        this.queryParams.reviewParentId = this.towTemolate.subList[0].parentId;
        arr = arr.concat(this.towTemolate.idList);
      }
      if (this.lastTemplate.type == "2") {
        this.queryParams.reviewParentId = this.lastTemplate.subList[0].parentId;
        arr = arr.concat(this.lastTemplate.idList);
      }
      if (this.zsdTemplate.type == "2") {
        this.queryParams.reviewParentId = this.zsdTemplate.subList[0].parentId;
        arr = arr.concat(this.zsdTemplate.idList);
      }
      this.queryParams.idList = arr;
      batchSaveReviewProgress(this.queryParams).then(res => {
        if (res.code == 200) {
          this.msgSuccess("成功 : 保存成功");
          this.dialogTableVisible = false;
        }
      });
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
