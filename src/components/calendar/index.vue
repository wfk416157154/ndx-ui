<template>
  <div class="add-teaching">
    <iframe
      ref="iframe"
      src="http://192.168.0.102:8080/"
      width="1000"
      height="700"
      name="sendMessage"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  mounted() {
    let _that = this;
    const mapFrame = this.$refs["iframe"];
    if (mapFrame.attachEvent) {
      mapFrame.attachEvent("onload", function() {
        const iframeWin = mapFrame.contentWindow;
        // iframeWin.postMessage("", "*");
      });
    } else {
      mapFrame.onload = function() {
        const iframeWin = mapFrame.contentWindow;
        // iframeWin.postMessage("", "*");
      };
    }
    window.addEventListener("message", function(e) {
      // console.log(e.data); 
      _that.$emit("callback", e.data);
    });
  },
  methods: {}
};
</script>


<style lang="scss">
</style>
