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
                    <el-input v-model="form.zzmc" readonly />
                  </el-form-item>
                  <el-form-item label="组员" prop="zzid" style="margin-bottom: 1px;margin-left: -20px">
                    <el-input v-model="ddzZyStr" readonly />
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
                      <el-select v-model="form.sjrid" filterable placeholder="请选择试讲人" style="width: 100%" >
                        <el-option
                          v-for="item in teacherListOption"
                          :key="item.id"
                          :label="item.lsxm+'-'+item.dhhm"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="试讲用时" prop="sjys">
                      <el-input v-model="form.sjys" placeholder="请输入试讲用时"/>
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
                    <template #toolbar_buttons>
                      <el-button @click="saveEditTableData" type="success" icon="el-icon-circle-check">点击保存数据</el-button>
                    </template>
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
  import {listSupervisor, getSupervisor, delSupervisor, addSupervisor, updateSupervisor,getLoginUnderGroup} from "@/api/basic/supervisor";
  import {getToken} from "@/utils/auth";
  import {teacherList} from "@/api/basic/assignTeachers";
  import {parseTime} from "@/utils/ruoyi";
  export default {
    name: "addForm",
    components: {},
    data() {
      return {
        gridOptions1: {
          keepSource:true,
          border: true,
          resizable: true,
          showOverflow: true,
          align: 'center',
          toolbarConfig: {
            slots: {
              // 自定义工具栏模板
              buttons: 'toolbar_buttons'
            }
          },
          editConfig: {
            trigger: 'click',
            mode: 'row',
            showStatus: true
          },
          columns: [
            { type: 'seq',title:"序号", width: 50 },
            { field: 'zymc',title:"组员名称"},
          ],
          data: [
            { zlzd: "0", gdxszw: '1', kqzlzs: '1', kzxs: '0', txxs: '0', remark:"0"},
            { zlzd: "1", gdxszw: '0', kqzlzs: '0', kzxs: '1', txxs: '1', remark: "1" },
          ]
        },

        // 父页面传递过来的参数
        parentParams:null,
        // 遮罩层
        loading: true,
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 老师列表
        teacherListOption:[],
        // 会议讨论的项目选项
        projectOptions:[],
        // 是否-选项
        isOrNotOption:[],
        // 督导组标题
        ddzTitle:"",
        // 督导组-日期范围
        ddzDateScope:"",
        // 督导组-组员
        ddzZyStr:"",
      };
    },
    created() {
      this.loadDictData()
      this.parentParams=this.$route.query
      this.getTeacherList()
      this.addInvokeMethod()
    },
    mounted() {

    },
    methods: {
      loadDictData(){
        this.getDicts("supervisorProjectOption").then(res=>{
          this.projectOptions=res.data
          this.getDicts("isOrNot").then(res=>{
            this.isOrNotOption=this.renderDict(res.data)
            if(this.parentParams.pageType=="add"){
              this.renderTableColumn()
            }
          });
        });

      },
      saveEditTableData(){
        console.log("saveEditTableData")
      },
      addInvokeMethod(){
        getLoginUnderGroup().then(res=>{
          if(res.code==200){
            let vo=res.data.supervisorVO
            this.ddzTitle=vo.zzbmmc
            this.form.zzid=vo.zzid
            this.form.zzbmid=vo.zzbmid
            this.form.zzmc=vo.zzmc
            this.form.ksrq=vo.ksrq
            this.form.jzrq=vo.jzrq
            this.ddzDateScope=parseTime(vo.ksrq,"{y}-{m}-{d}")+"至"+parseTime(vo.jzrq,"{y}-{m}-{d}")
            let zyList=res.data.zyList
            let zyStr=""
            for (let i = 0; i <zyList.length; i++) {
              zyStr+=zyList[i].nick_name+"-"+zyList[i].user_name+","
            }
            this.ddzZyStr=zyStr.substring(0,zyStr.length-1)

            let obj
            let dict
            let dataArr=[]
            for (let i = 0; i <zyList.length; i++) {
              obj={}
              obj.zymc=zyList[i].nick_name
              for (let j = 0; j < this.projectOptions.length; j++) {
                dict=this.projectOptions[j]
                obj[dict.dictValue]="0"
              }
              dataArr.push(obj)
            }
            this.gridOptions1.data=dataArr
          }
        });
      },
      renderTableColumn(){
        let dict;
        let obj
        for (let i = 0; i <this.projectOptions.length ; i++) {
          dict=this.projectOptions[i]
          obj={ field: dict.dictValue, title: dict.dictLabel ,editRender: { name: '$select', options:this.isOrNotOption }}
          this.gridOptions1.columns.push(obj)
        }
      },
      // 获取老师列表
      getTeacherList() {
        teacherList().then(response => {
          this.teacherListOption = response.rows;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          ksrq:null,
          jzrq:null,
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
            if (this.form.id != null) {
              updateSupervisor(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSupervisor(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },


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
