<template>
  <div id="statisticalChartTtem">
    <jw v-if="dataRoleWeightId > 50" />
    <ls v-if="dataRoleWeightId == 50" />
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
      dataRoleWeightId: ""
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
