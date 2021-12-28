<template>
  <div class="handle-market">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">报销人</td>
          <td>{{from.applyName}}</td>
        </tr>
        <tr>
          <td class="tds">区域负责人</td>
          <td>
            <el-select v-model="form.areaId" placeholder="请选择区域负责人">
              <el-option label="吴珂" value="shanghai"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="tds">是否已开班</td>
          <td>
            <el-radio-group v-model="form.isClassCreate">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td class="tds">所用校区/班级</td>
          <td>
            <el-select v-model="form.region">
              <el-option label="武汉" value="shanghai"></el-option>
            </el-select>-
            <el-select v-model="form.region">
              <el-option label="a班" value="shanghai"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="tds">报销类型</td>
          <td></td>
        </tr>
        <tr>
          <td class="tds">发生时间</td>
          <td>
            <el-date-picker v-model="form.value1" type="date" placeholder="选择日期"></el-date-picker>
          </td>
        </tr>
        <tr>
          <td class="tds">
            费用金额
            大写
          </td>
          <td>
            <el-input v-model="input" placeholder="请输入金额"></el-input>
          </td>
        </tr>
        <tr>
          <td class="tds">费用说明</td>
          <td>
            <el-popover placement="right" width="400" trigger="click">
              <div>
                <p>7.15武汉-随州 火车票 50元</p>
                <p>7.18随州-武汉 火车票50元</p>
                <p>7.15-7.17随州住宿费3晚 住宿费300元</p>
                <p>随县二中23届3-10课打印费50元</p>
                <p>随县二中23届 21年下半年期中考试试卷打印费60元</p>
              </div>
              <el-button slot="reference" type="primary">查看填写模板</el-button>
            </el-popover>
            <br />
            <br />
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="form.textarea"></el-input>
          </td>
        </tr>
        <tr>
          <td class="tds">附件</td>
          <td>
            <el-select v-model="form.region">
              <el-option label="电子发票" value="shanghai"></el-option>
            </el-select>
            <br />
            <br />
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </td>
        </tr>
        <tr>
          <td class="tds">审批</td>
          <td>李翠平</td>
        </tr>
        <tr>
          <td class="tds">操作</td>
          <td>
            <el-button type="success">提 交</el-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  addExpense,
  editExpense,
  listExpense,
  getClassInfo
} from "@/api/basic/cw-teacher";
export default {
  data() {
    return {
      form: {}
    };
  }
};
</script>

<style lang="scss" scoped>
.handle-market {
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
