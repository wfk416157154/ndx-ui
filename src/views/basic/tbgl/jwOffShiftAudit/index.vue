<template>
  <div style="width : 100%; height : 100%; padding : 40px; box-sizing : border-box">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
      <el-form-item label="负责人" prop="fzrid">
        <el-select v-model="queryParams.fzrid" placeholder="请选择区域负责人">
          <el-option
            v-for="item in areaManagerList"
            :key="item.id"
            :label="item.xm"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="xqid">
        <el-select v-model="queryParams.xqid" filterable placeholder="请选择校区名称" @change="xqmcOnChange">
          <el-option
            v-for="item in selectXqmc"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班级" prop="rybjid">
        <el-select v-model="queryParams.rybjid" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="shzt">
        <el-select v-model="queryParams.shzt" placeholder="请选择">
          <el-option
            v-for="(item,index) in tuibanStatusList"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退班时间" prop="tbsjArr">
        <el-date-picker
          v-model="queryParams.tbsjArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-zoom-in" @click="handleQuery">查询</el-button>
        <el-button type="danger" @click="queryShenpi('1,3')">未审批</el-button>
        <el-button type="success" @click="queryShenpi('2,3,4,5,6')">已审批</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :height="$root.tableHeight" :data="stuTuibanList" border style="width: 100%;font-size : 18px">
      <el-table-column prop="rybjmc" label="班级" align="center"></el-table-column>
      <el-table-column prop="lsxm" label="老师" align="center"></el-table-column>
      <el-table-column prop="xsxm" label="学生姓名" align="center"></el-table-column>
      <el-table-column prop="rbsj" label="入班时间" align="center"></el-table-column>
      <el-table-column prop="tbsj" label="退班时间" align="center"></el-table-column>
      <el-table-column prop="yhkh" label="银行账号" align="center"></el-table-column>
      <el-table-column prop="tblx" label="退班规则" align="center">
        <template slot-scope="scope">
          <dict-tag :options="tbgzlxOption" :value="scope.row.tblx"/>
        </template>
      </el-table-column>
      <el-table-column prop="tbyy" label="退班原因" align="center"></el-table-column>
      <el-table-column prop="yyxzlxyZt" label="教与学质量协议" align="center">
        <template slot-scope="scope">
          <dict-tag :options="jyxzlxyStatusOption" :value="scope.row.yyxzlxyZt"/>
        </template>
      </el-table-column>
      <el-table-column prop="sjZt" label="收据" align="center">
        <template slot-scope="scope">
          <dict-tag :options="sjStatusOption" :value="scope.row.sjZt"/>
        </template>
      </el-table-column>
      <el-table-column prop="tbsqzlTpidArr" label="审核资料" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-for="(item,index) in scope.row.tbsqzlTpidArr"
            :key="index"
            @click="downloadFileName(item.wjmc)"
          >{{item.wjmc}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="shzt" label="审核状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="tuibanStatusList" :value="scope.row.shzt"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" icon="el-icon-s-custom" v-if="1!=scope.row.tblx&&1==scope.row.shzt" @click="chushenEditPage(scope.row)">审核</el-button>
          <el-button size="mini" type="success" icon="el-icon-s-flag" v-if="6!=scope.row.shzt" @click="jiesuanEdit(scope.row)">结算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="初审" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-form
          ref="chushenRefForm"
          :model="chushenForm"
          label-width="80px">
          <el-form-item label="退还金额">
            <el-input placeholder="请输入内容" v-model="chushenForm.thje"></el-input>
          </el-form-item>
          <el-form-item label="退还规则">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="chushenForm.thgz"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chushenSubmit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {listBjclass,} from "@/api/basic/bjclass";
  import {listSchool} from "@/api/basic/school";
  import {listAreaManager} from "@/api/basic/areaManager";
  import {listStuTuiban, getStuTuiban, delStuTuiban, addStuTuiban, updateStuTuiban} from "@/api/basic/stuTuiban";
  import {
    listStuTuibanLog,
    getStuTuibanLog,
    delStuTuibanLog,
    addStuTuibanLog,
    updateStuTuibanLog
  } from "@/api/basic/stuTuibanLog";

  export default {
    data() {
      return {
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          xsbh: null,
          rybjid: null,
          lsid: null,
          shzt: null,
          shztArr: [],
          tbsjArr: []
        },
        // 初审 form
        chushenForm: {
          thje: null,
          thgz: null
        },
        // 有异议的form
        objectionForm: {
          objectionContent: null,
          thje: null,
          remark: null
        },
        loading: false,
        total: 0,
        stuTuibanList: [],
        // 初审-弹窗
        dialogVisible: false,
        // 异议-弹窗
        objectionVisible: false,
        //校区名称
        selectXqmc: [],
        // 班级选择
        bjclassList: [],
        // 区域负责人列表
        areaManagerList: [],
        // 退班审核状态
        tuibanStatusList: [],
        // 异议内容
        objection: "",
        // 教与学质量协议-状态码表
        jyxzlxyStatusOption: [],
        // 收据-状态码表
        sjStatusOption: [],
        // 退班规则-类型码表
        tbgzlxOption: [],
        // 选择的对象
        selectRowData: null
      };
    },
    created() {
      // 获取校区
      listSchool().then(response => {
        this.selectXqmc = response.rows;
      });
      // 查询负责人
      listAreaManager().then(res => {
        this.areaManagerList = res.rows;
      });
      // 退班审核状态
      this.getDicts("tuiban_status").then(res => {
        this.tuibanStatusList = res.data;
      });
      // 教与学质量协议-状态码表
      this.getDicts("jyxzlxy-status").then(response => {
        this.jyxzlxyStatusOption = response.data;
      });
      // 收据-状态码表
      this.getDicts("sj-status").then(response => {
        this.sjStatusOption = response.data;
      });
      // 退班规则-类型码表
      this.getDicts("tbgzlx").then(response => {
        this.tbgzlxOption = response.data;
      });
      this.queryShenpi("1,3") // 默认查询 1=已申请-待初审，3=学生同意
    },
    methods: {
      // 选择校区触发
      xqmcOnChange(id) {
        listBjclass({kzzd1: id}).then(response => {
          this.bjclassList = response.rows;
          // 日语班级选项 -当老师角色登录
          if (this.$store.state.user.dataRoleWeightId == 50) {
            if (response.rows.length == 1) {
              this.queryParams.rybjid = response.rows[0].id;
            }
          }
        });
      },
      /** 查询学生退班列表 */
      getList() {
        this.loading = true;
        listStuTuiban(this.queryParams).then(response => {
          this.stuTuibanList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 查询审批或未审批的数据
      queryShenpi(val) {
        this.queryParams.shztArr = val.split(",")
        this.getList()
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 结算
      jiesuanEdit(row) {
        if("2"==row.tblx){// 如果退班规则是：退班退费
          if ("3" !== row.shzt) {// 学生同意
            this.msgError("请选择审核状态为【学生同意】的数据！")
            return
          }
        }// 否则可直接结算
        if ("6" == row.shzt) {
          this.msgError("该学生已退班！请重新选择！")
          return
        }
        this.$confirm('确认同意?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(function () {
          let obj = {
            id: row.id,
            shzt: "6" //退班成功
          }
          return updateStuTuiban(obj);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        }).catch((e) => {
          console.log(e);
        });
      },
      // 初审form页面
      chushenEditPage(row) {
        if ("1" !== row.shzt) {// 已申请-待初审
          this.msgError("请选择审核状态为【已申请-待初审】的数据！")
          return
        }
        this.selectRowData = row
        this.dialogVisible = true;
      },
      // 初审提交
      chushenSubmit() {
        let stuobj={
          id:this.selectRowData.id,
          shzt: "2",// 初审
        }
        let obj = {
          glid: this.selectRowData.id,
          shzt: "2",// 初审
          thje: this.chushenForm.thje,// 退还金额
          thgz: this.chushenForm.thgz // 退还规则
        };
        updateStuTuiban(stuobj).then((res) =>{
          if(res.code == 200){
            this.msgSuccess("提交成功");
            addStuTuibanLog(obj).then(response => {
              this.dialogVisible = false;
              this.getList();
            });
          }else{
            this.msgError("提交失败！请联系管理员！"+res.msg)
          }
        })


      },
      /** 下载文件操作 */
      downloadFileName(fileName) {
        this.download('file/filetable/download', {
          wjmc: fileName
        }, fileName)
      },


    }
  };
</script>
