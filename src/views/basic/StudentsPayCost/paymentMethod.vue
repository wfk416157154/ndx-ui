<template>
  <div class="paymentMethod">
    <div style="margin-bottom : 20px">
      <el-button size="mini" type="primary" class="el-icon-plus" @click="addForm">添加进账方式</el-button>
    </div>
    <el-table :data="paymentMethodList" :border="true" style="width: 100%">
      <el-table-column label="进帐名称" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.url"
            :preview-src-list="[scope.row.url]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="支付宝" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.url"
            :preview-src-list="[scope.row.url]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="银行卡" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.yhk }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加进账方式" :visible.sync="dialogFormVisible">
      <el-form :model="paymentMethodForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="paymentMethodForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="支付宝">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="银行卡">
          <el-input v-model="paymentMethodForm.yhk" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePaymentMethod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentMethodList: [
        {
          type: "武汉南斗星",
          name: "王小虎",
          url:
            "https://img0.baidu.com/it/u=1020381104,3086714632&fm=26&fmt=auto&gp=0.jpg",
          yhk: "中国工商银行62255422555666622武汉支行"
        },
        {
          type: "科万",
          name: "王小虎",
          url:
            "https://img0.baidu.com/it/u=1020381104,3086714632&fm=26&fmt=auto&gp=0.jpg",
          yhk: "中国工商银行62255422555666622武汉支行"
        }
      ],
      dialogFormVisible: false,
      paymentMethodForm: {
        type: "",
        name: "",
        url: "",
        yhk: ""
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      this.paymentMethodForm = row;
      this.dialogFormVisible = true;
    },
    addForm() {
      this.reset();
      this.dialogFormVisible = true;
    },
    reset() {
      this.paymentMethodForm = {
        type: null,
        name: null,
        url: null,
        yhk: null
      };
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    savePaymentMethod() {
        console.log('submit')
    }
  }
};
</script>

<style lang="scss" scoped>
.paymentMethod {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>