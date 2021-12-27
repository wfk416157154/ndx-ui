<script>
import printJs from "print-js";
export default {
  methods: {
    onPrintJs() {
      printJs({
        printable: "printRef",
        type: "html",
        css: [
          "//at.alicdn.com/t/font_2298093_o73r8wjdhlg.css",
          "https://unpkg.com/element-plus/lib/theme-chalk/index.css"
        ],
        scanStyles: false,
        style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}`
      });
    }
  }
};
</script>
