<template>
  <div class="training-assignment-home">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="老师">
        <el-input v-model="queryParams.lsxm" placeholder="老师"></el-input>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="queryParams.courseName" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="querySubmit">查询</el-button>
        <el-button type="primary" @click="addSubmit">添加</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="entryAllocateData" border style="width: 100%">
      <el-table-column label="老师" prop="teacherName" width="180" />
      <el-table-column label="课程名称" prop="curriculumName" width="180" />
      <el-table-column label="视频名称" prop="videoName" width="180" />
      <el-table-column label="时间" width="180">
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
          >{{ parseTime(scope.row.allocateDate,"{y}-{m}-{d}") }} 至 {{ parseTime(scope.row.trainEndDate,"{y}-{m}-{d}")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配人" prop="allocateTeacherName" width="180" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            :disabled="scope.row.ztbs == 1"
            @click="distriView(scope.$index, scope.row)"
          >查 看</el-button>
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

    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">
              <el-radio v-model="assignmentForm.radio" @change="updeteTeacher" label="1">全部</el-radio>
            </td>
            <td>
              <el-form :model="assignmentForm">
                <el-form-item label="届数" label-width="80px">
                  <el-input v-model="teacherFrom.rybjmc" @input="getTeacher" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="老师" label-width="80px">
                  <el-input v-model="teacherFrom.lsxm" @input="getTeacher" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
            </td>
          </tr>
          <tr>
            <td class="tds">老师</td>
            <td>
              <el-checkbox-group v-model="teacherCheckbox">
                <el-checkbox
                  :label="item.id"
                  v-for="(item,index) in teacherList"
                  :key="index"
                >{{item.lsxm}}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-select
                v-model="assignmentForm.curriculumId"
                @change="getCurriculumManage"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in listCurriculum"
                  :key="item.id"
                  :label="item.curriculumName"
                  :disabled="item.curriculumName == '入职培训'"
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
                <el-checkbox :label="item.dictValue">{{item.dictLabel}}</el-checkbox>
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

    <el-dialog title="查看" :visible.sync="dialogFormVisibleView">
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <!-- <tr>
            <td class="tds">
              <el-radio v-model="assignmentForm.radio" label="1">全部</el-radio>
            </td>
            <td>
              <el-form :model="assignmentForm">
                <el-form-item label="届数">
                  <el-input v-model="assignmentForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="老师" filterable>
                  <el-select v-model="assignmentForm.region" placeholder="请选择">
                    <el-option label="区域一" value="shanghai"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </td>
          </tr>-->
          <tr>
            <td class="tds">老师</td>
            <td>
              <el-checkbox
                :label="item.id"
                v-for="(item,index) in getTrainAllocateDetailQueryList.teacherList"
                :key="index"
                :checked="true"
              >{{item.teacherName}}</el-checkbox>
            </td>
          </tr>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-select v-model="getTrainAllocateDetailQueryList.curriculumId" placeholder="请选择">
                <el-option
                  v-for="item in listCurriculum"
                  :key="item.id"
                  :label="item.curriculumName"
                  :disabled="item.curriculumName == '入职培训'"
                  :value="item.id"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="tds">视频选择</td>
            <td>
              <el-checkbox
                v-for="(item,index) in getTrainAllocateDetailQueryList.videoList"
                :key="index"
                :checked="true"
                :label="item.id"
              >{{item.videoName}}</el-checkbox>
            </td>
          </tr>
          <tr>
            <td class="tds">视频类别</td>
            <td>
              <div
                v-for="(item,index) in getTrainAllocateDetailQueryList.videoTypeDtoList"
                :key="index"
              >
                <el-checkbox :checked="true" :label="item.dictValue">{{item.dictLabel}}</el-checkbox>
                <div style="padding : 20px 10px ;boxsizing : border-box">
                  <div
                    v-for="(list,j) in item.paperList"
                    :key="j"
                    @click="getVideo(list,index)"
                  >{{list.sjmc}}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleView = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCurriculum } from "@/api/basic/curriculum";
import { listHomepage, listTeacher } from "@/api/basic/teacher";
import { trainAllocateHomePage } from "@/api/basic/training-assignment-home";
import {
  entryAllocateList,
  trainAllocate,
  paperGroupQuery,
  getTrainAllocateDetailQuery
} from "@/api/basic/qrientation-assignment";
import { curriculumManage } from "@/api/basic/curriculum";
import { listTrainPaper } from "@/api/basic/trainPaper";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lsxm: "",
        curriculumId: ""
      },
      total: 0,
      assignmentForm: {
        curriculumId: null,
        curriculumName: null,
        trainAllocateVideos: [],
        trainAllocatePapers: [],
        trainAllocateTeachers: []
      },
      dialogFormVisible: false,
      dialogFormVisibleView: false,
      listCurriculum: [],
      curriculumManageList: [],
      teacherList: [],
      teacherFrom: {
        lszzStatusArr: ["1", "3"],
        rybjStatusArr: ["1", "3", "4"],
        rybjmc: null,
        lsxm: null
      },
      entryAllocateData: [],
      teacherCheckbox: [],
      checkbox: [],
      getTrainPaperTopicListTem: [],
      getTrainAllocateDetailQueryList: {}
    };
  },
  created() {
    listCurriculum().then(res => {
      this.listCurriculum = res.rows;
    });
    paperGroupQuery().then(res => {
      this.getTrainPaperTopicListTem = res.data;
    });
  },
  mounted() {
    this.querySubmit();
  },
  methods: {
    querySubmit() {
      trainAllocateHomePage(this.queryParams).then(res => {
        this.entryAllocateData = res.rows;
        this.total = res.total;
        this.queryParams.isAllocate = null;
      });
    },
    getTeacher() {
      listTeacher(this.teacherFrom).then(response => {
        this.teacherList = response.rows;
      });
    },
    updeteTeacher() {
      listTeacher(this.teacherFrom).then(response => {
        this.teacherList = response.rows;
        this.teacherList.forEach(value => {
          this.teacherCheckbox.push(value.id);
        });
      });
    },
    getCurriculumManage() {
      curriculumManage({ id: this.assignmentForm.curriculumId }).then(res => {
        this.curriculumManageList = res.data;
      });
    },
    addSubmit() {
      this.dialogFormVisible = true;
    },
    getVideo(item, index) {
      let count = 0;
      if (this.assignmentForm.trainAllocatePapers.length > 0) {
        this.assignmentForm.trainAllocatePapers.forEach(value => {
          if (value.index === index) {
            this.assignmentForm.trainAllocatePapers[index].paperId = item.id;
            this.assignmentForm.trainAllocatePapers[index].paperName =
              item.sjmc;
            ++count;
          }
        });
      }
      if (count == 0) {
        this.assignmentForm.trainAllocatePapers.push({
          index,
          paperId: item.id,
          paperName: item.sjmc
        });
      }
    },
    reset() {
      this.checkbox = [];
      (this.assignmentForm.trainAllocateVideos = []),
        (this.assignmentForm.trainAllocatePapers = []),
        (this.assignmentForm.trainAllocateTeachers = []);
    },
    distributionSubmit() {
      this.listCurriculum.forEach(value => {
        if (value.id == this.assignmentForm.curriculumId) {
          this.assignmentForm.curriculumName = value.curriculumName;
        }
      });
      this.assignmentForm.trainAllocateTeachers = [];
      this.teacherList.forEach(value => {
        if (this.teacherCheckbox.indexOf(value.id) != -1) {
          this.assignmentForm.trainAllocateTeachers.push({
            teacherId: value.id,
            teacherName: value.lsxm
          });
        }
      });
      let trainAllocateVideosArr = [];
      for (let i = 0; i < this.curriculumManageList.length; i++) {
        this.curriculumManageList[i].videoList.forEach(value => {
          if (this.checkbox.indexOf(value.id) != -1) {
            trainAllocateVideosArr.push({
              videoId: value.id,
              videoName: value.videoName
            });
          }
        });
      }
      this.assignmentForm.trainAllocateVideos = trainAllocateVideosArr;
      trainAllocate(this.assignmentForm).then(res => {
        this.msgSuccess(res.msg);
        this.querySubmit();
        this.dialogFormVisible = false;
      });
    },
    distriView(index, row) {
      this.getTrainAllocateDetailQueryList = {};
      getTrainAllocateDetailQuery(row.allocateId).then(res => {
        this.getTrainAllocateDetailQueryList = res.data;
        this.dialogFormVisibleView = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.training-assignment-home {
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
