<template>
  <div class="app-container review-detail">
    <div class="content">
      <el-row :gutter="20">
        <el-col :lg="24" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-size: 18px; font-weight: 700">项目信息</span>
            </div>
            <div class="flex-box">
              <div class="personal-infor" v-if="projectDetails.proMainData">
                <div class="infor-item">
                  <h4>项目名称</h4>
                  <p>{{ projectDetails.proMainData.proName }}</p>
                </div>
                <div class="infor-item">
                  <h4>申报时间</h4>
                  <p>{{ projectDetails.proMainData.appTime }}</p>
                </div>
                <div class="infor-item">
                  <h4>申报部门</h4>
                  <p>{{ projectDetails.proMainData.deptName }}</p>
                </div>
                <div class="infor-item">
                  <h4>申请人</h4>
                  <p>{{ projectDetails.proMainData.nickName }}</p>
                </div>
                <div class="infor-item">
                  <h4>申报金额</h4>
                  <p>{{ projectDetails.proMainData.appAmount }} 万元</p>
                </div>
                <div class="infor-item">
                  <h4>党委会审议金额</h4>
                  <p>{{ projectDetails.proMainData.reviewAmount }} 万元</p>
                </div>
                <div class="infor-item">
                  <h4>项目起止时间</h4>
                  <p>{{ projectDetails.proMainData.proTimes[0] }} 至 {{ projectDetails.proMainData.proTimes[1] }}</p>
                </div>
              </div>
              <div class="review-result">
                <img class="state" src="@/assets/image/dzp.png" alt="" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex">
        <el-col :lg="24" :sm="24">
          <el-card class="second-box" v-if="projectDetails.proMainData">
            <div slot="header" class="clearfix">
              <span style="font-size: 18px; font-weight: 700">附件文档</span>
            </div>

            <div>
              <h4 class="small-title">绩效自评</h4>

              <div class="jujian-list">
                <el-row :gutter="20">
                  <el-col :lg="6" :sm="12">
                    <div class="jujian-item muban download">
                      <p>请下载相关附件模板</p>
                      <el-button
                        icon="el-icon-download"
                        size="mini"
                        @click="downloadSelfFile({ downUrl: '/project/file/GetTemplate/report', fileName: '绩效自评报告' })"
                        >附件：绩效自评报告</el-button
                      >
                      <el-button
                        icon="el-icon-download"
                        size="mini"
                        @click="downloadSelfFile({ downUrl: '/project/file/GetTemplate/form', fileName: '绩效自评表' })"
                        >附件：绩效自评表</el-button
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :lg="6" :sm="12" v-for="(item, index) in projectDetails.fileList" :key="index">
                    <div class="jujian-item" v-if="item.type == 'self'">
                      <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                      <div class="filename">
                        <h5 :title="item.fileName">{{ item.fileName }}</h5>
                        <el-button size="small" type="text" @click="downloadFile(item)">下载</el-button>
                      </div>
                      <svg-icon icon-class="delete" class-name="delete-icon" @click="deleteFile(item.filePath)"></svg-icon>
                    </div>
                  </el-col>
                  <el-col :lg="6" :sm="12">
                    <div class="jujian-item upload" v-if="projectDetails.proMainData.currentState == 10">
                      <el-button icon="el-icon-upload2" size="mini" @click="handleImport">上传文件</el-button>
                      <div>
                        <h5>请上传绩效自评文件</h5>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <h4 class="small-title">绩效自评结果</h4>

              <el-form :model="approval" ref="queryForm" :inline="true" label-width="100px">
                <el-form-item label="自评结果" prop="approvalOpinions">
                  <el-select v-model="approval.approvalOpinions" placeholder="请选择自评结果">
                    <el-option v-for="item in assessList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"> </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <div class="btns">
              <button class="submit" @click="submitApproval">提交</button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 上传弹窗 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        name="file"
        ref="upload"
        accept="*"
        :headers="upload.headers"
        :action="upload.url + '?target=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">单次可上传一个文件</div>
          <span>如需上传多个文件请分批上传</span>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { downReviewFile } from '@/utils/request'
import { getProDetail, approvalSubmit, editProject } from '@/api/project/onlineview'
export default {
  name: 'selfDetails',
  data() {
    return {
      projectDetails: {},

      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 'application',
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/project/file/UploadFile',
      },
      uploadFile: [],
      proInfo: {
        gid: '',
        reviewAmount: null,
        meetingMinutes: '',
        proNo: '',
      },
      approval: {
        approvalAction: '',
        approvalOpinions: '',
      },
      assessList: [],
    }
  },
  created() {
    this.getProjectDetails(this.$route.query.gid)
    this.getDicts('pro_selfassessment').then((response) => {
      console.log(response)
      this.assessList = response.data
    })
  },
  methods: {
    // 获取项目列表
    getProjectDetails(id) {
      getProDetail(id).then((res) => {
        console.log(res)
        this.projectDetails = res.data
        this.proInfo.gid = res.data.proMainData.gid
        this.proInfo.meetingMinutes = res.data.proMainData.meetingMinutes
        this.proInfo.reviewAmount = res.data.proMainData.reviewAmount
        this.proInfo.proNo = res.data.assignmentForm.proNo
        if (this.projectDetails.proMainData.currentState < 0) {
          this.projectDetails.projectDetails.currentState = 0
        }

        // 修改上传type
        switch (res.data.proMainData.currentState) {
          case 3:
            this.upload.updateSupport = 'expert'
            break

          case 5:
            this.upload.updateSupport = 'meeting'
            break

          case 10:
            this.upload.updateSupport = 'self'
            break

          default:
            break
        }
      })
    },

    // 提交通过/驳回
    submitApproval() {
      approvalSubmit({ proInfo: this.proInfo, approval: this.approval, filelist: this.uploadFile }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg)
          this.openDialog = false
          this.$router.push({ path: '/selfassessment' })
        }
      })
    },

    // 下载
    downloadFile(file) {
      downReviewFile(file.downUrl, file.fileName)
    },

    downloadSelfFile(file) {
      window.open(process.env.VUE_APP_BASE_API + file.downUrl, '_blank')
    },

    // 点击上传
    handleImport() {
      this.upload.title = '上传文件'
      this.upload.open = true
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      // this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      if (response.code == 200) {
        this.uploadFile.push(response.data[0])
        this.projectDetails.fileList.push(response.data[0])
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },

    // 删除文件
    deleteFile(path) {
      this.uploadFile = this.uploadFile.filter((item) => item.filePath != path)
      this.projectDetails.fileList = this.projectDetails.fileList.filter((item) => item.filePath != path)
    },
  },
}
</script>

<style scoped lang="scss">
.review-detail {
  min-height: 880px;
  background: #eeeeee;

  .flex-box {
    display: flex;

    .personal-infor {
      width: 80%;
      display: flex;
      flex-wrap: wrap;

      .infor-item {
        width: 25%;
        height: 100px;

        h4 {
          color: #b4b5b7;
        }

        p {
          font-size: 16px;
        }
      }
    }

    .review-result {
      width: 20%;
      height: 200px;
      position: relative;

      .state {
        width: 60%;
        position: absolute;
        left: 0;
        top: -60px;
      }
    }
  }

  .content {
    height: 100%;
  }

  .second-box {
    margin-top: 20px;
    height: calc(100% - 20px);

    .small-title {
      position: relative;
      margin-left: 10px;
    }

    .small-title::before {
      content: '';
      position: absolute;
      left: -10px;
      top: 0;
      height: 16px;
      width: 3px;
      background: #0052d9;
      border-radius: 2px;
    }

    .jujian-list {
      .jujian-item {
        display: flex;
        flex-wrap: wrap;
        height: 80px;
        width: 100%;
        background: #f0f7ff;
        border-radius: 3px;
        margin-bottom: 20px;

        .fujian-icon {
          font-size: 40px;
          margin: 20px;
        }

        .filename {
          width: 68%;
        }

        h5 {
          width: 80%;
          margin-top: 19px;
          margin-bottom: 0;
          font-size: 15px;
          width: 100%;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* 这里是超出几行省略 */
          overflow: hidden;
        }

        .delete-icon {
          font-size: 24px;
          cursor: pointer;
          display: block;
          width: 34px;
          margin-top: 50px;
          // color: #f0f7ff;
        }

        .delete-icon:hover {
          color: #46a6ff;
        }

        button {
          margin-right: 20px;
        }
      }

      .muban {
        background: #ecedf0;
        color: #898b8e;
        font-size: 14px;
        padding: 0 20px;
        width: 100%;

        p {
          width: 100%;
          margin-bottom: 0;
        }
      }
      ::v-deep {
        .upload {
          .el-button {
            height: 36px;
            margin: 22px;
          }

          h5 {
            line-height: 45px;
            font-size: 15px;
            color: #b4b5b7;
          }
        }

        .download {
          .el-button {
            height: 36px;
            margin-right: 0;
          }
        }
      }
    }

    .meeting {
      background: #f0f7ff;
      padding: 20px 50% 10px 0;
      margin-bottom: 20px;
      position: relative;

      .meeting-btn {
        position: absolute;
        bottom: 28px;
        right: 40%;
      }
    }

    .btns {
      width: 200px;
      margin: 100px auto 20px;
      display: flex;
      justify-content: space-between;

      button {
        width: 88px;
        height: 32px;
        border: 0;
        border-radius: 3px;
        cursor: pointer;
        padding: 0;
        letter-spacing: 3px;
      }

      .submit {
        background: #0052d9;
        color: #fff;
      }
    }
  }

  .jindu {
    margin-top: 20px;

    ::v-deep {
      .el-step__description {
        p {
          font-size: 14px;
          line-height: 16px;
        }
      }

      .is-finish {
        p {
          color: #303133;
        }
      }
    }
  }
}
</style>
