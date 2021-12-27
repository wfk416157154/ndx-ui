<template>
  <div class="print-page">
    <div class="content-wrap">
      <el-card shadow="hover">
        <h2>数据打印</h2>
        <div style="float : right">
          <el-button @click="onPrintJs" type="primary">打印</el-button>
        </div>
        <br />
        <br />
        <div id="printRef">
          <table style="width : 100%;text-align:center" border="1" cellspacing="0">
            <tbody>
              <tr>
                <td class="tds" style="width : 180px">编号</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >HN1000001</div>
                    <div
                      style="width : 20%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >提交时间</div>
                    <div style="width : 40%;height : 60px ; line-height : 60px">2021-11-05 08：40</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">申请人</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >钱梦轩</div>
                    <div
                      style="width : 20%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >所在部门</div>
                    <div style="width : 40%;height : 60px ; line-height : 60px">直属-随州-随县二中20级21届</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">报销类型</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >办公用品：办公用品发票（带明细）。</div>
                    <div
                      style="width : 20%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >发生时间</div>
                    <div style="width : 40%;height : 60px ; line-height : 60px">2021-10-25</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="tds">金额</td>
                <td style="padding : 20px">1287.50元（壹仟贰佰捌拾柒圆伍角。</td>
              </tr>
              <tr>
                <td class="tds">费用说明</td>
                <td style="padding : 20px">
                  襄州一中合伙人石习奎
                  附件1:11月15号从邓州到襄阳火车票12.5元
                  附件2:襄州一中11月15—11月21日住宿费780元
                  附件3:11月20号试听课往返火车票222元
                  附件4:12月1号襄州一中正式开课沟通对接火车票130元
                  附件5:12月4号返回武汉火车票65+78=143元
                </td>
              </tr>
              <tr>
                <td class="tds">初审</td>
                <td>
                  <div style="width:100%;display:flex">
                    <div
                      style="width : 40%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >
                      李翠平
                      2021-11-02 10：52
                    </div>
                    <div
                      style="width : 20%;height : 60px ;border-right:2px solid #000; line-height : 60px"
                    >复审</div>
                    <div style="width : 40%;height : 60px ; line-height : 60px">
                      苏海燕
                      2021-11-02 12:52
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <!-- <img
            width="80%"
            src="https://d1icd6shlvmxi6.cloudfront.net/gsc/LSKMZO/4b/e7/8d/4be78dd161f74573a4da5f27c433589c/images/%E6%89%93%E5%8D%B0/u168.png?token=54d953f0a6777c7a63528414906445d3f414473970e64f1c61bd361623e49956"
            alt
          /> -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import printJs from "@/components/print";
export default {
  mixins: [printJs]
};
</script>

<style lang="scss" scoped>
.print-page {
  width: 100%;
  padding: 100%;
  padding: 40px;
  box-sizing: border-box;
  .content-wrap {
    text-align: center;
  }
  #printRef {
    margin-top: 20px;
  }
  th,
  td {
    // height: 60px;
  }
  .tds {
    width: 25%;
  }
}
</style>
