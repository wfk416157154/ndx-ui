<template>
  <div class="public-reimbursement-details">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">报销人</td>
          <td>张三</td>
        </tr>
        <tr>
          <td class="tds">所属部门</td>
          <td>随县二中20级21届</td>
        </tr>
        <tr>
          <td class="tds">报销类型</td>
          <td>电话费：电话费发票、手机费发票。</td>
        </tr>
        <tr>
          <td class="tds">发生时间</td>
          <td>2021-10-21</td>
        </tr>
        <tr>
          <td class="tds">
            费用金额
            大写
          </td>
          <td>281.00元（捌拾壹圆）</td>
        </tr>
        <tr>
          <td class="tds">费用说明</td>
          <td>
            7.15武汉-随州 火车票 50元
            7.18随州-武汉 火车票50元
            7.15-7.17随州住宿费3晚 住宿费300元
            随县二中23届3-10课打印费50元
            随县二中23届 21年下半年期中考试试卷打印费60元
          </td>
        </tr>
        <tr>
          <td class="tds">附件</td>
          <td>
            1.报销类型+姓名+当前上传时间.jpg
            2.报销类型+姓名+当前上传时间.pdf
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="tds">支付方式</td>
          <td>
            <el-select placeholder>
              <el-option label="区域一" value="shanghai"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="tds">审批意见</td>
          <td>
            <editor :min-height="300" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.public-reimbursement-details {
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
