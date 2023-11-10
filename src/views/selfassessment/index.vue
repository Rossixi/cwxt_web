<template>
  <div class="app-container online-review">
    <div class="app-main">
      <el-form :model="selectData" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="项目名称" prop="proName">
          <el-input
            v-model="selectData.proName"
            placeholder="请输入项目申报名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="projectList" stripe>
        <el-table-column label="项目名称" prop="proName" width="500">
          <template slot-scope="scope">
            <p class="pro-name" @click="handleReview(scope.row.gid)">{{ scope.row.proName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="currentState">
          <template slot-scope="scope">
            <dict-tag :options="statusOptions" :value="scope.row.currentState" />
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" prop="appTime" :show-overflow-tooltip="true" />
        <el-table-column label="申请人" align="center" prop="nickName" :show-overflow-tooltip="true" />
        <el-table-column label="项目金额（万元）" align="center" prop="appAmount" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleReview(scope.row.gid)">自评</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="selectData.PageNum"
        :limit.sync="selectData.PageSize"
        @pagination="getProjectList"
      />
    </div>
  </div>
</template>

<script>
import { getSelfAssessment } from '@/api/project/selfassessment'
export default {
  name: 'selfassessment',
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
    this.getProjectList()

    let dictParams = [{ dictType: 'pro_status', columnName: 'statusOptions' }]
    this.getDicts(dictParams).then((response) => {
      response.data.forEach((element) => {
        this[element.columnName] = element.list
      })
    })
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      getSelfAssessment(this.selectData).then((res) => {
        console.log(res)
        this.projectList = res.data.result
        this.total = res.data.totalNum
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.selectData.PageNum = 1
      this.getProjectList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },

    // 查看申报项目
    handleReview(id) {
      this.$router.push({ path: '/selfdetails', query: { gid: id } })
    },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
  },
}
</script>

<style scoped lang="scss">
.app-container {
  background: #eeeeee;
}

.app-main {
  width: 95%;
  min-height: 800px;
  margin: 0 auto;
  padding: 20px 30px;
  background: #fff;

  .pro-name {
    font-size: 14px;
    cursor: pointer;
    padding-left: 10px;
    margin: 0;
  }
}
</style>
