<template>
  <div class="mark-exam-papers">
    <div class="subject">
      <UL style="list-style : none">
        <li>
          <div>
            <p>一, は降雨量は少ないですが、気温の上下【うえしは降雨量は少ないですが、気温の上下【うえしは降雨量は少ないですが、気温の上下【うえしは降雨量は少ないですが、気温の上下【うえしは降雨量は少ないですが、気温の上下【うえし</p>
          </div>
          <br />
          <div>
            <h3>答案解析</h3>
            <editor v-model="getKscjzj" :disabled="true" :min-height="300" />
          </div>
          <div class="score">
            <h3>评分</h3>
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
              <el-form-item label="得分">
                <el-input v-model="formLabelAlign.name"></el-input>
              </el-form-item>
              <el-form-item label="评语">
                <editor v-model="getKscjzj" :min-height="300" />
              </el-form-item>
            </el-form>
          </div>
        </li>
      </UL>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: ""
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.mark-exam-papers {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  .subject {
  }
  .score {
    margin-top: 40px;
  }
}
</style>
