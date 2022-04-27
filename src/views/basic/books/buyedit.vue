<template>
  <div class="contaiiner">
    <h3>申请填写</h3>
    <table class="tablebox">
      <tr>
        <td>邮寄时间</td>
        <td>请选择时间</td>
      </tr>
      <tr>
        <td>快递单号</td>
        <td>
          <input type="text" name id />
        </td>
      </tr>
      <tr>
        <td>使用班级</td>
        <td>
          <input type="text" name id />
        </td>
      </tr>
      <tr>
        <td>收件人</td>
        <td>
          <input type="text" name id />
        </td>
      </tr>
      <tr>
        <td>收件人地址</td>
        <td>
          <input type="text" name id />
        </td>
      </tr>
      <tr>
        <td>资料名称</td>
        <td class="selbox">
          <div class="row1">
            <select name id>
              <option value>1111</option>
              <option value>2222</option>
            </select>
            <div class="numbox">
              <button>+</button>
              <input type="text" class="num" name id placeholder="1" />
              <button>-</button>
            </div>
          </div>
          <div class="row1">
            <select name id>
              <option value>1111</option>
              <option value>2222</option>
            </select>
            <div class="numbox">
              <button>+</button>
              <input type="text" class="num" name id placeholder="1" />
              <button>-</button>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>快递</td>
        <td>
          <select name id class="sel">
            <option value>德邦快递</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>分类</td>
        <td>
          <select name id class="sel">
            <option value>书籍类</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>备注</td>
        <td>
          <textarea name id cols="30" rows="10"></textarea>
        </td>
      </tr>
    </table>
    <el-button>保存</el-button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.contaiiner {
  width: 100%;
  height: 100%;
  padding: 20px;
}
h3 {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}
/* 表格 */
.tablebox {
  width: 800px;
  /* height: 600px; */
  border: 1px solid #000;
  margin: 15px auto;
  border-collapse: collapse;
  text-align: center;
}
tr,
td {
  /* height: 25px; */
  border: 1px solid;
  padding: 5px 10px;
}

input,
textarea {
  width: 100%;
}
input {
  height: 30px;
  outline: none;
}
.sel {
  width: 100%;
}
.row1 {
  display: flex;
  margin: 8px;
}
.numbox {
  text-align: center;
  height: 30px;
}
.numbox button {
  width: 30px;
  height: 30px;
}
.numbox input {
  text-align: center;
  width: 40px;
}
.selbox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: none;
}
.selbox select {
  width: 50%;
  margin-right: 15px;
}
</style>
