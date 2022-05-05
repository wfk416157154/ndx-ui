<template>
    <div id="app">
        <router-view v-if="isRouterAlive" />
    </div>
</template>

<script>
export default {
    name: 'App',
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            isRouterAlive: true
        }
    },
    methods: {
        reload() {
            this.isRouterAlive = false
            this.$nextTick(() => (this.isRouterAlive = true))
        }
    }
}
</script>
<style>
/*!* 表格 *!
.tablebox {
    width: 800px;
    !* height: 600px; *!
    border: 1px solid #000;
    margin: 15px auto;
    border-collapse: collapse;
    text-align: center;
}

td {
    !* height: 25px; *!
    !* border: 1px solid; *!
    !* padding: 5px 10px; *!
}
!* .el-table {
    border: 1px solid;
} *!*/
</style>
