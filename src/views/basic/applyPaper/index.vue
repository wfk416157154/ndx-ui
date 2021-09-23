<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="日语班级" prop="bjid">
        <el-select v-model="queryParams.bjid" @change="getClassList" placeholder="请选择日语班级">
          <el-option
            v-for="dict in classList"
            :key="dict.id"
            :label="dict.rybjmc"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试类型" prop="kslx">
        <el-select v-model="queryParams.kslx" placeholder="请选择考试类型" clearable size="small">
          <el-option
            v-for="dict in kslxOptions"
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">申请试卷</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddQt">添加其他试卷</el-button>
      </el-col>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="statusQuery(9)">成绩未上传</el-button>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="statusQuery(3)">成绩已上传</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table
      border
      v-loading="loading"
      :data="examinationPaperList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="日语班级" align="center" prop="bjmc"/>
      <el-table-column label="老师" align="center" prop="lsxm"/>
      <el-table-column label="教材" align="center" prop="jcmc"/>
      <el-table-column label="考试类型" align="center" :formatter="getKslx" prop="kslx"/>
      <el-table-column label="考试范围" align="center" prop="ksfw"  >
        <template slot-scope="scope">
          <span v-if="'1'==scope.row.kslx">
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw"/>
          </span>
          <span v-else>
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw.split('-')[0]"/>-至-
            <dict-tag :options="sjglKsfwJsbfList" :value="scope.row.ksfw.split('-')[1]"/>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="考试时间" align="center" prop="kskssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.kskssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试结束时间" align="center" v-if="false" prop="ksjssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ksjssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成绩上传状态" align="center" :formatter="getCjsczt" prop="kzzd2">
        <template slot-scope="scope">
          <span v-if="scope.row.kzzd2 == '3'">已上传</span>
          <el-button
            size="mini"
            type="text"
            @click="handleCjsc(scope.row)"
            v-if="(scope.row.kzzd2 == '1'|| scope.row.kzzd2 == '2')&& scope.row.lssjzt != '1' "
          >上传成绩
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" align="center" prop="kzzd1" width="120">
      </el-table-column>
      <el-table-column label="发送时间" align="center" prop="fssj" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fssj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送人" align="center" prop="fsrmc"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.lssjzt == '1'">暂无试卷</span>
          <span v-if="scope.row.lssjzt == '4'">其他试卷</span>
          <el-button
            size="mini"
            type="text"
            @click="handleExport(scope.row)"
            v-if="scope.row.lssjzt == '2' || scope.row.lssjzt == '3' "
          >下载
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

    <!-- 申请试卷 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="formState" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老师姓名" label-width="120px" prop="lsxm">
          <el-input v-model="form.lsxm" placeholder="请输入老师姓名" readonly/>
        </el-form-item>
        <el-form-item label="日语班级" label-width="120px" prop="bjid">
          <el-select v-model="form.bjid" @change="getClassList" placeholder="请选择日语班级">
            <el-option
              v-for="dict in classList"
              :key="dict.id"
              :label="dict.rybjmc"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材" label-width="120px" prop="jcid">
          <el-select v-model="form.jcid" @change="getJcList" placeholder="请选择教材">
            <el-option
              v-for="(item,index) in jsList"
              :key="index"
              :label="item.jcmc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型" label-width="120px" prop="kslx">
          <el-select v-model="form.kslx" placeholder="请考试类型" @change="onKslxClick">
            <el-option
              v-for="dict in kslxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试范围" label-width="120px" prop="ksfw">
          <el-select v-model="form.ksfw" v-if="showKsfw" >
            <el-option
              v-for="dict in sjglKsfwJsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>

          <el-select v-model="ksfw_ksbf" v-if="showKsfwKsJs" >
            <el-option
              v-for="dict in sjglKsfwKsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
          <span v-if="showKsfwKsJs">--至--</span>
          <el-select v-model="ksfw_jsbf" placeholder="请选择考试范围" v-if="showKsfwKsJs">
            <el-option
              v-for="dict in sjglKsfwJsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间" label-width="120px" prop="kskssj">
          <el-date-picker
            v-model="form.kskssj"
            type="date"
            value-format=" yyyy-MM-dd"
            placeholder="选择考试时间"
          ></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="考试结束时间" label-width="120px" prop="ksjssj">
          <el-date-picker
            v-model="form.ksjssj"
            type="datetime"
            value-format=" yyyy-MM-dd HH:mm"
            placeholder="选择考试开始时间"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="form.remark" placeholder/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitForm">提交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 成绩上传 -->
    <el-dialog :title="cjsc.title" :visible.sync="cjsc.open" width="600px" append-to-body>
      <el-form ref="formState" :model="cjscForm" label-width="80px">
        <el-form-item label="老师姓名" label-width="120px" prop="lsxm">
          <el-input v-model="cjscForm.lsxm" disabled/>
        </el-form-item>
        <el-form-item label="日语班级" label-width="120px" prop="bjid">
          <el-select v-model="cjscForm.bjid" disabled>
            <el-option
              v-for="dict in classList"
              :key="dict.id"
              :label="dict.rybjmc"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材" label-width="120px" prop="jcid">
          <el-input v-model="cjscForm.jcmc" disabled/>
        </el-form-item>
        <el-form-item label="考试类型" label-width="120px" prop="kslx">
          <el-select v-model="cjscForm.kslx" disabled>
            <el-option
              v-for="dict in kslxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="考试范围" label-width="120px" prop="ksfw">
          <el-input v-model="cjscForm.ksfw" disabled/>
        </el-form-item>-->
        <el-form-item label="考试时间" label-width="120px" prop="kskssj">
          <el-input v-model="cjscForm.kskssj" disabled/>
        </el-form-item>

        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="cjscForm.remark" disabled/>
        </el-form-item>
        <div class="button">
          <el-button
            type="info"
            icon="el-icon-upload2"
            size="mini"
            @click="handleCjImport"
            v-has-role="['teacher']"
          >导入成绩
          </el-button>
        </div>
      </el-form>

    </el-dialog>

    <!-- 成绩导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.fileUrl"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :data="{ ksmc: cjscForm.ksfw, kslx: cjscForm.kslx, kssj: cjscForm.ksjssj }"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size: 12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 考试成绩分析总结 -->
    <el-dialog title="考试分析总结" :close-on-click-modal="false" :visible.sync="kscjzj" width="60%">
      <el-form label-width="120px">
        <el-form-item label="考试总结">
          <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 10 }" v-model="getKscjzj"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="kscjzj = false">取 消</el-button>
        <el-button type="primary" @click="addKscjfxzj">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加其他试卷对话框 -->
    <el-dialog :title="title" :visible.sync="openQt" width="800px" append-to-body>
      <el-form ref="formState" :model="formQt" :rules="rules" label-width="80px">
        <el-form-item label="老师姓名" label-width="120px" prop="lsxm">
          <el-input v-model="formQt.lsxm" placeholder="请输入老师姓名" readonly/>
        </el-form-item>
        <el-form-item label="日语班级" label-width="120px" prop="bjid">
          <el-select v-model="formQt.bjid" @change="getClassList" placeholder="请选择日语班级">
            <el-option
              v-for="dict in classList"
              :key="dict.id"
              :label="dict.rybjmc"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材" label-width="120px" prop="jcid">
          <el-select v-model="formQt.jcid" @change="getJcList" placeholder="请选择教材">
            <el-option
              v-for="(item,index) in jsList"
              :key="index"
              :label="item.jcmc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试类型" label-width="120px" prop="kslx">
          <el-select v-model="formQt.kslx" plac输入eholder="请考试类型" @change="onKslxClick">
            <el-option
              v-for="dict in kslxOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试范围" label-width="120px" prop="ksfw">
          <el-select v-model="formQt.ksfw" v-if="showKsfw" >
            <el-option
              v-for="dict in sjglKsfwJsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>

          <el-select v-model="ksfw_ksbf" v-if="showKsfwKsJs" >
            <el-option
              v-for="dict in sjglKsfwKsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
          <span v-if="showKsfwKsJs">--至--</span>
          <el-select v-model="ksfw_jsbf" placeholder="请选择考试范围" v-if="showKsfwKsJs">
            <el-option
              v-for="dict in sjglKsfwJsbfList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试时间" label-width="120px" prop="kskssj">
          <el-date-picker
            v-model="formQt.kskssj"
            type="date"
            value-format=" yyyy-MM-dd"
            placeholder="选择考试时间"
          ></el-date-picker>
        </el-form-item>
        <!--<el-form-item label="考试结束时间" label-width="120px" prop="ksjssj">
          <el-date-picker
            v-model="form.ksjssj"
            type="datetime"
            value-format=" yyyy-MM-dd HH:mm"
            placeholder="选择考试开始时间"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="备注" label-width="120px" prop="remark">
          <el-input v-model="formQt.remark" placeholder/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click @click="submitFormQt">提交</el-button>
        <el-button @click="cancelQt">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    listExaminationPaper,
    getExaminationPaper,
    delExaminationPaper,
    addExaminationPaper,
    updateExaminationPaper
  } from "@/api/basic/examinationPaper";
  import {getToken} from "@/utils/auth";
  import {listBjclass} from "@/api/basic/bjclass";
  import {addExamSummary} from "@/api/basic/examSummary";
  import {listTeachingMaterial} from "@/api/basic/teachingMaterial";

  export default {
    name: "ExaminationPaper",
    components: {},
    data() {
      return {
        // 遮罩层
        loading: true,
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
        // 考卷表格数据
        examinationPaperList: [],
        // 弹出层标题
        title: "",
        //考试成绩总结
        kscjzj: false,
        // 是否显示弹出层
        open: false,
        openQt: false,
        // 考试类型字典
        kslxOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          bjid: null,
          bjmc: null,
          kslx: null,
          ksnr: null,
          jcmc: null,
          jwsjzt: null,
          lssjzt: null,
          status: "1",// 默认查询正常的数据
          dataOrder: null,
          addOrUpdateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null
        },
        // 表单参数
        form: {},
        // 其他试卷表单参数
        formQt: {},
        //成绩上传表参数
        cjscForm: {},
        // 考试分析总结
        getKscjzj: "",
        // 表单校验
        rules: {
          bjid: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          // jcid: [
          //   { required: true, message: '必填', trigger: 'blur' }
          // ],
          kslx: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          ksfw: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          ksfw_ksbf: [
            {required: true, message: '必填', trigger: 'blur'}
          ],
          ksfw_jsbf: [
              {required: true, message: '必填', trigger: 'blur'}
            ],
          kskssj: [
            {required: true, message: '必填', trigger: 'blur'}
          ]
        },
        //成绩上传
        cjsc: {
          // 是否显示弹出层
          open: false,
          title: "成绩上传",
        },
        // // 用户导入参数
        // upload: {
        //   // 是否显示弹出层
        //   open: false,
        //   // 弹出层标题
        //   title: "导入考卷数据",
        //   // 是否禁用上传
        //   isUploading: false,
        //   // 是否更新已经存在的数据
        //   updateSupport: 0,
        //   // 设置上传的请求头部
        //   headers: {Authorization: "Bearer " + getToken()},
        //   // 上传的地址
        //   url: process.env.VUE_APP_BASE_API + "basic/examinationPaper/importData"
        // },
        // 成绩上传
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          // 上传考试成绩地址
          fileUrl:
            process.env.VUE_APP_BASE_API +
            "/basic/examinationPaper/importClassGradeData",
          // 上传图片地址
          imgUrl: process.env.VUE_APP_BASE_API + "/file/upload"
        },
        // 用户关联id
        glrid: "",
        // 老师教学班级
        classList: [],
        // 老师试卷状态
        getStatusList: [],
        // 成绩上传状态
        getCjscztList: [],
        // 教材名称
        jsList: [],
        // 是否显示考试范围
        showKsfw:true,
        // 是否显示考试范围-开始结束两个部分
        showKsfwKsJs:false,
        ksfw_ksbf:null,
        ksfw_jsbf:null,
        sjglKsfwKsbfList:[],
        sjglKsfwJsbfList:[],
      };
    },
    created() {
      this.getDicts("examination_type").then(response => {
        this.kslxOptions = response.data;
      });
      this.getDicts("sjzt").then(response => {
        this.getStatusList = response.data;
      });
      this.getDicts("paper_upload_type").then(response => {
        this.getCjscztList = response.data;
      });
      // 试卷管理-考试范围-开始部分
      this.getDicts("sjgl-ksfw-ksbf").then(response => {
        this.sjglKsfwKsbfList = response.data;
      });
      // 试卷管理-考试范围-结束部分
      this.getDicts("sjgl-ksfw-jsbf").then(response => {
        this.sjglKsfwJsbfList = response.data;
      });
      listTeachingMaterial().then(resp => {
        this.jsList = resp.data
      });
    },
    mounted() {
      this.getList();
      this.getListBjclass();
    },
    methods: {
      /** 查询考卷列表 */
      getList() {
        this.loading = true;
        listExaminationPaper(this.queryParams).then(response => {
          this.examinationPaperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 选择考试类型后动态显示隐藏考试范围
      onKslxClick(val){
        if("1"===val){
          this.showKsfw=true
          this.showKsfwKsJs=false
        }else{
          this.showKsfw=false
          this.showKsfwKsJs=true
        }
      },
      // 获取老师所带班级
      getListBjclass() {
        this.glrid = this.$store.state.user.glrid;
        //只查未毕业的
        listBjclass({statusArr: ["1", "3", "4"]}).then(res => {
          this.classList = res.rows;
          if (res.rows.length == 1) {
            this.queryParams.bjid = res.rows[0].id;
            this.form.bjid = res.rows[0].id;
          }
        });
      },
      // 考试类型字典翻译
      kslxFormat(row, column) {
        return this.selectDictLabel(this.kslxOptions, row.kslx);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 添加其他试卷取消按钮
      cancelQt() {
        this.openQt = false;
        this.resetQt();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          bjid: null,
          bjmc: null,
          lsid: null,
          kslx: null,
          ksnr: null,
          ksfw: null,
          jcid: null,
          jcmc: null,
          jwsjzt: null,
          lssjzt: null,
          kskssj: null,
          ksjssj: null,
          kssjwb: null,
          fssj: null,
          fsrid: null,
          fsrmc: null,
          status: "1",
          remark: null,
          dataOrder: null,
          addOrUpdateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null
        };
        this.resetForm("form");
      },
      // 其他试卷表单重置
      resetQt() {
        this.formQt = {
          id: null,
          bjid: null,
          bjmc: null,
          lsid: null,
          kslx: null,
          ksnr: null,
          ksfw: null,
          jcid: null,
          jcmc: null,
          jwsjzt: null,
          lssjzt: null,
          kskssj: null,
          ksjssj: null,
          kssjwb: null,
          fssj: null,
          fsrid: null,
          fsrmc: null,
          status: "1",
          remark: "添加的其他试卷",
          dataOrder: null,
          addOrUpdateTime: null,
          kzzd1: null,
          kzzd2: null,
          kzzd3: null,
          kzzd4: null,
          kzzd5: null

        };
        this.resetForm("formQt");
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
        this.ids = selection.map(item => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.form.lsxm = this.$store.state.user.nickName;
        this.form.lsid = this.$store.state.user.glrid;
        this.open = true;
        this.ksfw_ksbf="0" // 默认 0=五十音图
        if (this.classList.length == 1) {
          this.form.bjid = this.classList[0].id;
        }
        this.title = "添加考卷";
      },
      /** 新增其他试卷按钮操作 */
      handleAddQt() {
        this.resetQt();
        this.formQt.lsxm = this.$store.state.user.nickName;
        this.formQt.lsid = this.$store.state.user.glrid;
        this.openQt = true;
        this.ksfw_ksbf="0" // 默认 0=五十音图
        if (this.classList.length == 1) {
          this.formQt.bjid = this.classList[0].id;
        }
        this.title = "添加其他考卷";
      },
      /** 成绩是否上传查询操作 */
      statusQuery(uploadStaus) {
        this.queryParams.pageNum = 1;
        this.queryParams.kzzd2 = uploadStaus;
        this.getList();
      },
      /** 打开成绩上传对话框*/
      handleCjsc(row) {
        this.cjsc.open = true;
        this.cjscForm = row;
      },
      // 下载模板操作
      importTemplate() {
        this.download(
          "basic/examinationPaper/importClassGradeTemplate",
          {
            bjid: this.cjscForm.bjid
          },
          `考试-导入模板.xlsx`
        );
      },
      // 考试分析总结
      addKscjfxzj() {
        this.kscjzj = false;
        let json = {
          examPaperId: this.cjscForm.id,
          ksfxzj: this.getKscjzj,
        };
        addExamSummary(json).then(res => {
          this.$notify({
            message: res.msg,
            type: "success"
          });

        });
      },
      // 根据考试类型判断是否需要进行拼接赋值
      setFormKsfwValue(kslx){
        let ksfw=""
        if("1"!==kslx){ //考试类型不等于 1=课考，则进行赋值
          ksfw=this.ksfw_ksbf+"-"+this.ksfw_jsbf;
        }
        return ksfw;
      },
      /** 提交按钮 */
      submitForm() {
        // if (status === "3") {
        //   // this.form = status;
        //   this.form.lssjzt = status;
        // }
        this.form.ksfw=this.setFormKsfwValue(this.form.kslx)
        this.$refs.formState.validate(valid => {
          if (valid) {
            this.getClassList(this.form.bjid)
            if (this.form.id != null) {
              updateExaminationPaper(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addExaminationPaper(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 提交其他试卷按钮 */
      submitFormQt() {
        //老师试卷状态:其他试卷
        this.formQt.lssjzt = "4";
        //教务试卷状态:默认已发送
        this.formQt.jwsjzt = "1";
        this.formQt.ksfw=this.setFormKsfwValue(this.formQt.kslx)
        this.$refs.formState.validate(valid => {
          if (valid) {
            this.getClassList(this.formQt.bjid)
            if (this.formQt.id != null) {
              updateExaminationPaper(this.formQt).then(response => {
                this.msgSuccess("修改成功");
                this.openQt = false;
                this.getList();
              });
            } else {
              addExaminationPaper(this.formQt).then(response => {
                this.msgSuccess("新增成功");
                this.openQt = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 下载试卷 */
      handleExport(row) {
        this.download(
          "file/filetable/download",
          {
            kzzd1: row.id
          },
          `考卷-${row.bjmc}-${row.ksfw}.zip`
        );
        // // 修改老师试卷状态
        // this.submitForm("3"); by 2021/9/8可多次下载不改状态
      },
      /** 成绩导入按钮操作 */
      handleCjImport() {
        this.upload.title = "成绩数据导入";
        this.upload.open = true;
      },

      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.cjsc.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        // this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
        if(response.code==200){
          let json = {
            kzzd2: "3",
            id: this.cjscForm.id
          };
          // 改变老师试卷状态
          updateExaminationPaper(json).then(res => {
            this.kscjzj = true;
          });
          this.$notify({
            message: response.msg,
            type: "success"
          });
        }else {
          this.$notify({
            message: response.msg,
            type: "error"
          });
        }
        this.getList();

      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      //班级id 和 名称
      getClassList(value) {
        for (let i = 0; i < this.classList.length; i++) {
          if (this.classList[i].id == value) {
            this.form.bjid = value;
            this.form.bjmc = this.classList[i].rybjmc;
            this.formQt.bjid = value;
            this.formQt.bjmc = this.classList[i].rybjmc;
          }
        }
      },
      //教材id 和 名称
      getJcList(value) {
        for (let i = 0; i < this.jsList.length; i++) {
          if (this.jsList[i].id == value) {
            this.form.jcid = value;
            this.form.jcmc = this.jsList[i].jcmc;
            this.formQt.jcid = value;
            this.formQt.jcmc = this.classList[i].rybjmc;
          }
        }
      },
      // 考试类型字典翻译
      getKslx(row, column) {
        return this.selectDictLabel(this.kslxOptions, row.kslx);
      },
      // 考试状态字典翻译
      getKszt(row, column) {
        return this.selectDictLabel(this.getStatusList, row.lssjzt);
      },
      // 成绩上传状态字典翻译
      getCjsczt(row, column) {
        return this.selectDictLabel(this.getCjscztList, row.kzzd2);
      }
    }
  };
</script>
