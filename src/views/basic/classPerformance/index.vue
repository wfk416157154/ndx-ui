<template>
  <div id="statisticalChartTtem">
    <jw v-if="dataRoleWeightId > 50"></jw>
    <ls v-if="dataRoleWeightId == 50"></ls>
  </div>
</template>

<script>
import jw from "./jw";
import ls from "./ls";
export default {
  name: "statisticalChartTtem",
  data() {
    return {
      // 用户权重
      dataRoleWeightId: ""
    };
  },
  components: {
    jw,
    ls
  },
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
