<template>
  <div class="semester-view">
    <div class="wrap-right-item">
      <vxe-toolbar ref="xToolbar" :loading="loading">
        <template #buttons>
          <vxe-button status="danger" icon="vxe-icon--close" content="删除数据" @click="deleteSelectEvent"></vxe-button>
          <vxe-button status="primary" icon="vxe-icon--check" content="提交(将数据保存)" @click="saveEvent"></vxe-button>
          <vxe-button status="warning" icon="vxe-icon--refresh" content="更新学期数据" @click="addOrUpdateQueryTermData"></vxe-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        border
        resizable
        show-overflow
        keep-source
        :loading="loading"
        ref="xTable"
        height="500"
        :span-method="rowspanMethod"
        :data="xueqiMap"
        :edit-rules="validRules"
        :edit-config="{trigger: 'click', mode: 'cell', showUpdateStatus: true, showInsertStatus: true}">
        <vxe-column type="checkbox" width="60" v-if="true"></vxe-column>
        <vxe-column field="ssxq" title="学期名称" :edit-render="{name: '$select',  options: xueqiDict}"></vxe-column>
        <vxe-column field="ssyf" title="月份"
                    :edit-render="{name: 'input', attrs: {type: 'text', placeholder: '请输入月份'}}"></vxe-column>
        <vxe-column field="yxz" title="有效周"
                    :edit-render="{name: 'input', attrs: {type: 'text', placeholder: '请输入有效周'}}"></vxe-column>
        <vxe-column field="jincheng" title="进程"
                    :edit-render="{name: 'input', attrs: {type: 'text', placeholder: '请输入进程'}}"></vxe-column>
        <vxe-column field="kclx" title="课程类型">
          <template slot-scope="scope">
            <dict-tag :options="teachingCourseType" :value="scope.row.kclx"/>
          </template>
        </vxe-column>
        <vxe-column field="remark" title="备注"
                    :edit-render="{name: 'input', attrs: {type: 'text', placeholder: '请输入备注'}}"></vxe-column>
        <vxe-column field="ksrq" title="开始日期"
                    :edit-render="{name: '$input', props: {type: 'date', placeholder: '请选择日期'}}"></vxe-column>
        <vxe-column field="jzrq" title="截止日期"
                    :edit-render="{name: '$input', props: {type: 'date', placeholder: '请选择日期'},events:{change:jzrqOnchange}}"></vxe-column>
        <vxe-column field="id" title="调整日期" width="200px">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="editSj(scope.row)"
              v-if="scope.row.id!=null&&scope.row.kclx=='1'"
            >{{scope.row.ksrq}} - {{scope.row.jzrq}}
            </el-link>
          </template>
        </vxe-column>
      </vxe-table>


      <!--<el-table border :data="xueqiMap" :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="xqmc" label="学期名称"></el-table-column>
        <el-table-column prop="ssyf" label="月份"></el-table-column>
        <el-table-column prop="yxz" label="有效周"></el-table-column>
        <el-table-column prop="jincheng" label="进程"></el-table-column>
        <el-table-column prop="kclx" label="课程类型" :formatter="getKclx"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="时间" width="200px">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="editSj(scope.row)"
            >{{scope.row.ksrq}} - {{scope.row.jzrq}}</el-link>
          </template>
        </el-table-column>
      </el-table>-->
    </div>

    <el-dialog title="编辑时间" :visible.sync="dialogFormVisible">
      <el-form :model="sjForm" :rules="rules" ref="sjForm">
        <el-form-item label="变更日期" label-width="100px" prop="biangengDate">
          <el-date-picker
            v-model="biangengDate"
            value-format="yyyy-MM-dd"
            @change="onCalcBgts"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="变更天数" label-width="100px" prop="yshts">
          <el-input v-model="sjForm.yshts" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" label-width="100px" prop="chooseStartDate">
          <el-date-picker
            v-model="sjForm.chooseStartDate"
            value-format="yyyy-MM-dd"
            type="date"
            disabled
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" label-width="100px" prop="chooseEndDate">
          <el-date-picker
            v-model="sjForm.chooseEndDate"
            value-format="yyyy-MM-dd"
            @change="changeTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="相差天数" label-width="100px">
          <el-input v-model="difference" disabled autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" v-prevent-re-click @click="editDateSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    queryGenerateTeachingPlanData,
    adjustTeachingPlan,
    deleteQueryTermData,
    addOrUpdateQueryTermList,
    saveOrUpdateTermsTeachingPlan
  } from "@/api/teaching/generate";

  export default {
    data() {
      return {
        loading: false,
        itemForm: {},
        sjForm: {
          chooseEndDate: null,
          chooseStartDate: null,
          yshts: null
        },
        validRules: {
          xqmc: [
            {required: true, message: '学期名称必须选择'}
          ],
          ssyf: [
            {required: true, message: '所属月份必须填写'}
          ],
          yxz: [
            {required: true, message: '有效周必须填写'}
          ],
          jincheng: [
            {required: true, message: '进程必须填写'}
          ],
          ksrq: [
            {required: true, message: '开始日期必须填写'}
          ],
          jzrq: [
            {required: true, message: '截止日期必须填写'}
          ],
        },
        xueqiMap: [],
        xueqiDict: [],
        teachingCourseType: [],
        typeNameArr: [],
        typeNamePos: 0,
        dialogFormVisible: false,
        difference: null,
        rules: {
          yshts: [
            {required: true, message: "请输入变更天数", trigger: "blur"}
          ],
          chooseStartDate: [
            {required: true, message: "请选择开始日期", trigger: "blur"}
          ],
          chooseEndDate: [
            {required: true, message: "请选择结束日期", trigger: "blur"}
          ]
        },
        // 变更日期
        biangengDate: null,
        // 学期数据的最后一条
        lastTermDateObj: null,
        // 截止日期校验是否通过
        jzrqValid: true
      };
    },
    props: ["item"],
    created() {
      this.getDicts("teachingCourseType").then(response => {
        this.teachingCourseType = response.data;// vxe的渲染方法：this.renderDict(response.data);
      });
    },
    methods: {
      // 手动更新学期数据
      addOrUpdateQueryTermData(){
        this.$confirm("是否更新学期数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.loading = true
          saveOrUpdateTermsTeachingPlan(this.itemForm.rybjid).then(res=>{
            if (res.code == 200) {
              this.toGrade()
              this.$message({
                type: "success",
                message: "更新学期数据成功!"
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消更新"
          });
        });
      },
      // 点击总复习-新增一行
      async insertEvent(chooseId,row) {
        const $table = this.$refs.xTable
        let nowDate = new Date()
        const record = {
          rybjid: this.itemForm.rybjid,
          kclx: '2',// 复习=2
          ksrq: nowDate,
          kzzd1:chooseId
        }
        if (this.lastTermDateObj) {
          // 学期数据的最大的截至日期作为这个开始日期
          let jzrq = new Date(this.lastTermDateObj.jzrq)
          // 日期+1
          nowDate = new Date(jzrq.setDate(jzrq.getDate() + 1))
          record.ksrq = nowDate
        }
        const {row: newRow} = await $table.insertAt(record, row)
        await $table.setActiveRow(newRow)
      },
      // 删除数据
      deleteSelectEvent() {
        const $table = this.$refs.xTable
        const checkboxRecords = $table.getCheckboxRecords()
        if (checkboxRecords.length <= 0) {
          this.msgError("请选择一条数据！")
          return
        }
        this.$confirm("是否删除选中数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = []
          for (let i = 0; i < checkboxRecords.length; i++) {
            if(checkboxRecords[i].id){// 如果id有值，则表示是已保存的数据
              ids.push(checkboxRecords[i].id)
            }else{// 刚添加的数据，未保存的
              $table.removeCheckboxRow()
            }
          }
          if(ids.length<1){
            return
          }
          this.loading = true
          deleteQueryTermData(ids).then(res => {
            if (res.code == 200) {
              $table.removeCheckboxRow()
              this.toGrade()
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
      /* 提交保存编辑的数据 */
      async saveEvent() {
        const $table = this.$refs.xTable
        const {insertRecords, updateRecords} = $table.getRecordset()
        if (insertRecords.length <= 0 && updateRecords.length <= 0) {
          this.msgInfo("数据未改动！")
          return
        }
        const errMap = await $table.validate().catch(errMap => errMap)
        if (errMap) {
          return
        }
        if(!this.jzrqValid){
          this.msgError("请检查截止日期是否大于开始日期，并且小于高考日期！")
          return
        }
        let upObj;
        for (let i = 0; i < updateRecords.length; i++) {
          upObj=updateRecords[i]
          upObj.ssxq=upObj.xqmc
        }
        this.loading = true
        let obj = {
          addQueryTermList: insertRecords,
          updateQueryTermList: updateRecords
        }
        addOrUpdateQueryTermList(obj).then(res => {
          if (res.code == 200) {
            this.toGrade()
            this.msgSuccess(res.msg)
          } else {
            this.msgError("提交失败！请联系管理员！")
          }
        });
      },
      // 选择截止日期触发
      jzrqOnchange({row}) {
        let gksj = new Date(this.itemForm.gksj).getTime()
        let chooseDate = new Date(row.jzrq).getTime()
        let ksrqDate = new Date(row.ksrq).getTime()
        if (chooseDate - ksrqDate < 1000 * 60 * 60 * 24) {
          this.msgError("提示 : 截止日期不能小于等于开始日期");
          this.jzrqValid = false;
          return
        }
        if (gksj - chooseDate < 1000 * 60 * 60 * 24) {
          this.msgError("提示 : 截止日期不能小于等于高考日期");
          this.jzrqValid = false;
          return
        }
        this.jzrqValid = true;
      },
      // 选择变更日期出发
      onCalcBgts(date) {
        let startTime = new Date(this.sjForm.chooseStartDate).getTime();
        let endTime = new Date(date).getTime();
        if (endTime - startTime < 1000 * 60 * 60 * 24) {
          this.msgError("提示 : 变更时间不能小于等于开始时间");
          this.biangengDate = null;
        } else {
          this.sjForm.yshts = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
        }
      },
      // 父页面跳转到当前子页面触发的事件
      toGrade() {
        this.xueqiMap = [];
        this.itemForm = JSON.parse(JSON.stringify(this.item));
        if (this.itemForm && typeof this.itemForm.zfx == "object") {
          this.itemForm.zfx = this.itemForm.zfx.join(",");
        }
        if (this.itemForm.rybjid) {
          queryGenerateTeachingPlanData(this.itemForm).then(res => {
            if (res.code == 200) {
              this.xueqiMap = res.data.xueqiMap;
              let obj = this.getXueqiListMaxTermAndLastDate(this.xueqiMap)
              if (obj) {
                this.lastTermDateObj = obj
                this.xueqiDict = this.renderDict(res.data.monthMap.xueqiDict)
              }
              this.loading = false
              //this.merageData();
            }
          });
        }
      },
      // 获取学期数据的最后一条，也就是截至日期最大的那条数据
      getXueqiListMaxTermAndLastDate(xueqiList) {
        let vo = null
        if (xueqiList.length > 0) {
          vo = xueqiList[xueqiList.length - 1]
        }
        return vo
      },
      // 获取最大的所属学期和渲染学期码表数据
      /*getNowMaxTermAndRenderDict(obj, xueqiDictList) {
        let maxTermInt = parseInt(obj.ssxq)
        console.log(obj)
        let dictVO;
        let xueqiArr = []
        for (let i = 0; i < xueqiDictList.length; i++) {
          dictVO = xueqiDictList[i]
          if (parseInt(dictVO.dictValue) >= maxTermInt) {
            xueqiArr.push(dictVO)
          }
        }
        this.xueqiDict = this.renderDict(xueqiArr)
        console.log("xueqi:",this.xueqiDict)
      },*/
      // 通用行合并函数（将相同多列数据合并为一行）
      rowspanMethod({row, _rowIndex, column, visibleData}) {
        let fields = ['ssxq']
        let cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          let prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return {rowspan: 0, colspan: 0}
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return {rowspan: countRowspan, colspan: 1}
            }
          }
        }
      },
      //点击超链接的日期触发
      editSj(row) {
        this.biangengDate = null;
        this.sjForm.chooseStartDate = row.ksrq;
        this.sjForm.chooseEndDate = row.jzrq;
        this.sjForm.yshts = null;
        this.changeTime();
        this.dialogFormVisible = true;
      },
      // 选择日期触发的事件
      changeTime() {
        let endTime = new Date(this.sjForm.chooseEndDate).getTime();
        let startTime = new Date(this.sjForm.chooseStartDate).getTime();
        if (endTime - startTime < 1000 * 60 * 60 * 24) {
          this.msgError("提示 : 结束时间不能小于等于开始时间");
          this.sjForm.chooseEndDate = null;
        } else {
          this.difference = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1;
        }
      },
      // 修改日期，点击确定保存触发事件
      editDateSubmit() {
        this.$refs["sjForm"].validate(valid => {
          if (valid) {
            let finalForm = Object.assign(this.itemForm, this.sjForm);
            adjustTeachingPlan(finalForm).then(res => {
              if (res.code == 200) {
                this.msgSuccess("成功 : 数据修改成功");
                this.dialogFormVisible = false;
                this.toGrade();
              } else {
                this.msgError("提示 : 修改数据失败,请重新修改");
              }
            });
          } else {
            this.msgError("提示 : 请填写完整数据");
            return false;
          }
        });
      },

      /*getKclx(row, column) {
        return this.selectDictLabel(this.teachingCourseType, row.kclx);
      },
      merageData() {
        this.typeNameArr = [];
        this.typeNamePos = 0;
        for (let i = 0; i < this.xueqiMap.length; i += 1) {
          if (i === 0) {
            this.typeNameArr.push(1);
            this.typeNamePos = 0;
          } else {
            if (this.xueqiMap[i].xqmc === this.xueqiMap[i - 1].xqmc) {
              this.typeNameArr[this.typeNamePos] += 1;
              this.typeNameArr.push(0);
            } else {
              this.typeNameArr.push(1);
              this.typeNamePos = i;
            }
          }
        }
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          const row1 = this.typeNameArr[rowIndex];
          const col1 = row1 > 0 ? 1 : 0;
          return {
            rowspan: row1,
            colspan: col1
          };
        }
      },*/

    }
  };
</script>

<style lang="scss">
  .semester-view {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .wrap-right-item {
      width: 100%;
    }
  }
</style>

