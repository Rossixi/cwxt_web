<template>
  <div>
    <el-card class="fujian">
      <div v-if="activeNum == 1">
        <assignment-paper
          ref="assignRef"
          :form="pageForm.assignmentForm"
          :review="pageForm.isReview"
          @paper-data="getPaperData"
          @paper-cancel="paperCancel"
        ></assignment-paper>
      </div>
      <div v-if="activeNum == 2">
        <asset-paper
          ref="assetRef"
          :form="pageForm.assetForm"
          :assetIllustrate="pageForm.proMainData.assetIllustrate"
          :review="pageForm.isReview"
          @paper-data="getPaperData"
          @paper-cancel="paperCancel"
        ></asset-paper>
      </div>
      <div v-if="activeNum == 3">
        <task-paper
          ref="taskRef"
          :form="pageForm.taskForm"
          :assignForm="pageForm.assignmentForm"
          :review="pageForm.isReview"
          @paper-data="getPaperData"
          @paper-cancel="paperCancel"
        ></task-paper>
      </div>
      <div v-if="activeNum == 4">
        <application-paper
          ref="applicationRef"
          :form="pageForm.applicationForm"
          :review="pageForm.isReview"
          @paper-data="getPaperData"
          @paper-cancel="paperCancel"
        ></application-paper>
      </div>
    </el-card>
  </div>
</template>

<script>
import assignmentPaper from '../components/assignmentPaper.vue'
import assetPaper from '../components/assetPaper.vue'
import taskPaper from '../components/taskPaper.vue'
import applicationPaper from '../components/applicationPaper.vue'

export default {
  name: 'reviewFujian',
  components: { assignmentPaper, assetPaper, taskPaper, applicationPaper },
  props: {
    activeNum: {
      type: Number,
      default: 1,
    },
    pageForm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },

  created() {},

  methods: {
    getPaperData(e1, e2) {
      this.$emit('edit-project', e1, e2)
    },

    paperCancel() {
      this.$emit('back-review')
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
