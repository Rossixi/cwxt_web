<template>
  <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
    <li :key="file.gid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
      <el-link :href="file.filePath" :underline="false" target="_blank">
        <span class="el-icon-document"> {{ file.fileName }} </span>
      </el-link>

      <div class="delete-file">
        <el-link :underline="false" @click="handleDelete(file, index)" type="danger" v-if="showDel">删除</el-link>
      </div>
    </li>
  </transition-group>
</template>

<script>
import { deleteFile } from '@/api/project/application'
export default {
  props: {
    // 单据id
    list: {
      type: Array,
      require: true,
    },
    showDel: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 已选择文件列表
      fileList: [],
    }
  },

  created() {
    this.fileList = JSON.parse(JSON.stringify(this.list))
    this.getFileList()
  },

  methods: {
    getFileList() {
      this.fileList = JSON.parse(JSON.stringify(this.list))
      console.log(this.fileList)
      // if (this.uuid) {
      //   getAttachmentList({ uuid: this.uuid }).then((res) => {
      //     this.fileList = res.data
      //     this.fileList.forEach((el, index) => {
      //       this.fileList[index].fileDownloadPath = el.fileDownloadPath.replace(
      //         process.env.VUE_APP_IMG_BASE_URL_REPLACE,
      //         process.env.VUE_APP_IMG_BASE_URL,
      //       )

      //       // 转为kb，取小数点后2位
      //       el.fileSize = parseFloat(el.fileSize / 1024).toFixed(2)
      //     })
      //   })
      // }
    },

    handleDelete(val, index) {
      deleteFile(val).then((res) => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.fileList.splice(index, 1)
          this.$emit('delete-file', index)
        }
      })
    },
  },
}
</script>

<style scoped>
.el-upload-list__item {
  display: flex;
}

.file-size {
  margin-left: 30px;
}

.delete-file {
  margin-left: 40px;
}
</style>
