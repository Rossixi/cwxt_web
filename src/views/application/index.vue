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
        <el-button plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">上传文件</el-button>
        <file-list ref="fileListRef" :list="pageForm.fileList" :showDel="true" @delete-file="deleteFile"></file-list>
        <h3 style="margin-top: 30px">项目申报信息</h3>
        <el-form ref="pageFormRef" :model="pageForm" label-width="110px">
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="项目名称"> <el-input v-model="pageForm.proMainData.ProName" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="项目起始时间"
                ><el-date-picker
                  v-model="pageForm.proMainData.ProTimes"
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
                  v-model="pageForm.proMainData.AppTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  disabled
                >
                </el-date-picker> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="申报部门"> <el-input v-model="pageForm.proMainData.DeptName" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="申报金额"> <el-input v-model="pageForm.proMainData.AppAmount" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="党委会审议金额"> <el-input v-model="pageForm.proMainData.ReviewAmount" disabled></el-input> </el-form-item
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
import { submitProject } from '@/api/project/application'

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
      pageForm: {
        assignmentForm: {
          SchoolName: '',
          ProName: '',
          ProNo: '',
          DeptName: '',
          Address: '',
          HeaderName: '',
          HeaderTel: null,
          ProAttr: '',
          ProNecessity: '',
          ProFeasibility: '',
          ProContentAndStatement: '',
          AppAmount: null,
          EconomicClf: [{ economic: '', money: null }],
          ProPlan: [{ startTime: '', endTime: '', content: '' }],
          ExpectedRevenue: '',
          SchoolOpinion: '',
        },
        assetForm: [
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
        ],
        taskForm: [
          {
            ProContent: '',
            ProCategory: '',
            ProNature: '',
            BudgetAmount: null,
            AddSchoolBuildArea: null,
            RenovationSchoolBuildArea: null,
            Equipment: null,
            Teachers: null,
            Books: null,
            AddSportsFieldArea: null,
            Trainees: null,
            SdqngwMeters: null,
            InformationSystem: null,
            RoadArea: null,
          },
        ],
        applicationForm: {
          SpecialName: '',
          SpecialYear: '',
          CentralCompetent: '',
          ProvincialFinance: '',
          AnnualAmount: null,
          CentralSubsidies: null,
          AnnualTarget: '',
          target: [],
        },
        // 主页数据
        proMainData: {
          ProName: '',
          AppTime: '',
          DeptName: '',
          AppAmount: '',
          ReviewAmount: '',
          ProTimes: [],
          CurrentState: '',
          MeetingMinutes: '',
          NickName: '',
        },
        // 展示上传文件列表
        fileList: [],
      },
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.showDialog = false
    },

    // 点击填写文档
    gotoPage(val) {
      this.activeFj = val
      this.showFuJian = true
    },

    // 获取page数据
    getDataPage(e1, e2) {
      switch (e2) {
        case 'one':
          this.pageForm.assignmentForm = JSON.parse(JSON.stringify(e1))
          this.firstCompleted = true
          this.pageForm.proMainData.ProName = this.pageForm.assignmentForm.ProName
          this.pageForm.proMainData.AppTime = new Date()
          this.pageForm.proMainData.ProTimes.push(this.pageForm.assignmentForm.ProPlan[0].startTime)
          this.pageForm.proMainData.ProTimes.push(this.pageForm.assignmentForm.ProPlan[this.pageForm.assignmentForm.ProPlan.length - 1].endTime)

          this.pageForm.proMainData.DeptName = this.pageForm.assignmentForm.DeptName
          this.pageForm.proMainData.AppAmount = this.pageForm.assignmentForm.AppAmount
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
      console.log(e1)
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
        submitProject(this.pageForm).then((res) => {
          console.log(res)
          this.$message.success('提交成功！')
          this.resetting()
          this.showDialog = true
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
          SchoolName: '',
          ProName: '',
          ProNo: '',
          DeptName: '',
          Address: '',
          HeaderName: '',
          HeaderTel: '',
          ProAttr: null,
          ProNecessity: '',
          ProFeasibility: '',
          ProContentAndStatement: '',
          AppAmount: null,
          EconomicClf: [{ economic: '', money: null }],
          ProPlan: [{ startTime: '', endTime: '', content: '' }],
          ExpectedRevenue: '',
          SchoolOpinion: '',
        },
        assetForm: [
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
          { AssetName: '', IsSoftWare: '', AssetType: '', AddNum: null, UnitPrice: null, TotalPrice: null, Remark: '', IsAttachment: '' },
        ],
        taskForm: [
          {
            ProContent: '',
            ProCategory: '',
            ProNature: '',
            BudgetAmount: null,
            AddSchoolBuildArea: null,
            RenovationSchoolBuildArea: null,
            Equipment: null,
            Teachers: null,
            Books: null,
            AddSportsFieldArea: null,
            Trainees: null,
            SdqngwMeters: null,
            InformationSystem: null,
            RoadArea: null,
          },
        ],
        applicationForm: {
          SpecialName: '',
          SpecialYear: '',
          CentralCompetent: '',
          ProvincialFinance: '',
          AnnualAmount: null,
          CentralSubsidies: null,
          AnnualTarget: '',
          target: [],
        },
        // 主页数据
        proMainData: {
          ProName: '',
          AppTime: '',
          DeptName: '',
          AppAmount: '',
          ReviewAmount: '',
          ProTimes: [],
          CurrentState: '',
          MeetingMinutes: '',
          NickName: '',
        },
        // 展示上传文件列表
        fileList: [],
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
    margin: 20px auto;
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
