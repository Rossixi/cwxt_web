<template>
  <div class="assignment">
    <h2>任务书汇总表</h2>
    <div class="first-line">
      <div class="xibu-name">
        <p>学校名称：</p>
      </div>
      <div class="tiankong"></div>
      <div class="tips">
        <p>年 批</p>
      </div>
    </div>
    <el-table :data="taskForm" border show-summary :summary-method="getSummaries" style="width: 100%" v-if="taskForm">
      <!-- <el-table-column type="index" label="序号" width="45"> </el-table-column> -->
      <el-table-column label="项目名称" prop="ProName" width="145"> </el-table-column>
      <el-table-column label="项目编号" prop="ProNo" width="93"> </el-table-column>
      <el-table-column label="项目内容概述" width="300">
        <template slot-scope="scope">
          <el-input type="textarea" v-model="scope.row.ProContent" maxlength="100" show-word-limit rows="3"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="项目类别" width="127">
        <template slot-scope="scope">
          <el-select v-model="scope.row.ProCategory" placeholder="">
            <el-option v-for="dict in proCateGory" :key="dict.dictValue" :value="dict.dictValue" :label="dict.dictLabel"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="项目性质" width="127">
        <template slot-scope="scope">
          <el-select v-model="scope.row.ProNature" placeholder="">
            <el-option v-for="dict in proNature" :key="dict.dictValue" :value="dict.dictValue" :label="dict.dictLabel"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="预算金额（万元）" width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.BudgetAmount" type="number"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="预期效益">
        <el-table-column label="新建改扩建校舍（平方米）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.AddSchoolBuildArea" type="number"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="维修装修校舍面积（平方米）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.RenovationSchoolBuildArea"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="购置仪器设备（台套数）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Equipment"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="双师型教师增加值（人数）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Teachers"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="新增图书册数（万册）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Books"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="新建或维修运动场面积（平方米）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.AddSportsFieldArea"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="新增实习实训工位数（个）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Trainees"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="水电气暖管网工程量（延米）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.SdqngwMeters"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="建设应用信息化系统个数" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.InformationSystem"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="道路建设面积（平方米）" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.RoadArea"></el-input>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="预计完成时间" prop="ProEndTime" width="127" fixed="right"> </el-table-column>
    </el-table>
    <div class="second-line">
      <p>联系人：</p>
      <p>联系电话：</p>
    </div>
    <div class="illustrate">
      <p>说明：</p>
      <ul>
        <li>任务书备案项目总经费合计为省财政厅下达学校批次预算总额；</li>
        <li>所有项目预计完成时间，不得晚于资金年度12月，格式为202211。</li>
        <li>项目编码规则为学校五位国标代码+资金年度+批次+序号，如武汉职院2018年第二批资金第五个项目，编码为：1083420180205</li>
      </ul>
    </div>
    <div class="btns">
      <button class="submit" @click="save">保存</button>
      <button @click="goBack()">返回</button>
    </div>
  </div>
</template>

<script>
import fujianMixin from './mixin/fujianMixin'
export default {
  name: 'assetPaper',
  mixins: [fujianMixin],
  props: {
    // activeNum: {
    //   type: Number,
    //   default: 0,
    // },
    form: {
      type: Array,
      required: true,
    },
    assignForm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      taskForm: null,
      proNature: [],
      proCateGory: [],
    }
  },

  mounted() {
    this.taskForm = JSON.parse(JSON.stringify(this.form))
    this.taskForm[0].ProName = JSON.parse(JSON.stringify(this.assignForm.ProName))
    this.taskForm[0].ProNo = JSON.parse(JSON.stringify(this.assignForm.ProNo))
    this.taskForm[0].ProEndTime = JSON.parse(JSON.stringify(this.assignForm.ProPlan[this.assignForm.ProPlan.length - 1].endTime))

    // 获取字典-项目性质
    this.getDicts('pro_nature').then((response) => {
      this.proNature = response.data
    })
    // 获取字典-项目类别
    this.getDicts('pro_category').then((response) => {
      this.proCateGory = response.data
    })
  },

  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (index === 6) {
          const values = data.map((item) => {
            return parseFloat(item.BudgetAmount)
          })
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] += ' 万元'
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
    },

    save() {
      let task = JSON.parse(JSON.stringify(this.taskForm))
      delete task[0].ProName
      delete task[0].ProNo
      delete task[0].ProEndTime
      this.$emit('paper-data', task, 'three')
    },

    // 判断是否修改
    isEdit() {
      let task = JSON.parse(JSON.stringify(this.taskForm))
      delete task[0].ProName
      delete task[0].ProNo
      delete task[0].ProEndTime
      console.log(task, this.form)
      return this.deepCompare(task, this.form)
    },

    goBack() {
      this.$emit('paper-cancel', '3')
    },
  },
}
</script>

<style lang="scss" scoped>
.assignment {
  width: 96%;
  margin: 20px auto;
  min-height: 600px;

  h2 {
    text-align: center;
    background: #0052d9;
    color: #fff;
    line-height: 56px;
    margin-bottom: 0;
    letter-spacing: 5px;
  }

  .first-line {
    width: 100%;
    height: 88px;
    display: flex;

    .xibu-name {
      height: 100%;
      width: 20%;
      border: 1px solid #dcdfe6;
      border-bottom: 0;

      p {
        margin: 0 20px;
        line-height: 88px;
      }
    }

    .tiankong {
      width: 30%;
      height: 100%;
      border: 1px solid #dcdfe6;
      border-left: 0;
      border-bottom: 0;
    }

    .tips {
      width: 50%;
      height: 100%;
      border: 1px solid #dcdfe6;
      border-left: 0;
      border-bottom: 0;
      position: relative;

      p {
        position: absolute;
        bottom: 0;
        right: 10px;
        font-size: 14px;
        line-height: 24px;
        letter-spacing: 20px;
      }
    }
  }

  ::v-deep {
    .el-input__inner {
      border: 0;
      height: 40px;
      font-size: 16px;
    }
    tr.el-table__row {
      height: 70px;
    }

    .el-textarea__inner {
      border: 0;
    }

    .el-table .cell {
      font-size: 14px;
    }

    .el-table th.el-table__cell {
      background-color: #f0f1f5;
      padding-left: 10px;
      font-size: 14px;
      color: #606266;
    }

    .el-table__header-wrapper tbody td.el-table__cell,
    .el-table__footer-wrapper tbody td.el-table__cell {
      padding-left: 10px;
      font-size: 14px;
    }
  }

  .pro-attr {
    border: 1px solid #dcdfe6;
  }

  .second-line {
    width: 100%;
    height: 44px;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;

    p {
      display: inline-block;
      margin: 0 20% 0 3%;
      line-height: 44px;
    }
  }

  .illustrate {
    width: 100%;
    height: 112px;
    border: 1px solid #dcdfe6;
    display: flex;
    padding: 5px 20px;
    line-height: 24px;

    ul {
      list-style-type: decimal;
      padding-left: 25px;
    }
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
      padding: 0;
      border-radius: 3px;
      cursor: pointer;
    }

    .submit {
      background: #0052d9;
      color: #fff;
    }
  }
}
</style>
