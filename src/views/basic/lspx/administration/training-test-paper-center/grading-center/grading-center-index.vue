<template>
  <div class="train-examination-details">
    <div class="top-title">
      <TopTitle />
    </div>
    <div class="table-data">
      <TableData />
    </div>
    <div class="question-board">
      <Questionboard />
    </div>
  </div>
</template>

<script>
import TopTitle from "./components/top-title";
import TableData from "./components/table-data";
import Questionboard from "./components/question-board";
export default {
  data() {
    return {};
  },
  components: { TopTitle, TableData, Questionboard }
};
</script>

<style lang="scss" scoped>
.train-examination-details {
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
}
</style>
