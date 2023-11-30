<template>
  <div class="app-container online-review">
    <div class="app-main">
      <el-form :model="selectData" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="项目状态" prop="state">
          <el-select v-model="selectData.state" multiple collapse-tags placeholder="请选择项目状态" style="width: 250px">
            <el-option v-for="dict in stateList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="proState">
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
          <el-button icon="el-icon-refresh" size="mini" @click="exportList" v-hasPermi="['project:list:export']">导出</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="projectList" stripe>
        <el-table-column label="项目名称" prop="proName">
          <template slot-scope="scope">
            <p class="pro-name" @click="handleReview(scope.row.gid)">{{ scope.row.proName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" align="center" prop="proNo" :show-overflow-tooltip="true" />
        <el-table-column label="申请时间" align="center" prop="appTime" :show-overflow-tooltip="true" />
        <el-table-column label="申报部门" align="center" prop="deptName" :show-overflow-tooltip="true" />
        <el-table-column label="申报金额" align="center" prop="appAmount" :show-overflow-tooltip="true" />

        <el-table-column label="党委会审议金额" align="center" prop="reviewAmount" :show-overflow-tooltip="true" />
        <el-table-column label="项目实施周期" align="center" :show-overflow-tooltip="true">
          <el-table-column label="起" align="center" prop="proStartTime" :show-overflow-tooltip="true" />
          <el-table-column label="止" align="center" prop="proEndTime" :show-overflow-tooltip="true" />
        </el-table-column>

        <el-table-column label="类别" align="center" prop="currentState">
          <template slot-scope="scope">
            <dict-tag :options="statusOptions" :value="scope.row.currentState" />
          </template>
        </el-table-column>
        <el-table-column label="绩效评价结果" align="center" prop="selfEvaluationResult" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleReview(scope.row.gid)">查看</el-button>
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
import { getManageList } from '@/api/project/manage'
import { downReviewFile } from '@/utils/request'

export default {
  name: 'onlineReview',
  data() {
    return {
      // 查询参数
      selectData: {
        proName: '',
        PageNum: 1,
        PageSize: 10,
        state: [],
        sort: 'create_time',
        sortType: 'descending',
      },
      total: 0,
      projectList: [],
      // 类型数据字典
      statusOptions: [],
      // 项目状态list
      stateList: [],
    }
  },
  created() {
    this.getProjectList()

    let dictParams = [{ dictType: 'pro_status', columnName: 'statusOptions' }]
    this.getDicts(dictParams).then((response) => {
      this.stateList = response.data[0].list
      response.data.forEach((element) => {
        this[element.columnName] = element.list
      })
    })
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      getManageList(this.selectData).then((res) => {
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

    // 导出
    exportList() {
      downReviewFile(
        '/project/exportProList?proName=' + this.selectData.proName + '&state=' + this.selectData.state.join(','),
        '项目明细一览表.xlsx',
      )
    },

    // 查看申报项目
    handleReview(id) {
      this.$router.push({ path: '/managedetails', query: { gid: id } })
    },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
  },
}
</script>

<style scoped lang="scss">
.online-review {
  min-height: 880px;
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
