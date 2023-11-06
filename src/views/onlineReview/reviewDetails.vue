<template>
  <div class="app-container review-detail">
    <el-row :gutter="20">
      <el-col :lg="24" :sm="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px; font-weight: 700">项目信息</span>
          </div>
          <div class="flex-box">
            <div class="personal-infor">
              <div class="infor-item">
                <h4>项目名称</h4>
                <p>rossi</p>
              </div>
              <div class="infor-item">
                <h4>申报时间</h4>
                <p>222</p>
              </div>
              <div class="infor-item">
                <h4>申报部门</h4>
                <p>4444</p>
              </div>
              <div class="infor-item">
                <h4>申报金额</h4>
                <p>555</p>
              </div>
              <div class="infor-item">
                <h4>党委会审议金额</h4>
                <p>666</p>
              </div>
              <div class="infor-item">
                <h4>项目起止时间</h4>
                <p>777</p>
              </div>
              <div class="infor-item">
                <h4>类别</h4>
                <p>777</p>
              </div>
              <div class="infor-item">
                <h4>支付进度</h4>
                <p>777</p>
              </div>
            </div>
            <div class="review-result">绩效考核结果</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg="18" :sm="24">
        <el-card class="second-box">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px; font-weight: 700">附件文档</span>
          </div>

          <h4 class="small-title">项目申报文件</h4>

          <div class="jujian-list">
            <el-row :gutter="20">
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>附件1： 项目任务书</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>附件2： 新增资产配置限额表</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="xml" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>附件3： 任务书汇总表</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
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
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <h4 class="small-title">财务处专家评审</h4>

          <div class="jujian-list">
            <el-row :gutter="20">
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>财务处专家审查意见汇总</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <h4 class="small-title">上会审批意见</h4>

          <div class="jujian-list">
            <el-row :gutter="20">
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>党委会会议纪要</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

          <h4 class="small-title">绩效自评</h4>

          <div class="jujian-list">
            <el-row :gutter="20">
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>绩效自评报告</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :lg="8" :sm="12">
                <div class="jujian-item">
                  <svg-icon icon-class="word" class-name="fujian-icon"></svg-icon>
                  <div>
                    <h5>绩效自评表</h5>
                    <el-button size="small" type="text" @click="handleReview(scope.row.gid)">预览</el-button>
                    <el-button size="small" type="text" @click="downloadFile(scope.row.gid)">下载</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="6">
        <el-card class="second-box jindu">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px; font-weight: 700">审批进度</span>
          </div>
          <el-steps direction="vertical" :active="1">
            <el-step title="项目申请">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="time"></svg-icon> 申请时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="系部审核">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="资产处审核">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="财务处审核">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="分管院长审核">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="上会审批意见">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="项目申请（复审）">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="系部审核（复审）">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="资产处审核（复审）">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="财务处审核（复审）">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
            <el-step title="绩效自评">
              <template slot="description">
                <p><svg-icon icon-class="user"></svg-icon> 申请人：罗西</p>
                <p><svg-icon icon-class="documentation"></svg-icon> 审批意见：同意。</p>
                <p><svg-icon icon-class="time"></svg-icon> 审核时间：2023-11-06</p>
              </template>
            </el-step>
          </el-steps>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProDetail } from '@/api/project/onlineview'
export default {
  name: 'onlineReview',
  data() {
    return {
      // 查询参数
      selectData: {
        proName: '',
        PageNum: 1,
        PageSize: 10,
      },
      total: 0,
      projectList: [],
      // 类型数据字典
      statusOptions: [],
    }
  },
  created() {
    console.log(this.$route.query)
    this.getProjectDetails(this.$route.query.gid)
  },
  methods: {
    // 获取项目列表
    getProjectDetails(id) {
      getProDetail(id).then((res) => {
        console.log(res)
      })
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
      background: pink;
      width: 20%;
      height: 200px;
    }
  }

  .second-box {
    margin-top: 20px;

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
        height: 80px;
        background: #f0f7ff;
        border-radius: 3px;
        margin-bottom: 20px;

        .fujian-icon {
          font-size: 40px;
          margin: 20px;
        }

        h5 {
          margin-top: 19px;
          margin-bottom: 0;
          font-size: 15px;
        }

        button {
          margin-right: 20px;
        }
      }
    }
  }

  .jindu {
    height: 100%;

    ::v-deep {
      .el-step__description {
        p {
          font-size: 14px;
          line-height: 14px;
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
