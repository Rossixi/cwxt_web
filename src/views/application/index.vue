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
            <div class="img-stated" v-if="secondCompleted">
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
        <h3 style="margin-top: 30px">项目申报信息</h3>
        <el-form ref="pageFormRef" :model="pageForm" label-width="110px">
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="项目名称"> <el-input v-model="pageForm.name" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="项目起始时间"
                ><el-date-picker
                  v-model="pageForm.time"
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
                  v-model="pageForm.declarationDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  placeholder="选择日期"
                  disabled
                >
                </el-date-picker> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="申报部门"> <el-input v-model="pageForm.partment" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :lg="8"
              ><el-form-item label="申报金额"> <el-input v-model="pageForm.money" disabled></el-input> </el-form-item
            ></el-col>
            <el-col :lg="8"
              ><el-form-item label="党委会审议金额"> <el-input v-model="pageForm.reviewMoney" disabled></el-input> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <div class="btns">
          <button class="submit" @click="submit">提交</button>
          <button @click="cancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        name="file"
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip"><el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据</div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultSettings = require('@/settings.js')
import { getToken } from '@/utils/auth'
import myStep from '../components/myStep.vue'
import fuJian from '../components/fuJian.vue'

export default {
  name: 'application',
  components: { myStep, fuJian },
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
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData',
      },
      pageForm: {
        name: '',
        time: ['2023-11-23', '2023-11-28'],
        declarationDate: '2023-11-23',
        partment: '',
        money: '',
        reviewMoney: '',
        assignmentForm: {
          SchoolName: '青岛大学',
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
        appliactionForm: {
          SpecialName: '',
          SpecialYear: '',
          CentralCompetent: '',
          ProvincialFinance: '',
          AnnualAmount: null,
          CentralSubsidies: null,
          AnnualTarget: '',
          target: [],
        },
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
      this.upload.title = '用户导入'
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
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },

    /** 下载模板操作 */
    importTemplate() {
      this.download('/system/user/importTemplate', '用户数据导入模板')
    },

    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },

    // 提交
    submit() {
      this.$message.success('提交成功！')
      this.showDialog = true
    },

    // 取消
    cancel() {
      // 清除数据
      this.$refs['pageFormRef'].resetFields()
      this.showDialog = true
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
