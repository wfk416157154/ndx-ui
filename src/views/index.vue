<template>
  <div class="index-page">
    <RoutineHome />
    <TeacherHome v-if="this.$sore.state.user.dataRoleWeightId == 50" />
    <!-- <TeacherHome /> -->
  </div>
</template>

<script>
import RoutineHome from "../components/home-page/routine-home";
import TeacherHome from "../components/home-page/teacher-home";
export default {
  data() {
    return {};
  },
  components: {
    RoutineHome,
    TeacherHome
  }
};
</script>

<style lang="scss" scoped>
.index-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
