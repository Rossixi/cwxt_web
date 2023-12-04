<template>
  <div class="app-container review-detail">
    <div class="fujian" v-if="showitem">
      <review-fujian :pageForm="projectDetails" :activeNum="itemNum" @back-review="backReview" @edit-project="editProject"></review-fujian>
    </div>
    <div class="content" v-else>
      <el-row :gutter="20">
        <el-col :lg="24" :sm="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-size: 18px; font-weight: 700">项目信息</span>
            </div>
            <div class="flex-box" v-if="projectDetails.proMainData">
              <div class="personal-infor">
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
                  <p>{{ projectDetails.proMainData.appAmount }} 元</p>
                </div>
                <div class="infor-item">
                  <h4>党委会审议金额</h4>
                  <p>{{ projectDetails.proMainData.reviewAmount }} 元</p>
                </div>
                <div class="infor-item">
                  <h4>项目起止时间</h4>
                  <p>{{ projectDetails.proMainData.proTimes[0] }} 至 {{ projectDetails.proMainData.proTimes[1] }}</p>
                </div>
                <div class="infor-item">
                  <h4>绩效自评分数</h4>
                  <p>{{ projectDetails.proMainData.selfEvaluationScore }}</p>
                </div>
              </div>
              <div class="review-result">
                <img class="state" :src="stateSrc" alt="" />
                <svg-icon :icon-class="svgClass" class-name="self-result" v-show="projectDetails.proMainData.selfEvaluationResult"> </svg-icon>
                <span>{{ projectDetails.proMainData.selfEvaluationResult }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" type="flex">
        <el-col :lg="18" :sm="24">
          <el-card class="second-box" v-if="projectDetails.proMainData">
            <div slot="header" class="clearfix">
              <span style="font-size: 18px; font-weight: 700">附件文档</span>
            </div>
            <!-- 历史申报文件 -->
            <div v-if="projectDetails.proMainData.currentState > 6">
              <h4 class="small-title">上会审批前申报文本</h4>

              <div class="jujian-list">
                <el-row :gutter="20">
                  <el-col :lg="8" :sm="12">
                    <div class="jujian-item">
                      <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                      <div>
                        <h5>附件1： 项目任务书（历史）</h5>
                        <el-button size="small" type="text" @click="handleHistoryReview(1)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile('assignment_history')">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                  <el-col :lg="8" :sm="12">
                    <div class="jujian-item">
                      <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                      <div>
                        <h5>附件2： 新增资产配置限额表（历史）</h5>
                        <el-button size="small" type="text" @click="handleHistoryReview(2)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile('asset_history')">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                  <el-col :lg="8" :sm="12">
                    <div class="jujian-item">
                      <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                      <div>
                        <h5>附件3： 任务书汇总表（历史）</h5>
                        <el-button size="small" type="text" @click="handleHistoryReview(3)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile('task_history')">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :lg="8" :sm="12">
                    <div class="jujian-item">
                      <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                      <div>
                        <h5>附件4： 绩效目标申请表（历史）</h5>
                        <el-button size="small" type="text" @click="handleHistoryReview(4)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile('application_history')">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <h4 class="small-title" v-if="projectDetails.proMainData.currentState <= 6">项目申报文本</h4>
            <h4 class="small-title" v-else>根据上会结果修改的申报文本</h4>

            <div class="jujian-list">
              <el-row :gutter="20">
                <el-col :lg="8" :sm="12">
                  <div class="jujian-item">
                    <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                    <div>
                      <h5>附件1： 项目任务书</h5>
                      <el-button size="small" type="text" @click="handleReview(1)">预览</el-button>
                      <el-button size="small" type="text" @click="downloadFile('assignment')">下载</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :lg="8" :sm="12">
                  <div class="jujian-item">
                    <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                    <div>
                      <h5>附件2： 新增资产配置限额表</h5>
                      <el-button size="small" type="text" @click="handleReview(2)">预览</el-button>
                      <el-button size="small" type="text" @click="downloadFile('asset')">下载</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :lg="8" :sm="12">
                  <div class="jujian-item">
                    <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                    <div>
                      <h5>附件3： 任务书汇总表</h5>
                      <el-button size="small" type="text" @click="handleReview(3)">预览</el-button>
                      <el-button size="small" type="text" @click="downloadFile('task')">下载</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :lg="8" :sm="12">
                  <div class="jujian-item">
                    <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                    <div>
                      <h5>附件4： 绩效目标申请表</h5>
                      <el-button size="small" type="text" @click="handleReview(4)">预览</el-button>
                      <el-button size="small" type="text" @click="downloadFile('application')">下载</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <h4 class="small-title">其它附件</h4>

            <div class="jujian-list">
              <el-row :gutter="20">
                <el-col :lg="8" :sm="12" v-for="(item, index) in projectDetails.fileList" :key="index">
                  <div class="jujian-item" v-if="item.type == 'application'">
                    <svg-icon icon-class="pdficon" class-name="fujian-icon" v-if="item.fileExtension == '.pdf'"></svg-icon>
                    <svg-icon icon-class="txt" class-name="fujian-icon" v-else-if="item.fileExtension == '.txt'"></svg-icon>
                    <svg-icon icon-class="zipicon" class-name="fujian-icon" v-else-if="item.fileExtension == '.zip'"></svg-icon>
                    <svg-icon icon-class="png" class-name="fujian-icon" v-else-if="item.fileExtension == '.png'"></svg-icon>
                    <svg-icon icon-class="rar" class-name="fujian-icon" v-else-if="item.fileExtension == '.rar'"></svg-icon>
                    <svg-icon icon-class="jpg" class-name="fujian-icon" v-else-if="item.fileExtension == '.jpg'"></svg-icon>
                    <svg-icon icon-class="xml" class-name="fujian-icon" v-else-if="item.fileExtension == '.xml'"></svg-icon>
                    <svg-icon icon-class="word" class-name="fujian-icon" v-else></svg-icon>
                    <div class="filename">
                      <h5 :title="item.fileName">{{ item.fileName }}</h5>
                      <el-button v-if="item.fileExtension == '.pdf'" size="small" type="text" @click="preView(item)">预览</el-button>
                      <el-button size="small" type="text" @click="downloadFile(item)">下载</el-button>
                    </div>
                    <svg-icon
                      v-if="projectDetails.proMainData.currentState == 0 || projectDetails.proMainData.currentState == 6"
                      icon-class="delete"
                      class-name="delete-icon"
                      @click="deleteFile(item.filePath)"
                    ></svg-icon>
                  </div>
                </el-col>
                <el-col :lg="8" :sm="12">
                  <div
                    class="jujian-item upload"
                    v-if="projectDetails.proMainData.currentState == 0 || projectDetails.proMainData.currentState == 6"
                  >
                    <el-button icon="el-icon-upload2" size="mini" @click="handleImport">上传文件</el-button>
                    <div>
                      <h5>如有其它附件请上传</h5>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <div v-if="projectDetails.proMainData.currentState > 2">
              <h4 class="small-title">专家评审</h4>

              <div class="meeting" v-if="projectDetails.proMainData.currentState > 8">
                <el-form ref="form" :model="proInfo" label-width="150px">
                  <el-form-item label="项目编码" prop="money">
                    <el-input v-model="proInfo.proNo" placeholder="请输入项目编码" disabled />
                  </el-form-item>
                </el-form>
              </div>

              <div class="jujian-list">
                <el-row :gutter="20">
                  <el-col :lg="8" :sm="12" v-for="(item, index) in projectDetails.fileList" :key="index">
                    <div class="jujian-item" v-if="item.type == 'expert'">
                      <svg-icon icon-class="pdficon" class-name="fujian-icon" v-if="item.fileExtension == '.pdf'"></svg-icon>
                      <svg-icon icon-class="txt" class-name="fujian-icon" v-else-if="item.fileExtension == '.txt'"></svg-icon>
                      <svg-icon icon-class="zipicon" class-name="fujian-icon" v-else-if="item.fileExtension == '.zip'"></svg-icon>
                      <svg-icon icon-class="png" class-name="fujian-icon" v-else-if="item.fileExtension == '.png'"></svg-icon>
                      <svg-icon icon-class="rar" class-name="fujian-icon" v-else-if="item.fileExtension == '.rar'"></svg-icon>
                      <svg-icon icon-class="jpg" class-name="fujian-icon" v-else-if="item.fileExtension == '.jpg'"></svg-icon>
                      <svg-icon icon-class="xml" class-name="fujian-icon" v-else-if="item.fileExtension == '.xml'"></svg-icon>
                      <svg-icon icon-class="word" class-name="fujian-icon" v-else></svg-icon>
                      <div class="filename">
                        <h5 :title="item.fileName">{{ item.fileName }}</h5>
                        <el-button v-if="item.fileExtension == '.pdf'" size="small" type="text" @click="preView(item)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile(item)">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div v-if="projectDetails.proMainData.currentState > 4">
              <h4 class="small-title">上会审批意见</h4>

              <div class="meeting">
                <el-form ref="form" :model="proInfo" label-width="150px">
                  <el-form-item label="审批金额" prop="money">
                    <el-input v-model="proInfo.reviewAmount" placeholder="请输入审批金额" type="number" disabled />
                  </el-form-item>

                  <el-form-item label="会议纪要文字说明" prop="remark">
                    <el-input v-model="proInfo.meetingMinutes" type="textarea" rows="5" placeholder="请输入会议纪要文字说明" disabled></el-input>
                  </el-form-item>
                </el-form>
              </div>

              <div class="jujian-list">
                <el-row :gutter="20">
                  <el-col :lg="8" :sm="12" v-for="(item, index) in projectDetails.fileList" :key="index">
                    <div class="jujian-item" v-if="item.type == 'meeting'">
                      <svg-icon icon-class="pdficon" class-name="fujian-icon" v-if="item.fileExtension == '.pdf'"></svg-icon>
                      <svg-icon icon-class="txt" class-name="fujian-icon" v-else-if="item.fileExtension == '.txt'"></svg-icon>
                      <svg-icon icon-class="zipicon" class-name="fujian-icon" v-else-if="item.fileExtension == '.zip'"></svg-icon>
                      <svg-icon icon-class="png" class-name="fujian-icon" v-else-if="item.fileExtension == '.png'"></svg-icon>
                      <svg-icon icon-class="rar" class-name="fujian-icon" v-else-if="item.fileExtension == '.rar'"></svg-icon>
                      <svg-icon icon-class="jpg" class-name="fujian-icon" v-else-if="item.fileExtension == '.jpg'"></svg-icon>
                      <svg-icon icon-class="xml" class-name="fujian-icon" v-else-if="item.fileExtension == '.xml'"></svg-icon>
                      <svg-icon icon-class="word" class-name="fujian-icon" v-else></svg-icon>
                      <div class="filename">
                        <h5 :title="item.fileName">{{ item.fileName }}</h5>
                        <el-button v-if="item.fileExtension == '.pdf'" size="small" type="text" @click="preView(item)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile(item)">下载</el-button>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div v-if="projectDetails.proMainData.currentState > 9">
              <h4 class="small-title">绩效自评</h4>

              <div class="jujian-list">
                <!-- <el-row :gutter="20">
                  <el-col :lg="8" :sm="12">
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
                </el-row> -->
                <el-row :gutter="20">
                  <el-col :lg="8" :sm="12" v-for="(item, index) in projectDetails.fileList" :key="index">
                    <div class="jujian-item" v-if="item.type == 'self'">
                      <svg-icon icon-class="pdficon" class-name="fujian-icon" v-if="item.fileExtension == '.pdf'"></svg-icon>
                      <svg-icon icon-class="txt" class-name="fujian-icon" v-else-if="item.fileExtension == '.txt'"></svg-icon>
                      <svg-icon icon-class="zipicon" class-name="fujian-icon" v-else-if="item.fileExtension == '.zip'"></svg-icon>
                      <svg-icon icon-class="png" class-name="fujian-icon" v-else-if="item.fileExtension == '.png'"></svg-icon>
                      <svg-icon icon-class="rar" class-name="fujian-icon" v-else-if="item.fileExtension == '.rar'"></svg-icon>
                      <svg-icon icon-class="jpg" class-name="fujian-icon" v-else-if="item.fileExtension == '.jpg'"></svg-icon>
                      <svg-icon icon-class="xml" class-name="fujian-icon" v-else-if="item.fileExtension == '.xml'"></svg-icon>
                      <svg-icon icon-class="word" class-name="fujian-icon" v-else></svg-icon>
                      <div class="filename">
                        <h5 :title="item.fileName">{{ item.fileName }}</h5>
                        <el-button v-if="item.fileExtension == '.pdf'" size="small" type="text" @click="preView(item)">预览</el-button>
                        <el-button size="small" type="text" @click="downloadFile(item)">下载</el-button>
                      </div>
                      <!-- <svg-icon icon-class="delete" class-name="delete-icon" @click="deleteFile(item.filePath)"></svg-icon> -->
                    </div>
                  </el-col>
                  <!-- <el-col :lg="8" :sm="12">
                    <div class="jujian-item upload" v-if="projectDetails.proMainData.currentState == 10">
                      <el-button icon="el-icon-upload2" size="mini" @click="handleImport">上传文件</el-button>
                      <div>
                        <h5>请上传绩效自评文件</h5>
                      </div>
                    </div>
                  </el-col> -->
                </el-row>
              </div>
            </div>

            <div class="btns" v-if="projectDetails.proMainData.currentState == 0 || projectDetails.proMainData.currentState == 6">
              <button class="submit" @click="editManage">保存</button>
              <button @click="backList">返回</button>
            </div>
            <div class="btns" v-else>
              <button @click="backList">返回</button>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="24" :lg="6">
          <el-card class="jindu" v-if="projectDetails.proMainData">
            <div slot="header" class="clearfix">
              <span style="font-size: 18px; font-weight: 700">审批进度</span>
            </div>
            <el-steps direction="vertical" :active="parseInt(projectDetails.proMainData.currentState)">
              <el-step :title="item.examineName" v-for="(item, index) in scheduleList" :key="index">
                <template slot="description">
                  <div v-if="index == 0 || index == 6">
                    <p><svg-icon icon-class="user"></svg-icon> 申请人：{{ item.approvalName }}</p>
                    <p><svg-icon icon-class="time"></svg-icon> 申请时间：{{ item.time }}</p>
                  </div>
                  <div v-else-if="index == 10">
                    <p><svg-icon icon-class="documentation"></svg-icon> 绩效考核结果：{{ item.approvalcontent }}</p>
                    <p><svg-icon icon-class="time"></svg-icon> 完成时间：{{ item.time }}</p>
                  </div>
                  <div v-else>
                    <p><svg-icon icon-class="user"></svg-icon> 审批人：{{ item.approvalName }}</p>
                    <p><svg-icon icon-class="documentation"></svg-icon> 审批意见： {{ item.approvalcontent }}</p>
                    <p><svg-icon icon-class="time"></svg-icon> 审核时间：{{ item.time }}</p>
                  </div>
                </template>
              </el-step>
            </el-steps>
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
import { getProDetail, editProject, getHistoryProDetail } from '@/api/project/onlineview'
import reviewFujian from '../components/reviewFujian.vue'
export default {
  name: 'reviewDetails',
  components: { reviewFujian },
  data() {
    return {
      projectDetails: {},
      showitem: false,
      itemNum: null,
      dialogTitle: '通过审核意见',
      openDialog: false,
      svgClass: '',
      stateSrc: '',
      comments: '',
      approval: {
        approvalAction: '',
        approvalOpinions: '',
      },
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
      // 审批进度
      scheduleList: [
        { examineName: '项目申请', approvalName: '', time: '' },
        { examineName: '系部审核', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '资产处审核', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '财务处审核', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '分管院长审核', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '上会审批意见', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '项目申请（复审）', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '系部审核（复审）', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '资产处审核（复审）', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '财务处审核（复审）', approvalName: '', approvalcontent: '', time: '' },
        { examineName: '绩效自评', approvalName: '', approvalcontent: '', time: '' },
      ],
    }
  },
  created() {
    this.getProjectDetails(this.$route.query.gid)
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

        let currentStateArr = [-8, -9, -10]

        if (this.projectDetails.proMainData.currentState < 0) {
          if (currentStateArr.some((item) => item == this.projectDetails.proMainData.currentState)) {
            this.projectDetails.proMainData.currentState = 6
          } else {
            this.projectDetails.proMainData.currentState = 0
          }
          this.stateSrc = require('@/assets/image/dsh.png')
        } else if (this.projectDetails.proMainData.currentState == 10) {
          this.stateSrc = require('@/assets/image/dzp.png')
        } else if (this.projectDetails.proMainData.currentState == 11) {
          this.stateSrc = require('@/assets/image/yjx.png')
        } else {
          this.stateSrc = require('@/assets/image/dsh.png')
        }

        if (this.projectDetails.proMainData.currentState > 6) {
          this.getHistoryProjectDetail(this.$route.query.gid)
        }

        if (this.projectDetails.proMainData.selfEvaluationResult == '优') {
          this.svgClass = 'bg_A'
        } else if (this.projectDetails.proMainData.selfEvaluationResult == '差') {
          this.svgClass = 'bg_D'
        } else {
          this.svgClass = 'bg_BC'
        }
        // 审批进度
        for (let i = 0; i < res.data.approval.length; i++) {
          this.scheduleList[i].approvalName = res.data.approval[i].nickName
          this.scheduleList[i].time = res.data.approval[i].approvaledTime

          this.scheduleList[i].approvalcontent = res.data.approval[i].approvalOpinions
        }
      })
    },

    // 展示附件
    handleReview(index) {
      this.itemNum = index
      this.showitem = true
    },

    handleHistoryReview(index) {
      this.projectData = this.projectHistoryData
      this.itemNum = index
      this.showitem = true
    },

    // 修改文件
    editProject(e1, e2) {
      switch (e2) {
        case 'one':
          this.projectDetails.assignmentForm = JSON.parse(JSON.stringify(e1))
          this.projectDetails.proMainData.proName = this.projectDetails.assignmentForm.proName
          this.projectDetails.proMainData.proTimes = []
          this.projectDetails.proMainData.proTimes.push(this.projectDetails.assignmentForm.proPlan[0].startTime)
          this.projectDetails.proMainData.proTimes.push(
            this.projectDetails.assignmentForm.proPlan[this.projectDetails.assignmentForm.proPlan.length - 1].endTime,
          )

          this.projectDetails.proMainData.deptName = this.projectDetails.assignmentForm.deptName
          this.projectDetails.proMainData.appAmount = this.projectDetails.assignmentForm.appAmount
          // 审议金额待定
          // this.proMainData.ReviewAmount = this.projectDetails.assignmentForm.AppAmount
          break

        case 'two':
          this.projectDetails.assetForm = JSON.parse(JSON.stringify(e1))
          break

        case 'three':
          this.projectDetails.taskForm = JSON.parse(JSON.stringify(e1))
          break

        case 'four':
          this.projectDetails.applicationForm = JSON.parse(JSON.stringify(e1))
          break

        default:
          break
      }
      this.showitem = false
    },

    // 修改接口

    // 返回审核页
    backReview() {
      this.showitem = false
    },

    // 复审/退回修改
    editManage() {
      editProject(this.projectDetails).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '保存成功!',
          })
          this.$router.replace({ path: '/manage' })
        }
      })
    },

    // 返回列表
    backList() {
      this.$store.dispatch('/managedetails', this.$route)
      this.$router.push({ path: '/manage' })
    },

    preView(file) {
      localStorage.setItem('pdfUrl', process.env.VUE_APP_BASE_API + '/project/file/preview?mainid=' + file.mainId + '&fileid=' + file.gid)
      window.open('/preview')
      // downReviewFile('/project/file/preview?mainid=' + file.mainId + '&fileid=' + file.gid, file.fileName)
    },

    // 下载
    downloadFile(file) {
      if (Object.prototype.toString.call(file) === '[object Object]') {
        downReviewFile(file.downUrl, file.fileName)
      } else {
        let fileName = ''
        switch (file) {
          case 'assignment':
            fileName = '项目任务书.docx'
            break
          case 'asset':
            fileName = '新增资产配置限额表.xlsx'
            break
          case 'task':
            fileName = '任务书汇总表.xlsx'
            break
          case 'application':
            fileName = '绩效目标申报表.xlsx'
            break
          case 'assignment_history':
            fileName = '项目任务书（历史）.docx'
            break
          case 'asset_history':
            fileName = '新增资产配置限额表（历史）.xlsx'
            break
          case 'task_history':
            fileName = '任务书汇总表（历史）.xlsx'
            break
          case 'application_history':
            fileName = '绩效目标申报表（历史）.xlsx'
            break

          default:
            break
        }
        downReviewFile('/project/file/exportproinfo?mainid=' + this.projectDetails.proMainData.gid + '&type=' + file, fileName)
      }
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

    getHistoryProjectDetail(id) {
      getHistoryProDetail(id).then((res) => {
        this.projectHistoryData = res.data
      })
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
  // min-height: 880px;
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
      padding: 80px 50px 0;
      position: relative;

      .state {
        width: 60%;
        position: absolute;
        left: 0;
        top: -60px;
      }

      .self-result {
        width: 150px;
        height: 150px;
      }

      span {
        position: absolute;
        top: 135px;
        left: 90px;
        font-size: 36px;
        font-weight: 700;
        color: #fff;
      }
    }
  }

  .second-box {
    margin-top: 20px;
    // height: calc(100% - 55px);
    height: calc(100% - 25px);

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
    height: calc(100% - 25px);

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
