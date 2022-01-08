<template>
  <div class="qrientation-assignment">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="queryParams.lsxm" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">查询</el-button>
        <el-button type="success" @click="assignedSubmit">已分配</el-button>
        <el-button type="danger" @click="unassignedSubmit">未分配</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="entryAllocateData" border style="width: 100%">
      <el-table-column label="老师" prop="lsxm" width="180" />
      <el-table-column label="课程名称" prop="curriculumName" width="180" />
      <el-table-column label="视频名称" prop="videoName" width="180" />
      <el-table-column label="时间" width="180">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ parseTime(scope.row.allocateDate,"{y}-{m}-{d}") }} 至 {{ parseTime(scope.row.trainEndDate,"{y}-{m}-{d}")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="zt" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.zt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配人" prop="allocateTeacherName" width="180" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            :disabled="scope.row.ztbs == 1"
            @click="distribution(scope.$index, scope.row)"
          >分 配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="querySubmit"
    />

    <el-dialog title="分配" :visible.sync="dialogFormVisible">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">老师</td>
            <td>{{lsName}}</td>
          </tr>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-select
                v-model="distributionForm.curriculumId"
                @change="getCurriculumManage"
                filterable
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in listCurriculum"
                  :key="item.id"
                  :label="item.curriculumName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="tds">课程选择</td>
            <td>
              <div v-for="(item,index) in curriculumManageList" :key="index">
                <h4>{{item.dictLabel}}</h4>
                <el-checkbox-group
                  v-if=" item.videoList && item.videoList.length > 0"
                  v-model="checkbox"
                >
                  <el-checkbox
                    v-for="(list,j) in item.videoList"
                    :key="j"
                    :label="list.id"
                  >{{list.videoName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </td>
          </tr>
          <tr>
            <td class="tds">视频类别</td>
            <td>
              <div v-for="(item,index) in getTrainPaperTopicListTem" :key="index">
                <h4>{{item.dictLabel}}</h4>
                <div style="padding : 20px 10px ;boxsizing : border-box">
                  <el-radio-group v-model="item[index]">
                    <div v-for="(list,j) in item.paperList" :key="j" @click="getVideo(list,index)">
                      <el-radio :label="list.id">
                        <span>{{list.sjmc}}</span>
                      </el-radio>
                    </div>
                  </el-radio-group>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  entryAllocateList,
  trainAllocate,
  paperGroupQuery
} from "@/api/basic/qrientation-assignment";
import { listCurriculum } from "@/api/basic/curriculum";
import { curriculumManage } from "@/api/basic/curriculum";
import { listTrainPaper } from "@/api/basic/trainPaper";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAllocate: "",
        lsxm: ""
      },
      total: 0,
      dialogFormVisible: false,
      distributionForm: {
        curriculumId: null,
        curriculumName: null,
        trainAllocateVideos: [],
        trainAllocatePapers: [],
        trainAllocateTeachers: [{}]
      },
      checkbox: [],
      entryAllocateData: [],
      listCurriculum: [],
      curriculumManageList: [],
      getTrainPaperTopicListTem: [],
      lsName: ""
    };
  },
  created() {
    listCurriculum().then(res => {
      this.listCurriculum = res.rows;
      this.listCurriculum.forEach(value => {
        if (value.curriculumName == "入职培训") {
          this.distributionForm.curriculumId = value.id;
          this.distributionForm.curriculumName = value.curriculumName;
          this.getCurriculumManage();
        }
      });
    });
    paperGroupQuery().then(res => {
      this.getTrainPaperTopicListTem = res.data;
    });
  },
  methods: {
    querySubmit() {
      entryAllocateList(this.queryParams).then(res => {
        this.entryAllocateData = res.rows;
        this.queryParams.isAllocate = null;
      });
    },
    assignedSubmit() {
      this.queryParams.isAllocate = 1;
      this.querySubmit();
    },
    unassignedSubmit() {
      this.queryParams.isAllocate = 0;
      this.querySubmit();
    },
    getCurriculumManage() {
      curriculumManage({ id: this.distributionForm.curriculumId }).then(res => {
        this.curriculumManageList = res.data;
      });
    },
    distribution(index, row) {
      this.reset();
      this.lsName = row.lsxm;
      this.distributionForm.trainAllocateTeachers[0].teacherId = row.lsid;
      this.distributionForm.trainAllocateTeachers[0].teacherName = row.lsxm;
      this.dialogFormVisible = true;
    },
    getVideo(item, index) {
      let count = 0;
      if (this.distributionForm.trainAllocatePapers.length > 0) {
        this.distributionForm.trainAllocatePapers.forEach(value => {
          if (value.index === index) {
            this.distributionForm.trainAllocatePapers[index].paperId = item.id;
            this.distributionForm.trainAllocatePapers[index].paperName =
              item.sjmc;
            ++count;
          }
        });
      }
      if (count == 0) {
        this.distributionForm.trainAllocatePapers.push({
          index,
          paperId: item.id,
          paperName: item.sjmc
        });
      }
    },
    reset() {
      this.checkbox = [];
      (this.distributionForm.trainAllocateVideos = []),
        (this.distributionForm.trainAllocatePapers = []),
        (this.distributionForm.trainAllocateTeachers = [{}]);
    },
    distributionSubmit() {
      let trainAllocateVideosArr = [];
      this.curriculumManageList.videoList.forEach(value => {
        if (this.checkbox.indexOf(value.id) != -1) {
          trainAllocateVideosArr.push({
            videoId: value.id,
            videoName: value.videoName
          });
        }
      });
      this.distributionForm.trainAllocateVideos = trainAllocateVideosArr;
      trainAllocate(this.distributionForm).then(res => {
        this.msgSuccess(res.msg);
        this.querySubmit();
        this.dialogFormVisible = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.qrientation-assignment {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 20%;
  }
}
</style>
