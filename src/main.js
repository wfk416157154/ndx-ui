import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import axios from "axios"
import router from './router'
import directive from './directive' //directive
import { download } from '@/utils/request'

import install from '@/utils/preventReClick'
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, renderDict, handleTree } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 进度条
import Progress from "@/components/progress"
import NdxProgress from "@/components/ndx-progress/upgrade-progress"
import NdxVideo from "@/components/ndx-video"
import calendar from "@/components/calendar"
import yNoticeBar from "@/components/yNoticeBar"
import historicalRecords from "@/components/historical-records"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件（使用频繁可在全局挂载）
import DictTag from '@/components/DictTag'
import Moment from 'moment'
import Bus from "./utils/bus"

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VueParticles from 'vue-particles'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.$axios = axios
Vue.prototype.renderDict = renderDict
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.$bus = Bus
Vue.prototype.getConfigKey("wecharServerUrl").then(res=>{
  Vue.prototype.wecharServerUrl = res.msg
})


Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('DictTag', DictTag)
Vue.component('Editor', Editor)
Vue.component('NdxVideo', NdxVideo)
Vue.component('Progress', Progress)
Vue.component('NdxProgress', NdxProgress)
Vue.component('historical-records', historicalRecords)
Vue.component('y-notice-bar', yNoticeBar)
Vue.component('calendar', calendar)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)

Vue.use(directive)
Vue.use(Moment)
Vue.use(install)
Vue.use(VXETable)
Vue.use(VueParticles)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
import "echarts/lib/component/legend";


Vue.config.productionTip = false;
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data() {
    return {
      tableHeight: window.screen.height * 0.55
    }
  }
})
