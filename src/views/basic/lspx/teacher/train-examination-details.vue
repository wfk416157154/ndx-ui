<template>
  <div class="train-examination-details">
    <div class="top-title">
      <TopTitle :teacherInfoDto="this.queryPaperGradeTopicDetailData.teacherInfoDto" />
    </div>
    <div class="table-data">
      <TableData
        :gradeStatisticsDtoList="this.queryPaperGradeTopicDetailData.gradeStatisticsDtoList"
      />
    </div>
    <div class="question-board">
      <Questionboard :subjectData="this.subjectData" />
    </div>
  </div>
</template>

<script>
import TopTitle from "./components/top-title";
import TableData from "./components/table-data";
import Questionboard from "./components/question-board";
import { queryPaperGradeTopicDetailList } from "@/api/basic/trainGrade";
export default {
  data() {
    return {
      parentItem: {},
      queryPaperGradeTopicDetailData: {},
      subjectData: {}
    };
  },
  components: { TopTitle, TableData, Questionboard },
  created() {
    if (this.$route.query.item) {
      this.parentItem = JSON.parse(this.$route.query.item);
      console.log(this.parentItem)
      queryPaperGradeTopicDetailList({
        gradeId: this.parentItem.gradeId || this.parentItem.id,
        lsid: this.parentItem.teacherId
      }).then(res => {
        this.queryPaperGradeTopicDetailData = res.data;
        let {
          topicList1,
          topicList2,
          topicList3,
          topicList4
        } = this.queryPaperGradeTopicDetailData;
        this.subjectData = {
          topicList1,
          topicList2,
          topicList3,
          topicList4
        };
        this.queryPaperGradeTopicDetailData.teacherInfoDto = Object.assign(
          this.queryPaperGradeTopicDetailData.teacherInfoDto,
          this.parentItem
        );
        console.log(this.queryPaperGradeTopicDetailData);
      });
    }
  }
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
