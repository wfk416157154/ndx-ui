<template>
  <div class="add-curriculum">
    <div>
      <table style="width : 100%;" border="1" cellspacing="0">
        <tbody>
          <tr>
            <td class="tds">课程名称</td>
            <td>
              <el-input v-model="addCurriculum.name" placeholder="请输入内容"></el-input>
            </td>
          </tr>
          <tr>
            <td class="tds">所属视频类别</td>
            <td>
              <el-checkbox-group v-model="addCurriculum.checkList">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用"></el-checkbox>
                <el-checkbox label="选中且禁用"></el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">视频</td>
            <td>
              <el-checkbox-group v-model="addCurriculum.kc">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用"></el-checkbox>
                <el-checkbox label="选中且禁用"></el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="tds">
              课程介绍
              (选填）
            </td>
            <td>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="addCurriculum.textarea"
              ></el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCurriculum: {
        checkList: ["复选框 A"]
      }
    };
  },
  methods: {
    addSubjectSubmit() {
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.add-curriculum {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  th,
  td {
    padding: 40px;
  }
  .tds {
    width: 13%;
  }
}
</style>
