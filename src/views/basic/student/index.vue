<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="校区名称" prop="xqmc" v-if="xqIsShow">
        <el-select v-model="queryParams.xqmc" filterable placeholder="请选择校区名称" @change="xqmcOnChange">
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.xxmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日语班" prop="ryb">
        <el-select v-model="queryParams.ryb" filterable placeholder="请选择日语班级">
          <el-option
            v-for="item in bjclassList "
            :key="item.id"
            :label="item.rybjmc"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原班级" prop="ybj">
        <el-input
          v-model="queryParams.ybj"
          placeholder="可模糊查询原班级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="xsxm">
        <el-input
          v-model="queryParams.xsxm"
          placeholder="可模糊查询学生姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="xb">
        <el-select v-model="queryParams.xb" placeholder="请选择性别" clearable size="small">
          <el-option
            v-for="dict in xbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选科" prop="xk">
        <el-select v-model="queryParams.xk" placeholder="请选择选科" clearable size="small">
          <el-option
            v-for="dict in xkOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px" label="是否特长生" prop="sftcs">
        <el-select v-model="queryParams.sftcs" placeholder="请选择是否特长生" clearable size="small">
          <el-option
            v-for="dict in sftcsOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px" label="班主任姓名" prop="bzrxm">
        <el-input
          v-model="queryParams.bzrxm"
          placeholder="可模糊查询班主任姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>-->
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
          v-hasPermi="['basic:student:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basic:student:edit']"
        >修改</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basic:student:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['basic:student:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          :disabled="single"
          @click="addStuTalk"
        >添加学生谈话</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          :disabled="single"
          @click="lookStuTalk"
        >查看谈话内容</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      border
      v-loading="loading"
      :data="studentList"
      :height="$root.tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column v-if="false" label="状态" align="center" prop="id" />
      <el-table-column label="学生头像" align="center" prop="xstx">
        <template slot-scope="scope">
          <img style="width : 80px; hieght : 80px" :src="scope.row.xstx" />
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" align="center" prop="xsxm">
        <template slot-scope="scope">
          <a href="#">
            <span
              style="margin-left: 10px;color: #00afff"
              @click="showStudentDetailsPage(scope.row)"
            >{{ scope.row.xsxm }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="学生编号" align="center" prop="xsbh" />
      <el-table-column label="校区名称" align="center" prop="xqmc" />
      <el-table-column label="原班级" align="center" prop="ybj" />
      <el-table-column label="日语班" align="center" prop="rybjmc" width="180" />
      <el-table-column label="入班时间" align="center" prop="rbsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rbsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="xb" :formatter="xbFormat" />
      <el-table-column label="选科" align="center" prop="xk"  />
      <el-table-column label="英语分数" align="center" prop="yyfs" />
      <el-table-column label="综合分数" align="center" prop="zhfs" />
      <el-table-column label="QQ号" width="120px" align="center" prop="qqh" />
      <el-table-column label="学生电话" width="120px" align="center" prop="xsdh" />
      <el-table-column label="家庭住址" align="center" prop="jtzz" />
      <el-table-column label="是否特长生" align="center" prop="sftcs" :formatter="sftcsFormat" />
      <el-table-column label="家长姓名" align="center" prop="jzxm" />
      <el-table-column label="家长电话" width="120px" align="center" prop="jzdh" />
      <el-table-column label="班主任姓名" align="center" prop="bzrxm" />
      <el-table-column label="班主任电话" width="120px" align="center" prop="bzrdh" />
      <!-- <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" /> -->
      <el-table-column label="备注" width="120px" align="center" prop="remark" />
      <el-table-column label="退班时间" align="center" prop="tbsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.tbsj, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:student:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:student:remove']"
          >删除</el-button>
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

    <!-- 添加或修改学生信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form class="wrap-el-form" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label-width="100px" label="学生头像" prop="xstx">
          <el-upload
            class="avatar-uploader"
            :action="upload.fileUrl"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label-width="100px" label="校区名称" prop="xqmc">
            <el-select v-model="form.xqmc" filterable placeholder="请选择校区名称">
              <el-option
                v-for="item in schoolList"
                :key="item.id"
                :label="item.xxmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="原班级" prop="ybj">
            <el-input maxlength="30" v-model="form.ybj" placeholder="请输入原班级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="日语班" prop="ryb">
            <!-- <el-input maxlength="30" v-model="form.ryb" placeholder="请输入日语班" /> -->
            <el-select v-model="form.ryb" filterable placeholder="请选择日语班" >
              <el-option
                v-for="item in bjclassList"
                :key="item.id"
                :label="item.rybjmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="入班时间" prop="rbsj">
            <el-date-picker
              clearable
              size="small"
              v-model="form.rbsj"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择入班时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label-width="100px" label="学生姓名" prop="xsxm">
            <el-input maxlength="4" v-model="form.xsxm" placeholder="请输入学生姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="性别">
            <el-radio-group v-model="form.xb">
              <el-radio
                v-for="dict in xbOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="选科" >
            <!-- <el-radio-group v-model="form.xk">
              <el-radio
                v-for="dict in xkOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group> -->
             <el-input maxlength="5" v-model="form.xk" placeholder="请输入学科" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="英语分数" prop="yyfs">
            <el-input maxlength="5" v-model="form.yyfs" placeholder="请输入英语分数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="综合分数" prop="zhfs">
            <el-input maxlength="5" v-model="form.zhfs" placeholder="请输入综合分数" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="QQ号" prop="qqh">
            <el-input maxlength="12" v-model="form.qqh" placeholder="请输入QQ号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="学生电话" prop="xsdh">
            <el-input maxlength="11" v-model="form.xsdh" placeholder="请输入学生电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="家庭住址" prop="jtzz">
            <el-input maxlength="50" v-model="form.jtzz" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="是否特长生" prop="sftcs">
            <el-select v-model="form.sftcs" placeholder="请选择是否特长生">
              <el-option
                v-for="dict in sftcsOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="家长姓名" prop="jzxm">
            <el-input maxlength="4" v-model="form.jzxm" placeholder="请输入家长姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="家长电话" prop="jzdh">
            <el-input maxlength="11" v-model="form.jzdh" placeholder="请输入家长电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="班主任姓名" prop="bzrxm">
            <el-input maxlength="4" v-model="form.bzrxm" placeholder="请输入班主任姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="班主任电话" prop="bzrdh">
            <el-input maxlength="11" v-model="form.bzrdh" placeholder="请输入班主任电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="退班时间" prop="tbsj">
            <el-date-picker
              clearable
              size="small"
              v-model="form.tbsj"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择退班时间"
              disabled="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item label-width="100px" label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                disabled
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
              >{{dict.dictLabel}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>-->
        <!-- <el-col :span="12"> -->
        <el-form-item label-width="100px" label="
        备注" prop="remark">
          <el-input maxlength="300" type="textarea" v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <!-- </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 老师学生谈话数据表格对话框 -->
    <el-dialog border :title="title" :visible.sync="openStuGrid" width="1000px" append-to-body>
      <el-table border v-loading="loading" :data="teacherTalkList">
        <el-table-column type="selection" width="55" v-if="false" align="center" />
        <el-table-column label="id" align="center" v-if="false" prop="id" />
        <el-table-column label="老师姓名" align="center" prop="lsxm" />
        <el-table-column label="学生姓名" align="center" prop="xsxm" />
        <el-table-column label="谈话时间" align="center" prop="thsj" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.thsj, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="谈话原因" align="center" prop="thyy" />
        <el-table-column label="谈话内容" align="center" prop="thnr" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" prop="remark">
          <template slot-scope="scope">
            <a href="#" v-if="null!=scope.row.kzzd1">
              <span
                style="margin-left: 10px;color: dodgerblue"
                @click="downloadTalkUploadFile(scope.row)"
              >下载谈话文件</span>
            </a>
            <a href="#" v-else>
              <span style="margin-left: 10px;color: red">未上传</span>
            </a>
          </template>
        </el-table-column>
      </el-table>

      <!--<pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />-->
    </el-dialog>

    <!-- 添加或修改老师学生谈话对话框 -->
    <el-dialog :title="title" :visible.sync="openStu" width="500px" append-to-body>
      <el-form ref="stuform" :model="formStu" :rules="stuformrules" label-width="80px">
        <!--<el-form-item label="老师id" prop="lsid">
          <el-input v-model="formStu.lsid" placeholder="请输入老师id" />
        </el-form-item>-->
        <el-form-item label="老师姓名" prop="lsxm">
          <el-input v-model="formStu.lsxm" readonly placeholder="请输入老师姓名" />
        </el-form-item>
        <!--<el-form-item label="学生id" prop="xsid">
          <el-input v-model="formStu.xsid" placeholder="请输入学生id" />
        </el-form-item>-->
        <el-form-item label="学生姓名" prop="xsxm">
          <el-input v-model="formStu.xsxm" readonly placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="谈话时间" prop="thsj">
          <el-date-picker
            clearable
            size="small"
            v-model="formStu.thsj"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择谈话时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="谈话原因" prop="thyy">
          <el-input v-model="formStu.thyy" placeholder="请输入谈话原因" />
        </el-form-item>
        <el-form-item label="谈话内容" prop="thnr">
          <el-input v-model="formStu.thnr" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formStu.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="文件上传" prop="kzzd1">
          <el-upload
            class="upload-demo"
            ref="uploadFile"
            :disabled="uploadFileDisabled"
            drag
            :limit="1"
            :headers="uploadFile.headers"
            :action="uploadFile.fileUrl"
            :before-upload="beforeFileUpload"
            :on-progress="handleFileUploadProgress"
            :on-success="handleXsthFileSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">仅限上传一个文件，且文件大小不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-prevent-re-click
          :disabled="submitStuFormButton"
          @click="submitStuForm"
        >确 定</el-button>
        <el-button @click="cancelStu">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
        v-loading="fullscreenLoading"
        element-loading-text="正在进行数据导入·······"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!--<el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据-->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
          <el-link type="info" style="margin-left:50px ;font-size:12px;color: red" v-if="checkFailExcel" @click="downloadFailExcel">查看错误信息</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-prevent-re-click :disabled="importBtn" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStudent,
  getStudent,
  delStudent,
  addStudent,
  updateStudent
} from "@/api/basic/student";
import {
  listTeacherTalk,
  getTeacherTalk,
  delTeacherTalk,
  addTeacherTalk,
  updateTeacherTalk
} from "@/api/basic/teacherTalk";
import { listBjclass } from "@/api/basic/bjclass";
import { listSchool } from "@/api/basic/school";
import { addImg, addFile } from "@/api/tool/common";
import { getToken } from "@/utils/auth";
import { secretKey } from "@/utils/tools";

export default {
  name: "Student",
  components: {},
  data() {
    return {
      xqIsShow: true,
      // 遮罩层
      loading: true,
      submitStuFormButton: false,
      // 选中数组
      ids: [],
      stuRow: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 默认启用
      uploadFileDisabled: false,
      // 总条数
      total: 0,
      // 学生信息表格数据
      studentList: [],
      // 老师谈话内容表格数据
      teacherTalkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      openStu: false,
      // 是否显示弹出层
      openStuGrid: false,
      // 性别字典
      xbOptions: [],
      // xk字典
      xkOptions: [],
      // 是否特长生字典
      sftcsOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqmc: null,
        ybj: null,
        ryb: null,
        xsxm: null,
        xb: null,
        xk: null,
        sftcs: null,
        bzrxm: null,
        status: null
      },
      xqQueryParams: {
        id: null ,//班级关联校区id
      },
      // 表单参数
      form: {},
      // 表单参数
      formStu: {},
      // 学生头像
      imageUrl: "",
      // 校区名称
      campusName: [],
      // 原班级
      originalClass: [],
      // 日语班
      japaneseClass: [],
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/basic/student/importData",
        // 上传图片地址
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      uploadFile: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        fileUrl: process.env.VUE_APP_BASE_API + "/file/upload"
      },
      uploadData: {},
      // 表单校验
      rules: {
        xqmc: [
          { required: true, message: "请选择一个校区名称", trigger: "blur" }
        ],
        ybj: [{ required: true, message: "请选择原班级", trigger: "blur" }],
        ryb: [
          { required: true, message: "请输入日语班级名称", trigger: "blur" }
        ],
        xsxm: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
        xk: [{ required: true, message: "不能为空", trigger: "blur" }],
        yyfs: [
          {
            required: true,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        zhfs: [
          {
            required: true,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        qqh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9 a-z]+$/
          }
        ],
        xsdh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        jzdh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        bzrdh: [
          {
            required: false,
            message: "格式不对,只能填写数字",
            trigger: "blur",
            pattern: /^[0-9]+$/
          }
        ],
        sfzh: [
          {
            required: false,
            message: "格式不对",
            trigger: "blur",
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
          }
        ]
      },
      stuformrules: {},
      //校区信息
      schoolList: [],
      // 班级选择
      bjclassList: [],
      fullFilePath:null,
      checkFailExcel:false,
      importBtn:false,
      fullscreenLoading:false
    };
  },
  created() {
    listBjclass().then(response => {
      this.bjclassList = response.rows
      // 日语班级选项 -当老师角色登录
      if(this.$store.state.user.dataRoleWeightId==50){
        if (response.rows.length==1){
          this.queryParams.ryb=response.rows[0].id
        }
      }
    });
    this.getDicts("sys_user_sex").then(response => {
      this.xbOptions = response.data;
    });
    this.getDicts("xkType").then(response => {
      this.xkOptions = response.data;
    });
    this.getDicts("isOrNot").then(response => {
      this.sftcsOptions = response.data;
    });
    this.getDicts("basic_status").then(response => {
      this.statusOptions = response.data;
    });
    listSchool().then(response => {
      this.schoolList = response.rows;
      if (this.schoolList.length==1){
        this.xqIsShow =false;
      }
    });
    this.$store.state.adminleftnavnum = "0"; //设置左侧导航2-2 active
  },
  mounted() {
    let bjid=this.$route.params.bjid;
    if(bjid!==":bjid"){// 从班级信息页面跳转过来时带的班级id参数
      this.queryParams.ryb=bjid
    }
    this.getList();
    this.$store.state.adminleftnavnum = "0"; //设置左侧导航2-2 active
  },
  methods: {
    xqmcOnChange(id){
      listBjclass({kzzd1:id}).then(response => {
        this.bjclassList = response.rows
      });
    },
    showStudentDetailsPage(row) {
      // 获取页面中参数配置的路由
      this.getConfigKey("showStudentDetails").then(resp => {
        this.router = resp.msg;
        this.$router.push({
          path: this.router + row.id
        });
      });
    },
    /** 查询学生信息列表 */
    getList() {
      this.loading = true;
      listStudent(this.queryParams).then(response => {
        this.studentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },

    /** 查询老师学生谈话列表 */
    getTeacherTalkList(id) {
      this.loading = true;
      listTeacherTalk({ xsid: id }).then(response => {
        this.teacherTalkList = response.rows;
        this.loading = false;
      });
    },

    /*selectBjclass(obj) {
      this.form.ryb = obj.rybjmc;
      this.form.kzzd1 = obj.id;
    },*/
    // 性别字典翻译
    xbFormat(row, column) {
      return this.selectDictLabel(this.xbOptions, row.xb);
    },
    // 选科字典翻译
    xkFormat(row, column) {
      return this.selectDictLabel(this.xkOptions, row.xk);
    },
    // 是否特长生字典翻译
    sftcsFormat(row, column) {
      return this.selectDictLabel(this.sftcsOptions, row.sftcs);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    cancelStu() {
      this.openStu = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        xstx: null,
        xqmc: null,
        ybj: null,
        ryb: null,
        rbsj: null,
        tbsj: null,
        xsbh: null,
        xsxm: null,
        xb: "0",
        xk: null,
        yyfs: null,
        zhfs: null,
        qqh: null,
        xsdh: null,
        jtzz: null,
        sftcs: null,
        jzxm: null,
        jzdh: null,
        bzrxm: null,
        bzrdh: null,
        status: "1",
        remark: null,
        userId: null,
        uName: null,
        orgBh: null,
        orgName: null,
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
    // 表单重置
    resetStu() {
      this.formStu = {
        id: null,
        lsid: null,
        lsxm: null,
        xsid: null,
        xsxm: null,
        thsj: null,
        thyy: null,
        thnr: null,
        remark: null,
        userId: null,
        userName: null,
        createTime: null,
        updateTime: null,
        kzzd1: null,
        kzzd2: null,
        kzzd3: null,
        kzzd4: null,
        kzzd5: null
      };
      this.resetForm("formStu");
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
      selection.map(item => {
        this.ids = item.id;
        this.stuRow = item;
      });
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生信息";
      this.imageUrl = null;
    },
    // 文件导入
    handleUpload() {},
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生信息";
        this.imageUrl = response.data.xstx;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStudent(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudent(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
        if (Object.keys(this.uploadData).length == 0) {
          return;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除学生信息编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delStudent(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(e => {
          console.log(e);
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "basic/student/export",
        {
          ...this.queryParams
        },
        `学生信息基础表.xlsx`
      );
    },
    //学生头像处理
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.uploadData = res.data;
      this.form.xstx = res.data.wjlj;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    },

    /** 导入按钮操作 */
    handleImport() {
      this.importBtn=false
      this.upload.title = "学生信息导入";
      this.upload.open = true;
      this.checkFailExcel=false
      this.upload.isUploading = false;
      this.$nextTick(() => {
        // 页面元素加载完成后执行该方法
        this.$refs.upload.clearFiles();
      });
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "basic/student/importTemplate",
        {
          ...this.queryParams
        },
        `学生信息导入模板_${new Date().getTime()}.xlsx`
      );
    },

    /** 下载导入失败的excel */
    downloadFailExcel() {
      this.download(
        "basic/basicCommonController/download",
        {
          fullFilePath:this.fullFilePath
        },
        `学生信息导入-校验未通过数据详情_${new Date().getTime()}.xlsx`
      );
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      this.submitStuFormButton = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      if(undefined!=response.data){
        this.fullFilePath=response.data
        this.checkFailExcel=true
        this.notify(true,"warning","导入数据警告，校验不通过，请查看错误信息",response.msg)
      }else if(undefined!=response.code&&response.code==500){
        this.notify(false,"error","导入失败，请联系技术管理员",response.msg)
      }else{
        this.notify(false,"success","导入成功",response.msg)
        this.getList();
      }
    },
    // 提交上传文件
    submitFileForm() {
      this.importBtn=true
      this.fullscreenLoading = true;
      this.$refs.upload.submit();
    },
    notify(flag,type,title,msg){
      this.upload.open = flag;
      this.upload.isUploading = flag;
      this.$refs.upload.clearFiles();
      this.$notify({
        title: title,
        message: msg,
        type: type
      });
    },
    // 学生谈话文件上传成功处理
    handleXsthFileSuccess(response, file, fileList) {
      this.formStu.id = secretKey();
      this.upload.open = false;
      this.upload.isUploading = false;
      let obj = response.data;
      obj.kzzd1 = this.formStu.id;
      this.uploadFileDisabled = true;
      addFile(obj).then(res => {
        this.$notify({
          title: "上传成功",
          message: response.msg,
          type: "success"
        });
        this.formStu.kzzd1 = obj.name;
        this.submitStuFormButton = false;
      });
    },
    //添加谈话内容
    addStuTalk() {
      this.resetStu();
      this.uploadFileDisabled = false;
      let loginUser = this.$store.state.user;
      this.formStu.lsid = loginUser.glrid;
      this.formStu.lsxm = loginUser.nickName;
      this.formStu.xsid = this.stuRow.id;
      this.formStu.xsxm = this.stuRow.xsxm;
      this.openStu = true;
      this.title = "添加学生谈话";
      this.$nextTick(() => {
        // 页面元素加载完成后执行该方法
        this.$refs.uploadFile.clearFiles();
      });
    },
    // 查看谈话内容
    lookStuTalk() {
      this.openStuGrid = true;
      const id = this.ids;
      this.getTeacherTalkList(id);
    },
    // 下载谈话文件
    downloadTalkUploadFile(row) {
      this.download(
        "file/filetable/download",
        {
          wjmc: row.kzzd1
        },
        row.kzzd1
      );
    },
    /** 提交按钮 */
    submitStuForm() {
      this.$refs["stuform"].validate(valid => {
        if (valid) {
          /*if (this.formStu.id != null) {
              updateTeacherTalk(this.formStu).then(response => {
                this.msgSuccess("修改谈话内容成功");
                this.openStu = false;
              });
            } else {*/
          addTeacherTalk(this.formStu).then(response => {
            this.msgSuccess("新增谈话内容成功");
            this.openStu = false;
          });
          /* }*/
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  float: none;
  display: inline-block;
}

.wrap-el-form {
  padding-right: 35px;
  box-sizing: border-box;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.header {
  width: 100%;
  padding: 10px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #652c11;
  letter-spacing: 2px;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
