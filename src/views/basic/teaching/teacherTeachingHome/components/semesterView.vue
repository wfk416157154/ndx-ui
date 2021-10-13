<template>
  <div>
    <el-table :data="skuListInfo" :span-method="objectSpanMethod" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="storeIds" label="适应门店"></el-table-column>
      <el-table-column prop="feeTypeInfo" label="费用类型"></el-table-column>
      <el-table-column prop="productInfo" label="适用产品"></el-table-column>
      <el-table-column prop="billing" label="计费方法"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      skuListInfo: [
        {
          id: 1,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "1",
          productInfo: "日托",
          mergeId: 1,
          feeType: "1",
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 2,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "2",
          productInfo: "晚托",
          feeType: "1",
          mergeId: 1,
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 3,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "3",
          productInfo: "临时托",
          feeType: "1",
          mergeId: 1,
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 4,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "4",
          productInfo: "越拖",
          feeType: "1",
          mergeId: 1,
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 9,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "4",
          productInfo: "全部",
          feeType: "2",
          mergeId: 1,
          feeTypeInfo: "定金",
          billing: "月/季/年制度"
        },
        {
          id: 10,
          name: "普通门店",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "4",
          productInfo: "全部",
          feeType: "3",
          mergeId: 1,
          feeTypeInfo: "学杂费",
          billing: "月/季/年制度"
        },
        {
          id: 5,
          name: "团购",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "5",
          productInfo: "寒假托",
          feeType: "2",
          mergeId: 1,
          feeTypeInfo: "定金",
          billing: "月/季/年制度"
        },
        {
          id: 6,
          name: "团购",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "5",
          productInfo: "日托",
          feeType: "1",
          mergeId: 1,
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 7,
          name: "团购",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "5",
          productInfo: "晚托",
          feeType: "1",
          mergeId: 1,
          feeTypeInfo: "学费",
          billing: "月/季/年制度"
        },
        {
          id: 8,
          name: "大客户",
          storeIds: [1, 2, 3, 4],
          storeIdInfo: "[1, 2, 3, 4]",
          productType: "6",
          productInfo: "暑假托",
          feeType: "3",
          mergeId: 1,
          feeTypeInfo: "学杂费",
          billing: "月/季/年制度"
        }
      ],
      typeNameArr: [],
      typeNamePos: 0,
      storeArr: [],
      storePos: 0,
      feeArr: [],
      feePos: 0,
      hoverOrderArr: []
    };
  },
  mounted() {
    this.merage();
  },
  methods: {
    merageInit() {
      this.typeNameArr = [];
      this.typeNamePos = 0;
    },
    merage() {
      this.merageInit();
      for (let i = 0; i < this.skuListInfo.length; i += 1) {
        if (i === 0) {
          // 第一行必须存在
          this.typeNameArr.push(1);
          this.typeNamePos = 0;
        } else {
          if (this.skuListInfo[i].name === this.skuListInfo[i - 1].name) {
            this.typeNameArr[this.typeNamePos] += 1;
            this.typeNameArr.push(0);
          } else {
            this.typeNameArr.push(1);
            this.typeNamePos = i;
          }
        }
      }
      console.log(this.typeNameArr)
      console.log(this.typeNamePos)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第一列的合并方法
        const row1 = this.typeNameArr[rowIndex];
        const col1 = row1 > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row1,
          colspan: col1
        };
      }
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
