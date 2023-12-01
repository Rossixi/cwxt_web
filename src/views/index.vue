<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :lg="18" :sm="24">
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
      <el-col :sm="24" :lg="6">
        <el-card class="avtar-card">
          <div class="avtar-box" v-if="user.nickName">
            <el-avatar v-if="avatar.length > 0" :src="avatar" :size="100"></el-avatar>
            <el-avatar v-else :size="100"
              ><span>{{ user.nickName.charAt(0) }}</span></el-avatar
            >
            <h3>{{ user.nickName }}</h3>
            <p>{{ user.deptName }}</p>
            <p>{{ roles[0] }}</p>
          </div>

          <img src="@/assets/image/avtar_bg.png" alt="" />
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20" class="mt10">
      <el-col>
        <el-card>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane label="代办审批" name="first">
              <el-table :data="projectList" stripe>
                <el-table-column label="项目名称" prop="proName">
                  <template slot-scope="scope">
                    <p class="pro-name" @click="handleApprove(scope.row)">{{ scope.row.proName }}</p>
                  </template>
                </el-table-column>
                >
                <el-table-column label="时间" align="center" prop="appTime" width="500" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="已办审批" name="second">
              <el-table :data="projectList" stripe>
                <el-table-column label="项目名称" prop="proName">
                  <template slot-scope="scope">
                    <p class="pro-name" @click="handleApprove(scope.row)">{{ scope.row.proName }}</p>
                  </template>
                </el-table-column>
                >
                <el-table-column label="项目状态" align="center" prop="currentState">
                  <template slot-scope="scope">
                    <dict-tag :options="statusOptions" :value="scope.row.currentState" />
                  </template>
                </el-table-column>
                <el-table-column label="审核状态" align="center" prop="approvalAction" />
                <el-table-column label="审核意见" align="center" prop="approvalOpinions" />
                <el-table-column label="时间" align="center" prop="appTime" width="500" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="selectData.PageNum"
            :limit.sync="selectData.PageSize"
            @pagination="getMatters"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
  </div>
</template>

<script>
const defaultSettings = require('@/settings.js')
import { mapGetters } from 'vuex'
import { getUserProfile } from '@/api/system/user'
import { getPersonalMatters } from '@/api/project/selfassessment'

export default {
  name: 'index',
  data() {
    return {
      // 版本号
      version: defaultSettings.version,
      activeName: 'first',
      user: {},
      roles: [],
      // 查询参数
      selectData: {
        proName: '',
        PageNum: 1,
        PageSize: 10,
        target: 'todo',
        Sort: 'AppTime',
        SortType: 'descending',
        state: '',
      },
      total: 0,
      projectList: [],
      stateList: [],
    }
  },
  created() {
    this.getUser()
    this.getMatters()
    let dictParams = [{ dictType: 'pro_status', columnName: 'statusOptions' }]
    this.getDicts(dictParams).then((response) => {
      this.stateList = response.data[0].list
      response.data.forEach((element) => {
        this[element.columnName] = element.list
      })
    })
  },
  computed: {
    ...mapGetters(['avatar']),
  },
  methods: {
    // 获取用户信息
    getUser() {
      getUserProfile().then((response) => {
        console.log(response)
        this.user = response.data.user
        this.roles = response.data.roles
        // this.roleGroup = response.data.roleGroup
        // this.postGroup = response.data.postGroup
      })
    },

    // 获取代办/已办
    getMatters() {
      getPersonalMatters(this.selectData).then((res) => {
        console.log(res)
        this.projectList = res.data.result
        this.total = res.data.totalNum
      })
    },

    // 点击代办审批
    handleApprove(row) {
      if (this.selectData.target == 'todo') {
        if (row.currentState == 10) {
          this.$router.push({ path: '/selfdetails', query: { gid: row.gid } })
        } else if (row.currentState < 0 || row.currentState == 6) {
          this.$router.push({ path: '/managedetails', query: { gid: row.gid } })
        } else {
          this.$router.push({ path: '/reviewDetails', query: { gid: row.gid } })
        }
      } else {
        console.log(11111)
        this.$router.push({ path: '/managedetails', query: { gid: row.gid } })
      }
    },

    // 审批切换
    tabClick(tab, event) {
      this.selectData.PageNum = 1
      if (tab.index == '0') {
        this.selectData.target = 'todo'
      } else {
        this.selectData.target = 'completed'
      }
      this.getMatters()
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
  .avtar-card {
    background: #0052d9;
    height: 300px;
    position: relative;

    .avtar-box {
      padding: 20px;

      span {
        font-size: 48px;
      }

      h3 {
        font-size: 16px;
        color: #fff;
        line-height: 40px;
        margin-left: 20px;
      }

      p {
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
      }
    }

    img {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .pro-name {
    font-size: 14px;
    cursor: pointer;
    padding-left: 10px;
    margin: 0;
  }
}
</style>
