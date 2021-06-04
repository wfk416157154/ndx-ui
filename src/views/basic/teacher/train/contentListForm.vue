<template>
  <div class="contentListForm">
    <el-button icon="el-icon-plus" size="mini" type="primary" @click="addContentList">新增</el-button>
    <br>
    <br>
    <el-table :data="contentList" @row-click.self="getProject">
      <el-table-column label="选项名称" align="center" prop="xxmc" />
      <el-table-column label="组件名称" align="center" prop="zjmc" />
      <el-table-column label="是否默认选中" align="center" prop="sfmrxz" />
      <el-table-column label="是否必填" align="center" prop="sfbt" />
      <el-table-column label="字数长度限制" align="center" prop="zscdxz" />
      <el-table-column label="是否启用" align="center" prop="sfqy">
        <template slot-scope="scope">
          <div @click.stop>
            <el-switch
              active-value="1"
              inactive-value="0"
              @change="getSwitch(scope.row)"
              v-model=" scope.row.sfqy"
            ></el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="tjsj" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.stop="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click.stop="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return {
            // 表格数据
            contentList : [],
            // 表单
            contentForm : {
                xxmc : "",
                zjmc : "",
                sfmrxz : "",
                sfbt : "",
                zscdxz : "",
                sfqy : "",
            }
        }
    },
    methods : {
        // 新增
        addContentList(){

        },
        // 编辑
        handleUpdate(row){
            console.log(row)
        },
        // 删除
        handleDelete(row){
            console.log(row)
        }
    }
};
</script>

<style lang="scss">
.contentListForm {
  padding: 20px;
  box-sizing: border-box;
}
</style>