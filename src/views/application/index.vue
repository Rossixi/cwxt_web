<template>
  <div class="app-container application">
    <!-- 申报遮罩 -->
    <div class="dialog" v-if="showDialog">
      <img class="dialog-img" src="@/assets/image/add-application.png" alt="" />
      <p>创建新的申报项目</p>
      <button @click="closeDialog">立即申报</button>
    </div>
    <!-- 申报主体部分 -->
    <div>
      <my-step :activeNum="stepNum"></my-step>
      <fu-jian v-if="showFuJian" :pageForm="pageForm" :tabActive="activeFj" @data-page="getDataPage" @cancel-paper="cancelPaper"></fu-jian>
      <div class="app-main" v-if="!showFuJian">
        <h3>填写文档</h3>
        <div class="five-page">
          <div class="page" @click="gotoPage('1')">
            <div class="page-stated" v-if="firstCompleted">已填写</div>
            <div class="page-unstate" v-else>未填写</div>
            <div class="img-stated" v-if="firstCompleted">
              <img src="@/assets/image/page-stated.png" alt="" />
            </div>
            <div class="img-unstate" v-else>
              <img src="@/assets/image/page-unstate.png" alt="" />
            </div>
            <p>附件1：项目任务书</p>
          </div>
          <div class="page" @click="gotoPage('2')">
            <div class="page-stated" v-if="secondCompleted">已填写</div>
            <div class="page-unstate" v-else>未填写</div>
            <div class="img-stated" v-if="secondCompleted">
              <img src="@/assets/image/page-stated.png" alt="" />
            </div>
            <div class="img-unstate" v-else>
              <img src="@/assets/image/page-unstate.png" alt="" />
            </div>
            <p>附件2：新增资产配置限额表</p>
          </div>
          <div class="page" @click="gotoPage('3')">
            <div class="page-stated" v-if="thirdCompleted">已填写</div>
            <div class="page-unstate" v-else>未填写</div>
            <div class="img-stated" v-if="thirdCompleted">
              <img src="@/assets/image/page-stated.png" alt="" />
            </div>
            <div class="img-unstate" v-else>
              <img src="@/assets/image/page-unstate.png" alt="" />
            </div>
            <p>附件3：任务书汇总表</p>
          </div>
          <div class="page" @click="gotoPage('4')">
            <div class="page-stated" v-if="fourthCompleted">已填写</div>
            <div class="page-unstate" v-else>未填写</div>
            <div class="img-stated" v-if="fourthCompleted">
              <img src="@/assets/image/page-stated.png" alt="" />
            </div>
            <div class="img-unstate" v-else>
              <img src="@/assets/image/page-unstate.png" alt="" />
            </div>
            <p>附件4：绩效目标申报表</p>
          </div>
          <!-- <div class="page" @click="gotoPage('5')">
            <div class="page-stated" v-if="firstCompleted">已填写</div>
            <div class="page-unstate" v-else>未填写</div>
            <div class="img-stated" v-if="firstCompleted">
              <img src="@/assets/image/page-stated.png" alt="" />
            </div>
            <div class="img-unstate" v-else>
              <img src="@/assets/image/page-unstate.png" alt="" />
            </div>
            <p>附件5：分管院长附件</p>
          </div> -->
        </div>
        <h3>其它附件</h3>
        <el-button plain icon="el-icon-upload2" size="mini" @click="handleImport">上传文件</el-button>
        <file-list ref="fileListRef" :list="pageForm.fileList" :showDel="true" @delete-file="deleteFile"></file-list>
        <h3 style="margin-top: 30px">项目申报信息</h3>
        <el-form ref="pageFormRef" :model="pageForm" label-width="130px">
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="项目名称"> <el-input v-model="pageForm.proMainData.proName" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="项目起始时间"
                ><el-date-picker
                  v-model="pageForm.proMainData.proTimes"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  disabled
                >
                </el-date-picker> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="申报时间">
                <el-date-picker
                  v-model="pageForm.proMainData.appTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  disabled
                >
                </el-date-picker> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="申报部门"> <el-input v-model="pageForm.proMainData.deptName" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="申报金额（万元）"> <el-input v-model="pageForm.proMainData.appAmount" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="党委会审议金额（万元）">
                <el-input v-model="pageForm.proMainData.reviewAmount" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <h3>选择审核人员</h3>
        <el-form ref="reviewerRef" :model="pageForm.reviewers" :rules="reviewerRule" label-width="110px" v-if="reviewerList">
          <el-row :gutter="50">
            <el-col :lg="6"
              ><el-form-item label="系部领导" prop="department">
                <el-select v-model="pageForm.reviewers.department" placeholder="请选择系部领导">
                  <el-option v-for="item in reviewerList.department" :key="item.userId" :label="item.nickName" :value="item.userName">
                  </el-option> </el-select></el-form-item
            ></el-col>
            <el-col :lg="6"
              ><el-form-item label="资产处" prop="asset">
                <el-select v-model="pageForm.reviewers.asset" placeholder="请选择资产处">
                  <el-option v-for="item in reviewerList.asset" :key="item.userId" :label="item.nickName" :value="item.userName">
                  </el-option> </el-select></el-form-item
            ></el-col>
            <el-col :lg="6"
              ><el-form-item label="财务处" prop="finance">
                <el-select v-model="pageForm.reviewers.finance" placeholder="请选择财务处">
                  <el-option v-for="item in reviewerList.finance" :key="item.userId" :label="item.nickName" :value="item.userName">
                  </el-option> </el-select></el-form-item
            ></el-col>
            <el-col :lg="6"
              ><el-form-item label="分管财务院长" prop="financialdean">
                <el-select v-model="pageForm.reviewers.financialdean" placeholder="请选择分管财务院长">
                  <el-option v-for="item in reviewerList.financialdean" :key="item.userId" :label="item.nickName" :value="item.userName">
                  </el-option> </el-select></el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <button class="submit" @click="submit">提交</button>
          <button @click="cancel">返回</button>
        </div>
      </div>
    </div>

    <!-- 用户导入对话框 -->
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
const defaultSettings = require('@/settings.js')
import { getToken } from '@/utils/auth'
import myStep from '../components/myStep.vue'
import fuJian from '../components/fuJian.vue'
import fileList from '@/components/FileUpload/fileList.vue'
import { submitProject, getReviewer } from '@/api/project/application'

export default {
  name: 'application',
  components: { myStep, fuJian, fileList },
  data() {
    return {
      showDialog: true,
      stepNum: 0,
      showFuJian: false,
      activeFj: '',
      firstCompleted: false,
      secondCompleted: false,
      thirdCompleted: false,
      fourthCompleted: false,
      // 上传参数
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
      pageForm: {
        assignmentForm: {
          schoolName: '',
          proName: '',
          proNo: '',
          deptName: '',
          address: '',
          headerName: '',
          headerTel: null,
          proAttr: '',
          proNecessity: '',
          proFeasibility: '',
          proContentAndStatement: '',
          appAmount: null,
          economicClf: [{ economic: '', money: null }],
          proPlan: [{ startTime: '', endTime: '', content: '' }],
          expectedRevenue: '',
          schoolOpinion: '',
        },
        assetForm: [
          { assetName: '', isSoftWare: '', assetType: '', addNum: null, unitPrice: null, totalPrice: null, remark: '', isAttachment: '' },
        ],
        taskForm: [
          {
            proContent: '',
            proCategory: '',
            proNature: '',
            budgetAmount: null,
            addSchoolBuildArea: null,
            renovationSchoolBuildArea: null,
            equipment: null,
            teachers: null,
            books: null,
            addSportsFieldArea: null,
            trainees: null,
            sdqngwMeters: null,
            informationSystem: null,
            roadArea: null,
          },
        ],
        applicationForm: {
          specialName: '',
          specialYear: '',
          centralCompetent: '',
          provincialFinance: '',
          educationSector: '',
          annualAmount: null,
          centralSubsidies: null,
          annualTarget: '',
          target: [],
        },
        // 主页数据
        proMainData: {
          gid: '',
          proName: '',
          appTime: '',
          deptName: '',
          appAmount: '',
          reviewAmount: '',
          proTimes: [],
          currentState: 1,
          meetingMinutes: '',
          nickName: '',
        },
        // 展示上传文件列表
        fileList: [],
        reviewers: {
          asset: '',
          department: '',
          finance: '',
          financialdean: '',
        },
      },
      reviewerList: null,
      reviewerRule: {
        asset: [{ required: true, message: '请选择资产处', trigger: 'change' }],
        department: [{ required: true, message: '请选择部门领导', trigger: 'change' }],
        finance: [{ required: true, message: '请选择财务处', trigger: 'change' }],
        financialdean: [{ required: true, message: '请选择分管财务院长', trigger: 'change' }],
      },
    }
  },
  created() {
    this.getProReviewer()
  },
  methods: {
    closeDialog() {
      this.showDialog = false
    },

    // 点击填写文档
    gotoPage(val) {
      this.activeFj = val
      this.showFuJian = true
    },

    // 获取审核人员列表
    getProReviewer() {
      getReviewer().then((res) => {
        console.log(res)
        this.reviewerList = res.data
      })
    },

    // 获取page数据
    getDataPage(e1, e2) {
      switch (e2) {
        case 'one':
          this.pageForm.assignmentForm = JSON.parse(JSON.stringify(e1))
          this.firstCompleted = true
          this.pageForm.proMainData.proName = this.pageForm.assignmentForm.proName
          this.pageForm.proMainData.appTime = new Date()
          this.pageForm.proMainData.proTimes = []
          this.pageForm.proMainData.proTimes.push(this.pageForm.assignmentForm.proPlan[0].startTime)
          this.pageForm.proMainData.proTimes.push(this.pageForm.assignmentForm.proPlan[this.pageForm.assignmentForm.proPlan.length - 1].endTime)

          this.pageForm.proMainData.deptName = this.pageForm.assignmentForm.deptName
          this.pageForm.proMainData.appAmount = this.pageForm.assignmentForm.appAmount
          // 审议金额待定
          // this.proMainData.ReviewAmount = this.pageForm.assignmentForm.AppAmount
          break

        case 'two':
          this.pageForm.assetForm = JSON.parse(JSON.stringify(e1))
          this.secondCompleted = true
          break

        case 'three':
          this.pageForm.taskForm = JSON.parse(JSON.stringify(e1))
          this.thirdCompleted = true
          break

        case 'four':
          this.pageForm.applicationForm = JSON.parse(JSON.stringify(e1))
          this.fourthCompleted = true
          break

        default:
          break
      }
      this.$message({
        type: 'success',
        message: '保存成功!',
      })
      // this.showFuJian = e3
    },

    // 取消输入
    cancelPaper() {
      this.showFuJian = false
    },

    /** 上传操作 */
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
        this.pageForm.fileList.push(response.data[0])
        this.$refs.fileListRef.getFileList()
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },

    // 删除文件
    deleteFile(index) {
      this.pageForm.fileList.splice(index, 1)
    },

    // 提交
    submit() {
      if (this.firstCompleted && this.secondCompleted && this.thirdCompleted && this.fourthCompleted) {
        this.$refs['reviewerRef'].validate((valid) => {
          if (valid) {
            submitProject(this.pageForm).then((res) => {
              this.$message.success('提交成功！')
              this.resetting()
              this.showDialog = true
            })
          }
        })
      } else {
        this.$message.error('请先填写附件')
      }
    },

    // 取消
    cancel() {
      this.resetting()
      this.showDialog = true
    },

    // 格式化数据
    resetting() {
      this.firstCompleted = false
      this.secondCompleted = false
      this.thirdCompleted = false
      this.fourthCompleted = false
      // 清除数据
      this.pageForm = {
        assignmentForm: {
          schoolName: '',
          proName: '',
          proNo: '',
          deptName: '',
          address: '',
          headerName: '',
          headerTel: '',
          proAttr: null,
          proNecessity: '',
          proFeasibility: '',
          proContentAndStatement: '',
          appAmount: null,
          economicClf: [{ economic: '', money: null }],
          proPlan: [{ startTime: '', endTime: '', content: '' }],
          expectedRevenue: '',
          schoolOpinion: '',
        },
        assetForm: [
          { assetName: '', isSoftWare: '', assetType: '', addNum: null, unitPrice: null, totalPrice: null, remark: '', isAttachment: '' },
        ],
        taskForm: [
          {
            proContent: '',
            proCategory: '',
            proNature: '',
            budgetAmount: null,
            addSchoolBuildArea: null,
            renovationSchoolBuildArea: null,
            equipment: null,
            teachers: null,
            books: null,
            addSportsFieldArea: null,
            trainees: null,
            sdqngwMeters: null,
            informationSystem: null,
            roadArea: null,
          },
        ],
        applicationForm: {
          specialName: '',
          specialYear: '',
          centralCompetent: '',
          provincialFinance: '',
          educationSector: '',
          annualAmount: null,
          centralSubsidies: null,
          annualTarget: '',
          target: [],
        },
        // 主页数据
        proMainData: {
          gid: '',
          proName: '',
          appTime: '',
          deptName: '',
          appAmount: '',
          reviewAmount: '',
          proTimes: [],
          currentState: 1,
          meetingMinutes: '',
          nickName: '',
        },
        // 展示上传文件列表
        fileList: [],
        reviewers: {
          asset: '',
          department: '',
          finance: '',
          financialdean: '',
        },
      }
    },
  },
}
</script>

<style scoped lang="scss">
.application {
  position: relative;
  min-height: 880px;
  background: #eeeeee;
}
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 999;

  .dialog-img {
    display: block;
    margin: 200px auto 0;
  }

  p {
    text-align: center;
    color: #000;
  }

  button {
    display: block;
    margin: 30px auto 0;
    background: #0052d9;
    color: #fff;
    width: 88px;
    height: 32px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
}

.app-main {
  width: 95%;
  min-height: 700px;
  margin: 0 auto;
  padding: 10px 30px;
  background: #fff;

  .five-page {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    .page {
      width: 270px;
      height: 200px;
      border: 1px #d4d6d9 dashed;
      cursor: pointer;

      .page-stated,
      .page-unstate {
        width: 56px;
        height: 23px;
        border: 5px;
        margin: 16px 16px 0;
        padding: 0 2px;
        line-height: 23px;
        background: #0052d9;
        color: #fff;
      }

      .page-unstate {
        background: #eeeeee;
        color: #8b8d90;
      }

      .img-stated,
      .img-unstate {
        height: 107px;
        width: 107px;
        cursor: pointer;
        margin: 5px auto;
        border: 1px dashed #d4d6d9;

        img {
          margin: 0 auto;
        }
      }

      .img-stated {
        border: none;
      }

      p {
        text-align: center;
        color: #58595c;
      }
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
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
    }

    .submit {
      background: #0052d9;
      color: #fff;
    }
  }
}
</style>
