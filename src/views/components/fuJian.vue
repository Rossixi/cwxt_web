<template>
  <div>
    <el-card class="fujian">
      <el-tabs v-model="active" type="border-card" :before-leave="confirmLeave">
        <el-tab-pane label="附件1：项目任务书" name="1" lazy>
          <assignment-paper
            ref="assignRef"
            :form="pageForm.assignmentForm"
            @paper-data="getPaperData"
            @paper-cancel="paperCancel"
          ></assignment-paper>
        </el-tab-pane>
        <el-tab-pane label="附件2：新增资产配置限额表" name="2" lazy>
          <asset-paper
            ref="assetRef"
            :form="pageForm.assetForm"
            :assetIllustrate="pageForm.proMainData.assetIllustrate"
            @paper-data="getPaperData"
            @paper-cancel="paperCancel"
          ></asset-paper>
        </el-tab-pane>
        <el-tab-pane label="附件3：任务书汇总表" name="3" lazy>
          <task-paper
            ref="taskRef"
            :form="pageForm.taskForm"
            :assignForm="pageForm.assignmentForm"
            @paper-data="getPaperData"
            @paper-cancel="paperCancel"
          ></task-paper>
        </el-tab-pane>
        <el-tab-pane label="附件4：绩效目标申报表" name="4" lazy>
          <application-paper
            ref="applicationRef"
            :form="pageForm.applicationForm"
            @paper-data="getPaperData"
            @paper-cancel="paperCancel"
          ></application-paper>
        </el-tab-pane>
        <!-- <el-tab-pane label="附件5：项目任务书" name="second">配置管理</el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import assignmentPaper from '../components/assignmentPaper.vue'
import assetPaper from '../components/assetPaper.vue'
import taskPaper from '../components/taskPaper.vue'
import applicationPaper from '../components/applicationPaper.vue'

export default {
  name: 'assignment',
  components: { assignmentPaper, assetPaper, taskPaper, applicationPaper },
  props: {
    tabActive: {
      type: String,
      default: '1',
    },
    pageForm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      active: this.tabActive,
    }
  },

  created() {},

  watch: {
    tabActive(newValue, oldValue) {
      this.active = newValue
    },
  },

  methods: {
    async confirmLeave(active, oldActive) {
      switch (oldActive) {
        case '1':
          if (!this.$refs.assignRef.isEdit()) {
            await this.getMessageBox('assignRef')
          } else {
            return true
          }
          break

        case '2':
          if (!this.$refs.assetRef.isEdit()) {
            await this.getMessageBox('assetRef')
          } else {
            return true
          }
          break

        case '3':
          if (!this.$refs.taskRef.isEdit()) {
            await this.getMessageBox('taskRef')
          } else {
            return true
          }
          break

        case '4':
          if (!this.$refs.applicationRef.isEdit()) {
            await this.getMessageBox('applicationRef')
          } else {
            return true
          }
          break

        default:
          break
      }
    },

    // 调用确认框
    getMessageBox(ref) {
      return this.$confirm('是否在离开页面前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          if (this.$refs[ref].save()) {
            this.$refs[ref].save()
            return true
          } else {
            return reject()
          }
        })
        .catch((action) => {
          if (action === 'cancel') {
            this.$refs[ref].cancelSave()
            this.$message({
              type: 'info',
              message: '放弃保存并离开页面',
            })
          } else {
            return reject()
          }
        })
    },

    // 返回确认框
    cancelMessageBox(ref) {
      return this.$confirm('是否在离开页面前保存修改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          if (this.$refs[ref].save()) {
            this.$refs[ref].save()
            this.$emit('cancel-paper')
          } else {
            return
          }
        })
        .catch((action) => {
          if (action === 'cancel') {
            this.$emit('cancel-paper')
          } else {
            return
          }
        })
    },

    getPaperData(e1, e2) {
      this.$emit('data-page', e1, e2)
    },

    paperCancel(e) {
      switch (e) {
        case '1':
          if (!this.$refs.assignRef.isEdit()) {
            this.cancelMessageBox('assignRef')
          } else {
            this.$emit('cancel-paper')
          }
          break

        case '2':
          if (!this.$refs.assetRef.isEdit()) {
            this.cancelMessageBox('assetRef')
          } else {
            this.$emit('cancel-paper')
          }
          break

        case '3':
          if (!this.$refs.taskRef.isEdit()) {
            this.cancelMessageBox('taskRef')
          } else {
            this.$emit('cancel-paper')
          }
          break

        case '4':
          if (!this.$refs.applicationRef.isEdit()) {
            this.cancelMessageBox('applicationRef')
          } else {
            this.$emit('cancel-paper')
          }
          break

        default:
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fujian {
  width: 95%;
  margin: 0 auto;

  ::v-deep.el-card__body {
    padding: 0;
  }
}
</style>
