<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="请假类型" prop="qjlx">
        <el-select v-model="queryParams.qjlx" placeholder="请选择请假类型" clearable size="small">
          <el-option
            v-for="dict in qjlxOptions"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否报备" prop="sfbb">
        <el-select v-model="queryParams.sfbb" placeholder="请选择是否报备" clearable size="small">
          <el-option
            v-for="dict in sfbbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态" prop="spzt">
        <el-select v-model="queryParams.spzt" placeholder="请选择审批状态" clearable size="small">
          <el-option
            v-for="dict in spztOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:teacherAttendance:add']"
        >填写申请
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:teacherAttendance:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          size="mini"
          :disabled="single"
          @click="handleShouJia"
        >确认收假
        </el-button>
        <el-button
          type="warning"
          plain
          icon="el-icon-remove-outline"
          size="mini"
          :disabled="single"
          @click="handleXiaoJia"
        >申请销假
        </el-button>
        <el-button
          type="info"
          icon="el-icon-right"
          size="mini"
          :disabled="single"
          @click="handleYanchangjia"
        >申请延长假
        </el-button>

      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:teacherAttendance:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :height="$root.tableHeight" border :data="teacherAttendanceList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="校区id" align="center" prop="xqid" v-if="false" />
      <el-table-column label="老师id" align="center" prop="lsid" v-if="false" />
      <el-table-column label="校区名称" align="center" prop="xqmc"/>
      <el-table-column label="老师姓名" align="center" prop="lsxm"/>
      <el-table-column label="老师电话" align="center" prop="lsdh"/>
      <el-table-column label="课程内容" align="center" prop="kcnr"/>
      <el-table-column label="请假类型" align="center" prop="qjlx">
        <template slot-scope="scope">
          <dict-tag :options="qjlxOptions" :value="scope.row.qjlx"/>
        </template>
      </el-table-column>
      <el-table-column label="请假开始时间" align="center" prop="qjkssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.qjkssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假结束时间" align="center" prop="qjjssj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.qjjssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假总天数" align="center" prop="zts"/>
      <el-table-column label="请假总节数" align="center" prop="zjs"/>
      <el-table-column label="请假原因" align="center" prop="qjyy"/>
      <el-table-column label="是否报备" align="center" prop="sfbb">
        <template slot-scope="scope">
          <dict-tag :options="sfbbOptions" :value="scope.row.sfbb"/>
        </template>
      </el-table-column>
      <el-table-column label="学校审批的照片" align="center" prop="xxspdzpArr" :width="flexColumnWidth('xxspdzpArr',teacherAttendanceList)">
        <template slot-scope="scope">
          <div class="block" style="display : flex; width : 100% ; height : 100%">
            <el-image
              style="width: 60px; height: 60px; margin : 0px 5px"
              v-for="(item,index) in scope.row.xxspdzpArr"
              :key="index"
              :src="item"
              :preview-src-list="scope.row.xxspdzpArr"
            >
              <div
                slot="error"
                style="width : 100%; height : 100%; display : flex; align-items : center;background : #eee; font-size : 12px;justify-content:center;color : #c0c4cc"
                class="image-slot"
              >
                <span>加载失败</span>
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="学校事务安排" align="center" prop="xxswap"/>
      <el-table-column label="补课/调课时间" align="center" prop="bktksj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bktksj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补课内容" align="center" prop="bknr"/>
      <el-table-column label="审批状态" align="center" prop="spzt">
        <template slot-scope="scope">
          <dict-tag :options="spztOptions" :value="scope.row.spzt"/>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" align="center" prop="spsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.spsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批理由" align="center" prop="sply"/>
      <el-table-column label="审批人" align="center" prop="spr"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="录入或修改人名称" align="center" prop="userName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:teacherAttendance:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:teacherAttendance:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改老师考勤对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-col :span="12">
          <el-form-item label="校区名称" prop="xqmc">
            <!--<el-select v-model="form.xqid" placeholder="请选择校区名称">
              <el-option
                v-for="dict in schoolList"
                :key="dict.id"
                :label="dict.xxmc"
                :value="dict.id"
              ></el-option>
            </el-select>-->
            <el-input v-model="form.xqmc" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="老师姓名" prop="lsxm">
            <el-input v-model="form.lsxm" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="老师电话" prop="lsdh">
            <el-input v-model="form.lsdh" placeholder="请输入老师电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假类型" prop="qjlx">
            <el-select v-model="form.qjlx" placeholder="请选择请假类型">
              <el-option
                v-for="dict in qjlxOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程内容" prop="kcnr">
            <el-input type="textarea" v-model="form.kcnr" placeholder="请输入课程内容"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="请假开始时间" prop="qjkssj" label-width="100px">
            <el-date-picker clearable size="small"
                            v-model="form.qjkssj"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假结束时间" prop="qjjssj" label-width="100px">
            <el-date-picker clearable size="small"
                            v-model="form.qjjssj"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假总天数" prop="zts" label-width="100px">
            <el-input v-model="form.zts" placeholder="系统计算总天数" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请假总节数" prop="zjs" label-width="100px">
            <el-input v-model="form.zjs" placeholder="系统计算总节数" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="请假原因" prop="qjyy">
            <el-input type="textarea" v-model="form.qjyy" placeholder="请输入请假原因"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否报备" prop="sfbb">
            <el-select v-model="form.sfbb" placeholder="请选择是否报备" @change="onSfbbClick" >
              <el-option
                v-for="dict in sfbbOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="学校审批的照片"  label-width="120px" prop="xxspdzp">
            <!--:on-preview="handlePreview"-->
            <img v-for="item in photoList" style="width: 100px; height: 100px" :src="item" :preview-src-list="photoList">
            <el-upload
              :action="upload.fileUrl"
              :headers="upload.headers"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :on-success="xxspdzpUploadSuccess"
              :file-list="fileList">
              <el-button size="small" :disabled="fileDisable" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <!--<el-input v-model="form.xxspdzp" placeholder="请输入学校审批的照片"/>-->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="学校事务安排" prop="xxswap" label-width="100px" >
            <el-input v-model="form.xxswap" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="补/调课时间" label-width="100px" prop="bktksj">
            <el-date-picker clearable size="small"
                            v-model="form.bktksj"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择补课/调课时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="补课内容" prop="bknr">
            <el-input v-model="form.bknr" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item label="审批状态" prop="spzt">
            <el-select v-model="form.spzt" placeholder="请选择审批状态">
              <el-option
                v-for="dict in spztOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批时间" prop="spsj">
            <el-date-picker clearable size="small"
                            v-model="form.spsj"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择审批时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批理由" prop="sply">
            <el-input v-model="form.sply" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批人" prop="spr">
            <el-input v-model="form.spr" placeholder="请输入审批人"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-col>-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>


</template>

<script>
  import {
    listTeacherAttendance,
    getTeacherAttendance,
    delTeacherAttendance,
    addTeacherAttendance,
    updateTeacherAttendance
  } from "@/api/basic/teacherAttendance";
  import {getToken} from "@/utils/auth";
  import { listSchool } from "@/api/basic/school";
  import { addImg, selectFileList, deleteImg } from "@/api/tool/common";
  import { secretKey } from "@/utils/tools";

  export default {
    name: "TeacherAttendance",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
        importBtn: false,
        fullscreenLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 老师考勤表格数据
        teacherAttendanceList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 请假类型字典
        qjlxOptions: [],
        // 是否报备字典
        sfbbOptions: [],
        // 审批状态(1:待审核;2:通过;3:撤销,4拒绝)字典
        spztOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          qjlx: null,
          sfbb: null,
          spzt: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        // 学校集合
        schoolList:[],
        // 文件集合
        fileList:[],
        // 图片路径集合
        photoList:[],
        // 上传文件的按钮
        fileDisable:true,
        dialogVisible: false,
        dialogImageUrl:"",
        upload: {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传图片地址
          fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
        },
      };
    },
    created() {
      this.getList();
      this.getDicts("leave_type").then(response => {
        this.qjlxOptions = response.data;
      });
      this.getDicts("isOrNot").then(response => {
        this.sfbbOptions = response.data;
      });
      this.getDicts("lskq-spzt").then(response => {
        this.spztOptions = response.data;
      });
    },
    methods: {
      // 查询学校列表
      getSchoolList(){
        listSchool().then(response => {
          this.schoolList = response.rows;
          if(response.rows.length==1){
            this.form.xqid=response.rows[0].id
            this.form.xqmc=response.rows[0].xxmc
          }
        });
      },
      /** 查询老师考勤列表 */
      getList() {
        this.loading = true;
        listTeacherAttendance(this.queryParams).then(response => {
          this.teacherAttendanceList = response.rows;
          this.total = response.total;
          this.loading = false;
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
          xqid: null,
          lsid: this.$store.state.user.glrid,
          xqmc: null,
          lsxm: this.$store.state.user.nickName,
          lsdh: null,
          kcnr: null,
          qjlx: null,
          qjkssj: null,
          qjjssj: null,
          zts: null,
          zjs: null,
          qjyy: null,
          sfbb: null,
          xxspdzp: null,
          xxswap: null,
          bktksj: null,
          kbid: null,
          bkls: null,
          bknr: null,
          spzt: null,
          spsj: null,
          sply: null,
          spr: null,
          remark: null,
          userId: null,
          userName: null,
          dataOrder: null,
          createTime: null,
          updateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null,
          kzzd6: null
        };
        // 重置数组
        this.photoList=[]
        this.fileList=[]
        this.resetForm("form");
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getSchoolList()
        this.open = true;
        this.title = "填写请假申请";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getTeacherAttendance(id).then(response => {
          this.form = response.data;
          this.onSfbbClick(this.form.sfbb)
          if(this.form.xxspdzp){// 判断学校审批的照片字段是否有值
            let kzzdJson = {
              kzzd1: this.form.xxspdzp
            };
            let fileObj
            selectFileList(kzzdJson).then(res => {
              for (let i = 0; i < res.rows.length; i++) {
                this.photoList.push(res.rows[i].url)
                fileObj={}
                fileObj.uid=res.rows[i].id
                fileObj.name=res.rows[i].name
                this.fileList.push(fileObj)
              }
            });
          }
          this.open = true;
          this.title = "修改请假申请";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateTeacherAttendance(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTeacherAttendance(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除选中的数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delTeacherAttendance(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch((e) => {
          console.log(e);
        })
      },
      // 删除图片
      handleRemove(file, fileList) {
        deleteImg(file.id).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message.error("删除失败");
          }
        });
      },
      // 预览功能(未开发)
      handlePreview(file) {
        this.open=false
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 限制上传的文件数量
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      // 点击删除的提示信息
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      // 上传成功后的
      xxspdzpUploadSuccess(resp, file, fileList){
        console.log("xxspdzpUploadSuccess:",fileList)
        let data = resp.data;
        // 判断学校审批的照片是否有值,否则生成id
        data.kzzd1 = this.form.xxspdzp || secretKey();
        this.form.xxspdzp = data.kzzd1;
        addImg(data).then(res => {
          if(200==res.code){
            this.msgSuccess("上传成功！")
          }else{
            this.msgError("上传失败！")
          }
        });
      },

      // 是否报备
      onSfbbClick(val){
        if(1==val){
          this.fileDisable=false
        }else{
          this.fileDisable=true
        }
      },
      // 处理销假
      handleXiaoJia(){
        this.msgSuccess("正在开发")
      },
      // 确认收假
      handleShouJia(){
        this.msgSuccess("正在开发")
      },
      // 申请延长假
      handleYanchangjia(){
        this.msgSuccess("正在开发")
      },
      // 宽度适配
      flexColumnWidth(str, tableData) {
        let arr = [];
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i] && tableData[i][str] && tableData[i][str].length > 0) {
            tableData.forEach(obj => {
              if (obj[str] && obj[str].length) arr.push(obj[str].length);
            });
          } else {
            continue;
          }
        }
        return Math.max.call(null, ...arr) * 75;
      }


    }
  };
</script>
