<script>
export default {
  props:["propressItem"],
  render(h) {
    const VNODE_LIST = [];
    this.propressItem.forEach((el) => {
      VNODE_LIST.push(
        h("div", { class: el.type, style: { width: `${el.percentage}%` } })
      );
    });
    const PARENT_NODE = h("div", { class: "wrap-box" }, VNODE_LIST);
    return PARENT_NODE;
  },
};
</script>
<style lang="scss" scoped>
.primary {
  background-color: #409eff;
}
.success {
  background-color: #67c23a;
}
.info {
  background-color: #909399;
}
.warning {
  background-color: #e6a23c;
}
.danger {
  background-color: #f56c6c;
}
.white {
  background-color: #eee;
}
.wrap-box {
  width: 100%;
  height: 15px;
  display: flex;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}
</style>
