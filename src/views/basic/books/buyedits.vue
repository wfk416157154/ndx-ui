<template>
  <div class="contaiiner">
    <h3>申请填写</h3>
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="邮寄时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formData.postDate"
            style="width:100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="快递单号">
        <el-input v-model="formData.trackingNumber"></el-input>
      </el-form-item>
      <el-form-item label="使用班级" prop="className">
        <el-input v-model="formData.className"></el-input>
      </el-form-item>
      <el-form-item label="收件人" prop="recipientName">
        <el-input v-model="formData.recipientName"></el-input>
      </el-form-item>
      <el-form-item label="收件人地址" prop="recipientAddress">
        <el-input v-model="formData.recipientAddress"></el-input>
      </el-form-item>

      <!-- 资料名称 -->
      <el-form-item label="资料名称" id="zl">
        <div id="zlk" v-for="(item,index) in basicList" :key="index">
          <el-select v-model="item.kzzd1" clearable placeholder="请选择" class="sel">
            <el-option
              v-for="dict in materialName"
              :label="dict.dictLabel"
              :key="dict.dictValue"
              :value="dict.dictValue"
            />
          </el-select>
          <el-input-number
            v-model="item.materialCount"
            @change="handleChange"
            :min="0"
            label="描述文字"
            size="mini"
            class="numbox"
          ></el-input-number>
          <el-button icon="el-icon-plus" circle @click="addBar"></el-button>
          <el-button icon="el-icon-minus" circle @click="delBar(index)"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="快递" prop="postType">
        <el-select v-model="formData.postType" clearable placeholder="请选择快递方式" class="sel">
          <el-option
            v-for="dict in postType"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="materialType">
        <el-select v-model="formData.materialType" clearable placeholder="请选择类型" class="sel">
          <el-option
            v-for="dict in materialType"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="formData.remark"></el-input>
      </el-form-item>
      <el-form-item class="btnbox">
        <el-button type="primary" @click="onSubmit" class="btn">保存</el-button>
        <el-button type="primary" @click="cancel" class="btn">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addPost, updatePost } from "../../../api/basic/buydata";
export default {
  data() {
    return {
      // 资料名称字典
      materialName: [],
      // 快递方式字典
      postType: [],
      // 资料分类字典
      materialType: [],
      // 资料名称循环数组
      basicList: [],
      formData: {
        id: "", //主键
        postDate: "",
        className: "",
        materialCount: 1, //资料数量
        kzzd1: "",
        basicPostMaterialList: [],
        status: "1"
      },
      // 表单验证必填
      rules: {
        className: [
          { required: true, trigger: blur, message: "此为必填项，请输入班级" }
        ],
        recipientName: [
          {
            required: true,
            trigger: blur,
            message: "此为必填项，请输入收件人姓名"
          }
        ],
        recipientAddress: [
          {
            required: true,
            trigger: blur,
            message: "此为必填项，请输入收件人地址"
          }
        ],
        postType: [
          {
            required: true,
            trigger: blur,
            message: "此为必填项，请选择邮寄方式"
          }
        ],
        materialType: [
          { required: true, trigger: blur, message: "此为必填项，请选择分类" }
        ]
      }
    };
  },
  created() {
    this.basicList.push(this.addRow());
    // 快递方式使用字典选择下拉框内容
    this.getDicts("express_type").then(response => {
      this.postType = response.data;
    });
    // 资料分类使用字典选择下拉框内容
    this.getDicts("post_material_tpye").then(response => {
      this.materialType = response.data;
    });
    // 资料名称使用字典选择下拉框内容
    this.getDicts("material_price_list").then(response => {
      this.materialName = response.data;
    });
  },
  mounted() {
    this.formData = this.$route.query;
    if (this.basicList.length && this.$route.query.basicPostMaterialList) {
      this.basicList = this.$route.query.basicPostMaterialList;
    }
  },
  methods: {
    // 添加多行条例
    addBar() {
      this.basicList.push(this.addRow());
    },
    addRow() {
      return {
        materialCount: 0, //资料数量
        materialName: "" //资料名称
      };
    },
    // 删除指定行
    delBar(i) {
      if (i >= 1) {
        this.basicList.splice(i, 1);
      }
    },
    //计步器
    handleChange(value) {},

    // 提交按钮
    onSubmit() {
      this.formData.status = "1";
      this.$refs["formData"].validate(valid => {
        this.formData.basicPostMaterialList = this.basicList;
        if (valid) {
          let router="";
          this.getConfigKey("Mail-purchase-Information-list").then(resp => {
            router = resp.msg;
            if (this.formData.id != null) {
              updatePost(this.formData).then(response => {
                if (response.code == 200) {
                  this.msgSuccess("修改成功");
                  this.$router.push(router);
                }
              });
            } else {
              addPost(this.formData).then(response => {
                this.msgSuccess("新增成功");
                this.$router.push(router);
              });
            }
          })
        }
      });
    },
    // 取消按钮
    cancel() {
      this.$router.go(-1)
    }
  }
};
</script>

<style>
.contaiiner {
  width: 100%;
  margin: 0 auto;
  padding: 50px;
  box-sizing: border-box;
}
h3 {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 15px;
}
.sel {
  width: 50%;
  margin-right: 10px;
}
.numbox {
  margin-right: 10px;
}
.btnbox {
  width: 100%;
  text-align: center;
}
.btn {
  width: 120px;
  margin-right: 15px;
}
#zlk {
  margin-bottom: 5px;
}
</style>
