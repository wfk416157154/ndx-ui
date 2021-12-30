<template>
  <div class="app-container">
    <div
      style="width : 100%;height : 100%;padding : 10px; box-sizing : border-box;text-align : center"
    >
      <h3>{{ddzTitle}}-督导组周总结表({{ddzDateScope}})</h3>
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <table style="width : 100%;" border="1" cellspacing="0">
            <thead>
            <tr>
              <th width="250px">本组成员</th>
              <th>
                <el-form-item label="组长" prop="zz" style="margin-left: -20px">
                  <el-input v-model="form.zzmc" readonly/>
                </el-form-item>
                <el-form-item label="组员" prop="zzid" style="margin-bottom: 1px;margin-left: -20px">
                  <el-input v-model="ddzZyStr" readonly/>
                </el-form-item>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>集体备课记录</td>
              <td>
                <el-col :span="12">
                  <el-form-item label="试讲人" prop="sjrid">
                    <el-select v-model="form.sjrid" filterable placeholder="请选择试讲人" style="width: 100%">
                      <el-option
                        v-for="(item,index) in teacherListOption"
                        :key="index"
                        :label="item.zymc"
                        :value="item.zyid"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="试讲用时(分钟)" label-width="150px" prop="sjys">
                    <el-input-number v-model="form.sjys" placeholder="请输入试讲用时(分钟)" :max="100" :min="1" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="试讲内容" prop="sjnr">
                    <el-input v-model="form.sjnr" type="textarea" placeholder="请输入内容"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="试讲评价" prop="sjpj">
                    <editor v-model="form.sjpj" :min-height="150"/>
                  </el-form-item>
                </el-col>
              </td>
            </tr>
            <tr>
              <td>会议讨论</td>
              <td>
                <vxe-grid ref="xGrid" v-bind="gridOptions1">
                </vxe-grid>
              </td>
            </tr>
            <tr>
              <td>班级管理</td>
              <td>
                <el-form-item label="班级管理" prop="bjgl">
                  <editor v-model="form.bjgl" :min-height="150"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>问题解答</td>
              <td class="clearfix" align="left">
                <el-form-item label="问题解答" prop="wtjd">
                  <editor v-model="form.wtjd" :min-height="150"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
            <tr>
              <td>总结</td>
              <td class="clearfix" align="left">
                <el-form-item label="总结" prop="remark">
                  <editor v-model="form.remark" :min-height="150"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>操作</td>
              <td>
                <el-button icon="el-icon-close" @click="cancel">取消</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-check"
                  v-prevent-re-click
                  @click="submitForm"
                  :disabled="disabledSubmitBtn"
                >提交
                </el-button>
              </td>
            </tr>
            </tbody>
          </table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {listSupervisor, getSupervisor, getLoginUnderGroup, addOrUpdateSupervisor} from "@/api/basic/supervisor";
  import {getToken} from "@/utils/auth";
  import {teacherList} from "@/api/basic/assignTeachers";
  import {parseTime} from "@/utils/ruoyi";

  export default {
    name: "addForm",
    components: {},
    data() {
      return {
        gridOptions1: {
          keepSource: true,
          border: true,
          resizable: true,
          showOverflow: true,
          align: 'center',
          editConfig: {
            trigger: 'click',
            mode: 'row',
            showStatus: true
          },
          columns: [
            {type: 'seq', title: "序号", width: 50},
            {field: 'zyid', title: "组员id", visible: false},
            {field: 'bmid', title: "部门id", visible: false},
            {field: 'zymc', title: "组员名称"},
          ],
          data: []
        },

        // 父页面传递过来的参数
        parentParams: null,
        // 遮罩层
        loading: true,
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          sjrid: [{required: true, message: "必填项", trigger: "change"}],
          sjys: [{required: true, message: "必填项", trigger: "blur"}],
          sjnr: [{required: true, message: "必填项", trigger: "blur"}],
          sjpj: [{required: true, message: "必填项", trigger: "blur"}],
          bjgl: [{required: true, message: "必填项", trigger: "blur"}],
          wtjd: [{required: true, message: "必填项", trigger: "blur"}],
          remark: [{required: true, message: "必填项", trigger: "blur"}],
        },
        // 老师列表
        teacherListOption: [],
        // 会议讨论的项目选项
        projectOptions: [],
        // 是否-选项
        isOrNotOption: [],
        // 督导组标题
        ddzTitle: "",
        // 督导组-日期范围
        ddzDateScope: "",
        // 督导组-组员
        ddzZyStr: "",
        // 是否禁用提交按钮
        disabledSubmitBtn: false
      };
    },
    created() {
      this.loadDictData()
      this.parentParams = this.$route.query
      //this.getTeacherList()
    },
    mounted() {

    },
    methods: {
      // 加载码表
      loadDictData() {
        this.getDicts("supervisorProjectOption").then(res => {
          this.projectOptions = res.data
          // 嵌套调用的目的必须要按顺序加载
          this.getDicts("isOrNot").then(res => {
            this.isOrNotOption = this.renderDict(res.data)
            this.renderTableColumn()
            if (this.parentParams.pageType == "add") {
              this.addInvokeMethod()
            } else {
              this.updateInvokeMethod()
            }
          });
        });
      },
      // 父页面点击添加按钮跳转过来要执行的方法
      addInvokeMethod() {
        this.reset()
        getLoginUnderGroup().then(res => {
          let vo = res.data
          this.ddzTitle = vo.zzbmmc // 组长部门名称
          this.form.zzid = vo.zzid // 组长id
          this.form.zzbmid = vo.zzbmid // 组长部门id
          this.form.zzmc = vo.zzmc // 组长名称
          this.form.ksrq = vo.ksrq // 开始日期
          this.form.jzrq = vo.jzrq //截止日期
          this.ddzDateScope = parseTime(vo.ksrq, "{y}-{m}-{d}") + "至" + parseTime(vo.jzrq, "{y}-{m}-{d}")
          this.rtnZyStr(vo.zyList)
          this.renderTableData(vo.zyList)
          this.disabledSubmitBtn = false
        }).catch((e) => {
          this.disabledSubmitBtn = true
          this.skipIndex()
        });
      },
      // 父页面点击修改按钮跳转过来要执行的方法
      updateInvokeMethod() {
        this.reset()
        getSupervisor(this.parentParams.id).then(response => {
          let vo = response.data
          this.form = vo
          this.ddzTitle = vo.zzbmmc
          this.form.zzmc = vo.zzmc
          this.ddzDateScope = parseTime(vo.ksrq, "{y}-{m}-{d}") + "至" + parseTime(vo.jzrq, "{y}-{m}-{d}")
          this.rtnZyStr(vo.zyList)
          this.renderTableData(vo.zyList)
        });
      },
      // 返回组员名称的拼接
      rtnZyStr(zyList) {
        this.teacherListOption=zyList
        let zyStr = ""// 组员-账号拼接
        for (let i = 0; i < zyList.length; i++) {
          zyStr += zyList[i].zymc + ","
        }
        this.ddzZyStr = zyStr.substring(0, zyStr.length - 1)
      },
      // 动态渲染表格表头
      renderTableColumn() {
        let dict;
        let obj
        for (let i = 0; i < this.projectOptions.length; i++) {
          dict = this.projectOptions[i]
          if ("remark" == dict.dictValue) {
            obj = {field: dict.dictValue, title: dict.dictLabel, editRender: {name: 'input'}}
          } else {
            obj = {
              field: dict.dictValue,
              title: dict.dictLabel,
              editRender: {name: '$select', options: this.isOrNotOption}
            }
          }
          this.gridOptions1.columns.push(obj)
        }
      },
      // 动态渲染表格数据
      renderTableData(zyList) {
        let obj
        let dict
        let dataArr = []
        for (let i = 0; i < zyList.length; i++) {
          obj = {}
          obj.zyid = zyList[i].zyid // 组员id(老师id)
          obj.zymc = zyList[i].zymc // 组员名称
          obj.bmid = zyList[i].bmid // 部门id
          for (let j = 0; j < this.projectOptions.length; j++) {
            dict = this.projectOptions[j]
            if (zyList[i][dict.dictValue]) {// 如果该字段有值
              obj[dict.dictValue] = zyList[i][dict.dictValue]
            } else { // 默认值
              if ("remark" == dict.dictValue) {
                obj[dict.dictValue] = "" // 默认：空
              } else {
                obj[dict.dictValue] = "1" // 默认：是=1
              }
            }
          }
          dataArr.push(obj)
        }
        this.gridOptions1.data = dataArr
      },
      // 获取老师列表
      getTeacherList() {
        teacherList().then(response => {
          this.teacherListOption = response.rows;
        });
      },
      // 取消按钮
      cancel() {
        this.reset();
        this.skipIndex()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          ksrq: null,
          jzrq: null,
          zzid: null,
          zzbmid: null,
          sjrid: null,
          sjrbmid: null,
          sjys: null,
          sjnr: null,
          sjpj: null,
          bjgl: null,
          wtjd: null,
          status: "0",
          remark: null,
          userId: null,
          dataOrder: null,
          createTime: null,
          updateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null
        };
        this.resetForm("form");
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            let tableDataArr
            // 保存编辑表格的数据
            const $grid = this.$refs.xGrid
            // 如果是添加
            if ("add" === this.parentParams.pageType) {
              tableDataArr = $grid.getTableData().tableData
            } else {
              tableDataArr = $grid.getUpdateRecords();
            }
            this.form.tableListDataJson = JSON.stringify(tableDataArr)
            addOrUpdateSupervisor(this.form).then(res => {
              if (res.code == 200) {
                this.skipIndex()
                this.msgSuccess(res.msg);
              } else {
                this.msgError(res.msg)
              }
            });
          }
        });
      },
      skipIndex() {
        this.getConfigKey("supervisorIndex").then(resp => {
          this.$router.push({
            path: resp.msg,
          });
        });
      }


    }
  };
</script>
<style lang="scss" scoped>
  th,
  td {
    padding: 15px;
    box-sizing: border-box;
    font-size: 30px;
  }


</style>
