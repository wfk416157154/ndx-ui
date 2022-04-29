<template>
    <div class="edit">
        <el-card shadow="never">
            <template #header>
                <div class="card-header">
                    <span>{{kcItem.jdmc}}</span>
                </div>
            </template>
            <div>
                <div>
                    <h3>教参内容</h3>
                    <editor v-model="jcIem" :disabled="true" :min-height="300" />
                </div>
                <div>
                    <h3>建议</h3>
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="form.suggestContent">
                    </el-input>
                </div>
                <div style="height : 60px;margin-top : 20px">
                    <el-button type="primary" size="mini" style="float:right" @click="jySubmit">保 存</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { addSuggest, listReference } from "@/api/basic/teacherGuidebooksList"

export default {
    data() {
        return {
            kcItem: {},
            form: {
                kzzd1: null,
                suggestContent: null,
                status: "1"
            },
            jcIem: ""
        }
    },
    created() {
        this.kcItem = JSON.parse(this.$route.query.row);
        this.form.kzzd1 = this.kcItem.id
        listReference({ templateId: this.kcItem.id, enableStatus: "1" }).then(res => {
            if (res.rows.length > 0) {
                this.jcIem = res.rows[0].referenceContent
            }
        })
    },
    methods: {
        // 保存按钮
        jySubmit() {
            addSuggest(this.form).then(res => {
                if (res.code == 200) {
                    this.msgSuccess("操作成功");
                    this.$router.go(-1)
                    this.form = {}
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.edit {
    width: 100%;
    height: 100%;
    padding: 40px;
    box-sizing: border-box;
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
