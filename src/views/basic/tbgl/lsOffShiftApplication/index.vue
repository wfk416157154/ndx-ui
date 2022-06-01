<template>
    <div>
        <edit v-if="queryData.title && queryData.title == 'edit'" />
        <add v-else />
    </div>
</template>

<script>
import add from "./add.vue";
import edit from "./edit.vue";
export default {
    data() {
        return {
            queryData: {},
        };
    },
    components: {
        add,
        edit,
    },
    created() {
        this.queryData = this.$route.query;
    },
};
</script>