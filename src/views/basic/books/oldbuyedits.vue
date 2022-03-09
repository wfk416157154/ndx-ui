<template>
  <div class="contaiiner">
    <h3>申请填写</h3>
    <el-form ref="formData" :model="formData" label-width="120px">
      <el-form-item label="邮寄时间">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="formData.postDate"
            style="width:100%;"
          ></el-date-picker>
        </el-col>
        <!-- <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="formData.date2" style="width: 100%;"></el-time-picker>
        </el-col>-->
      </el-form-item>

      <el-form-item label="快递单号">
        <el-input v-model="formData.trackingNumber"></el-input>
      </el-form-item>
      <el-form-item label="使用班级">
        <el-input v-model="formData.className"></el-input>
      </el-form-item>
      <el-form-item label="收件人">
        <el-input v-model="formData.recipientName"></el-input>
      </el-form-item>
      <el-form-item label="收件人地址">
        <el-input v-model="formData.recipientAddress"></el-input>
      </el-form-item>

      <!-- 资料名称 -->
      <el-form-item label="资料名称" id="zl">
        <!-- <el-select v-for="index of formData.materialCount" :key="index" placeholder="请选择" class="sel"> -->
        <!-- <div id="zlk" v-for="index of formData.materialCount" :key="index" > -->
        <div id="zlk" v-for="(item,index) in ziliaoCount" :key="index">
          <!-- <el-select v-model="formData.materialName" placeholder="请选择" class="sel"> -->
          <el-select v-model="basicList[index]" placeholder="请选择" class="sel">
            <el-option
              v-for="dict in materialName"
              :label="dict.dictLabel"
              :key="dict.dictValue"
              :value="dict.dictLabel"
            />
          </el-select>
          <!-- 按钮 -->
          <!-- v-model="basicList[index].materialCount" -->
          <el-input-number
            v-model="formData[index]"
            @change="handleChange"
            :min="1"
            label="描述文字"
            size="mini"
            class="numbox"
          ></el-input-number>
          <el-button icon="el-icon-plus" circle @click="addBar"></el-button>
          <el-button icon="el-icon-minus" circle @click="delBar"></el-button>
        </div>
      </el-form-item>

      <el-form-item label="快递">
        <el-select v-model="formData.postType" placeholder="请选择快递方式" class="sel">
          <el-option
            v-for="dict in postType"
            :label="dict.dictLabel"
            :key="dict.dictValue"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="formData.materialType" placeholder="请选择类型" class="sel">
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addPost, updatePost } from "../../../api/basic/buydata";
export default {
  data() {
    return {
      ziliaoCount: 1,
      // 资料名称字典
      materialName: [],
      // 快递方式字典
      postType: [],
      // 资料分类字典
      materialType: [],
      basicList: [],
      formData: {
        materialCount: 1, //资料数量
        basicPostMaterialList: [
          {
            cost: 0, //金额
            createBy: "",
            createTime: "",
            dataRoleId: 0, //角色数据权重id
            id: "", //主键
            kzzd1: "", //扩展字段1
            kzzd2: "", //扩展字段2
            kzzd3: "", //扩展字段3
            loginGlrid: "", //user表的关联id,老师用户登录的话就是老师id
            materialCount: 0, //资料数量
            materialName: "", //资料名称
            params: {}, //请求参数
            postId: "", //邮寄表id
            remark: "", //备注
            searchValue: "", //搜索值
            updateBy: "",
            updateTime: ""
          }
        ],
        status: "1"
      }
    };
  },
  mounted() {
    this.formData = this.$route.query;
  },
  methods: {
    /** 提交按钮 */
    onSubmit() {
      this.formData.status = "1";
      this.$refs["formData"].validate(valid => {
        if (valid) {
          if (this.formData.id != null) {
            updatePost(this.formData).then(response => {
              this.msgSuccess("修改成功");
              this.$router.push("/buy/buylist");
            });
          } else {
            addPost(this.formData).then(response => {
              this.msgSuccess("新增成功");
              this.$router.push("/buy/buylist");
            });
          }
        }
      });
    },

    // 添加多行条例
    addBar() {
      this.ziliaoCount++;
    },

    // 删除指定行
    delBar() {
      if (this.ziliaoCount > 1) {
        this.ziliaoCount--;
      } else {
        this.ziliaoCount = 1;
      }
    },
    //计步器
    handleChange(value) {}
  },

  created() {
    // 快递方式
    this.getDicts("express_type").then(response => {
      this.postType = response.data;
    });
    // 资料分类
    this.getDicts("post_material_tpye").then(response => {
      this.materialType = response.data;
    });
    // 资料名称
    this.getDicts("material_price_list").then(response => {
      this.materialName = response.data;
    });
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
  width: 150px;
}
#zlk {
  margin-bottom: 5px;
}
</style>