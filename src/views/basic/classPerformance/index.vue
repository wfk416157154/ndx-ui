<template>
  <div id="statisticalChartTtem">
    <jw v-if="dataRoleWeightId > 50" :bjid="bjid" />
    <ls v-if="dataRoleWeightId == 50" :bjid="bjid" />
  </div>
</template>

<script>
import jw from "./components/jw";
import ls from "./components/ls";
export default {
  name: "statisticalChartTtem",
  data() {
    return {
      // 用户权重
      dataRoleWeightId: "",
      bjid: this.$route.query.bjid
    };
  },
  components: {
    jw,
    ls
  },
  created() {},
  mounted() {
    this.dataRoleWeightId = this.$store.state.user.dataRoleWeightId;
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
#statisticalChartTtem {
}
</style>
