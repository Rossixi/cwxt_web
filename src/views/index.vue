<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :lg="16" :sm="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 18px; font-weight: 700">个人信息</span>
            <router-link to="/user/profile">
              <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-edit"></i></el-button>
            </router-link>
          </div>
          <div class="personal-infor">
            <div class="infor-item">
              <h3>姓名</h3>
              <p>{{ user.nickName }}</p>
            </div>
            <div class="infor-item">
              <h3>部门</h3>
              <p>{{ user.deptName }}</p>
            </div>
            <div class="infor-item">
              <h3>办公邮箱</h3>
              <p>{{ user.email }}</p>
            </div>
            <div class="infor-item">
              <h3>手机</h3>
              <p>{{ user.phonenumber }}</p>
            </div>
            <div class="infor-item">
              <h3>所属权限组</h3>
              <p>{{ roles[0] }}</p>
            </div>
            <div class="infor-item">
              <h3>是否参与项目任务审核</h3>
              <p>{{ user.isReview }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20" class="mt10">
      <el-col>
        <el-card>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="代办审批" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="已办审批" name="second">配置管理</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script>
const defaultSettings = require('@/settings.js')
import { getUserProfile } from '@/api/system/user'

export default {
  name: 'index',
  data() {
    return {
      // 版本号
      version: defaultSettings.version,
      activeName: 'first',
      user: {},
      roles: [],
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    // 获取用户信息
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data.user
        this.roles = response.data.roles
        // this.roleGroup = response.data.roleGroup
        // this.postGroup = response.data.postGroup
      })
    },

    // 审批切换
    tabClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<style scoped lang="scss">
.tip {
  color: red;
  display: inline-block;
  height: 30px;
  line-height: 30px;
}
.home {
  .personal-infor {
    display: flex;
    flex-wrap: wrap;

    .infor-item {
      width: 25%;
      height: 100px;

      h3 {
        color: #b4b5b7;
      }

      p {
        font-size: 16px;
      }
    }
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
