<template>
  <div class="teacher-training-home-details">
    <table style="width : 100%;" border="1" cellspacing="0">
      <tbody>
        <tr>
          <td class="tds">姓名</td>
          <td>张三</td>
        </tr>
        <tr>
          <td class="tds">培训时间</td>
          <td>分配时间-至-培训结束时间(培训老师审核 培训合格)</td>
        </tr>
        <tr>
          <td class="tds">考试分数</td>
          <td>备课规范：54/80分|课堂管控：100分</td>
        </tr>
        <tr>
          <td class="tds">高考试卷分数</td>
          <td>
            <span>115</span>
          </td>
        </tr>
        <tr>
          <td class="tds">培训过程</td>
          <td>
            <div class="demo-image__preview">
              <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList"></el-image>
            </div>
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td class="tds">培训过程</td>
          <td>
            <el-form class="demo-form-inline">
              <el-form-item label="座位表" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
              <el-form-item label="备课规范" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
              <el-form-item label="早读" label-width="120px">
                <div class="demo-image__preview">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="url"
                    :preview-src-list="srcList"
                  ></el-image>
                </div>
              </el-form-item>
            </el-form>
          </td>
        </tr>
        <tr>
          <td class="tds">备注</td>
          <td>
            <editor  :min-height="300" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: "",
        region: ""
      },
      total: 0,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.teacher-training-home-details {
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
