<template>
  <div class="assignment">
    <h2>绩效目标申请表</h2>
    <el-form
      ref="applicationFormRef"
      :model="applicationForm"
      :rules="applicationRule"
      label-position="left"
      label-width="250px"
      v-if="applicationForm"
    >
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="年度" prop="specialYear">
            <el-input v-model="applicationForm.specialYear" :disabled="review" placeholder="请输入年度信息"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="专项名称" prop="specialName">
            <el-select v-model="applicationForm.specialName" placeholder="请选择专项名称" @change="getTargetTree" :disabled="review">
              <el-option v-for="dict in specialName" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
              </el-option> </el-select></el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="中央主管部门" prop="centralCompetent">
            <el-select v-model="applicationForm.centralCompetent" placeholder="请选择中央主管部门" :disabled="review">
              <el-option v-for="dict in centralCompetent" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"> </el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="12"
          ><el-form-item label="省级财政部门"> <el-input v-model="applicationForm.provincialFinance" :disabled="review"></el-input> </el-form-item
        ></el-col>
        <el-col :lg="12"
          ><el-form-item label="省级教育部门"> <el-input v-model="applicationForm.deptName" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="奖金情况（万元）" class="bonus">
            <el-form-item label="年度金额" class="bonus-child" prop="annualAmount">
              <el-input v-model="applicationForm.annualAmount" type="number" :disabled="review"></el-input>
            </el-form-item>
            <el-form-item label="其中：中央补助" class="bonus-child">
              <el-input v-model="applicationForm.centralSubsidies" type="number" :disabled="review"></el-input>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="年度目标" class="pro-necessity" prop="annualTarget">
            <el-input type="textarea" rows="3" v-model="applicationForm.annualTarget" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>

      <el-row>
        <el-col :lg="24"
          ><el-form-item label="绩效指标" ref="targetRef" v-if="applicationForm.target.length > 0" class="target-table">
            <el-table :data="applicationForm.target" border style="width: 100%" :span-method="objectSpanMethod">
              <el-table-column label="一级指标" prop="indicatorsName1"> </el-table-column>
              <el-table-column label="二级指标" prop="indicatorsName2"> </el-table-column>
              <el-table-column label="三级指标">
                <template slot-scope="scope">
                  <el-form-item :prop="applicationForm.target.indicatorsName3">
                    <el-select v-model="scope.row.indicatorsName3" placeholder="" @focus="getThreeTarget(scope.row)" :disabled="review">
                      <el-option v-for="item in thirdTarget" :key="item" :label="item" :value="item"> </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="指标值">
                <template slot-scope="scope">
                  <el-form-item :prop="applicationForm.target.indicatorsValue">
                    <el-input v-model="scope.row.indicatorsValue" :disabled="review"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>

            <div class="right-btns" ref="rightBtnRef" v-if="!review">
              <div class="add-plan" v-for="item in btnsList" :key="item.index" @click="addTarget(item)">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </div> </el-form-item
        ></el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <button class="submit" @click="save" v-if="!review">保存</button>
      <button @click="goBack()">返回</button>
    </div>
  </div>
</template>

<script>
import fujianMixin from './mixin/fujianMixin'
import { getTargetTable, getThreeTarget } from '@/api/project/application'
import { dataMethod } from '@/utils/tableObjSpanMethod.js'

export default {
  name: 'application',
  mixins: [fujianMixin],
  props: {
    // activeNum: {
    //   type: Number,
    //   default: 0,
    // },
    form: {
      type: Object,
      required: true,
    },

    review: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      specialName: null,
      centralCompetent: null,
      applicationForm: null,
      thirdTarget: [],
      spanObj: {},
      btnsList: [],
      threeTargetParams: {},
      applicationRule: {
        specialYear: [{ required: true, message: '请输入年度信息', trigger: 'blur' }],
        specialName: [{ required: true, message: '请选择专项名称', trigger: 'change' }],
        centralCompetent: [{ required: true, message: '请选择中央主管部门', trigger: 'change' }],
        annualAmount: [{ required: true, message: '请输入年度金额', trigger: 'blur' }],
        annualTarget: [{ required: true, message: '请输入年度目标', trigger: 'blur' }],
      },
    }
  },

  mounted() {
    this.applicationForm = JSON.parse(JSON.stringify(this.form))
    console.log(this.applicationForm)

    // 获取字典-专项名称
    this.getDicts('pro_specialname').then((response) => {
      this.specialName = response.data
    })

    // 获取字典-中央主管部门
    this.getDicts('pro_centralcompetent').then((response) => {
      this.centralCompetent = response.data
    })

    // 初始化表格
    this.spanObj = dataMethod(this.applicationForm.target)
    this.$nextTick(function () {
      if (this.applicationForm.target.length > 0) {
        this.btnsList = []
        this.getBtnList()
        this.editHeight()
      }
    })
  },

  methods: {
    // addEconomic() {
    //   this.applicationForm.EconomicClf.push({ economic: '', money: null })
    //   const labelEconomic = this.$refs.economicRef.$el.querySelector('.el-form-item__label')
    //   labelEconomic.style.lineHeight = 88 + 51 * this.applicationForm.EconomicClf.length + 'px'
    // },

    // addProPlan() {
    //   this.applicationForm.ProPlan.push({ startTime: '', endTime: '', content: '' })
    //   const labelProPlan = this.$refs.proPlanRef.$el.querySelector('.el-form-item__label')
    //   labelProPlan.style.lineHeight = 48 + 51 * this.applicationForm.ProPlan.length + 'px'
    // },

    getTargetTree(value) {
      // 获取表格
      getTargetTable({ SpecialName: value }).then((res) => {
        this.applicationForm.target = res.data

        this.spanObj = dataMethod(this.applicationForm.target)

        this.$nextTick(function () {
          this.getBtnList()

          // 修改左侧label高度
          this.editHeight()
        })
      })
    },

    // 获取三级下拉框数据
    // 获取树形结构
    getThreeTarget(rowData) {
      if (this.threeTargetParams.FirstName == rowData.indicatorsName1 && this.threeTargetParams.SecondName == rowData.indicatorsName2) {
        return
      } else {
        this.threeTargetParams = {
          SpecialName: this.applicationForm.specialName,
          FirstName: rowData.indicatorsName1,
          SecondName: rowData.indicatorsName2,
        }
        getThreeTarget(this.threeTargetParams).then((res) => {
          this.thirdTarget = res.data
        })
      }
    },

    // 合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let _row = this.spanObj[column.property] ? this.spanObj[column.property][rowIndex] : 1
      let _col = _row > 0 ? 1 : 0
      return {
        rowspan: _row,
        colspan: _col,
      }
    },

    // 获取按钮数组
    getBtnList() {
      let btnValue = this.applicationForm.target[0]
      for (let index = 0; index < this.applicationForm.target.length; index++) {
        if (
          btnValue.indicatorsName1 == this.applicationForm.target[index].indicatorsName1 &&
          btnValue.indicatorsName2 == this.applicationForm.target[index].indicatorsName2
        ) {
          continue
        } else {
          this.btnsList.push({ rowData: btnValue, btnIndex: index - 1 })
          btnValue = this.applicationForm.target[index]
        }
      }
      this.btnsList.push({
        rowData: this.applicationForm.target[this.applicationForm.target.length - 1],
        btnIndex: this.applicationForm.target.length - 1,
      })
    },

    // 修改label和按钮位置
    editHeight() {
      const labelEconomic = this.$refs.targetRef.$el.querySelector('.el-form-item__label')
      labelEconomic.style.lineHeight = 48 + 51 * this.applicationForm.target.length + 'px'
      if (!this.review) {
        const rightBtns = this.$refs.rightBtnRef
        rightBtns.style.height = 50 + 51 * this.applicationForm.target.length + 'px'

        // 添加按钮
        setTimeout(() => {
          for (let i = 0; i < rightBtns.children.length; i++) {
            for (let j = 0; j < this.btnsList.length; j++) {
              if (i == j) {
                rightBtns.children[i].style.top = 50 + 51 * this.btnsList[j].btnIndex + 'px'
              }
            }
          }
        }, 100)
      }
    },

    // 增加三级目标
    addTarget(row) {
      this.applicationForm.target.splice(row.btnIndex + 1, 0, row.rowData)
      this.spanObj = dataMethod(this.applicationForm.target)
      this.btnsList = []
      this.getBtnList()
      this.editHeight()
    },

    save() {
      this.$refs['applicationFormRef'].validate((valid) => {
        if (valid) {
          this.$emit('paper-data', this.applicationForm, 'four')
          return true
        } else {
          return false
        }
      })
    },

    // 判断是否修改
    isEdit() {
      return this.deepCompare(this.applicationForm, this.form)
    },

    // 取消保存
    cancelSave() {
      this.applicationForm = JSON.parse(JSON.stringify(this.form))
    },

    goBack() {
      // const labelEconomic = this.$refs.economicRef.$el.querySelector('.el-form-item__label')
      // labelEconomic.style.lineHeight = 89 + 51 * this.applicationForm.EconomicClf.length + 'px'
      // const labelProPlan = this.$refs.proPlanRef.$el.querySelector('.el-form-item__label')
      // labelProPlan.style.lineHeight = 48 + 51 * this.applicationForm.ProPlan.length + 'px'
      this.$emit('paper-cancel', '4')
    },
  },
}
</script>

<style lang="scss" scoped>
.assignment {
  width: 90%;
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

  .pro-attr {
    border: 1px solid #dcdfe6;
  }

  ::v-deep {
    .el-form-item {
      margin: 0;
    }

    .el-form-item__error {
      position: absolute;
      left: 40%;
      top: 50%;
    }

    .el-select {
      width: 100%;
    }

    .el-form-item__label {
      height: 100%;
      background-color: #f0f1f5;
      border: 1px solid #e1e2e5;
      padding-left: 20px;
    }

    .el-input,
    .el-input__inner {
      border-radius: 0;
    }

    .el-input--small .el-input__inner {
      min-height: 34px;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }

    .el-radio-group {
      margin-left: 20px;
      // border: 1px solid #e7e8eb;
    }

    // .el-textarea {
    //   height: 72px;
    // }

    .el-textarea__inner {
      border-radius: 0;
    }

    .pro-necessity {
      .el-form-item__label {
        line-height: 69px;
      }
    }

    .bonus {
      .el-form-item__label {
        line-height: 66px;
      }
    }

    .bonus-child {
      height: 34px;
      .el-form-item__label {
        line-height: 32px;
      }
      .el-form-item__error {
        position: absolute;
        left: 40%;
        top: 25%;
      }
    }

    .school-option {
      position: relative;
      .el-form-item__label {
        line-height: 69px;
      }
      .school-date {
        position: absolute;
        bottom: -10px;
        right: 10px;
        letter-spacing: 40px;
        cursor: not-allowed;
      }
    }

    .pro-content {
      position: relative;
      .el-form-item__label {
        line-height: 143px;
      }

      .el-textarea__inner {
        padding-bottom: 40px;
      }

      .all-money {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;

        .el-form-item__label {
          line-height: 32px;
        }
      }
    }

    .target-table {
      position: relative;

      .el-select {
        width: 100%;
      }

      .add-economic {
        position: absolute;
        bottom: 41px;
        right: -24px;
        width: 25px;
        height: 51px;
        border: 1px solid #e1e2e5;
        border-radius: 0 3px 3px 0;
        background: #f0f1f5;
        cursor: pointer;

        i {
          margin: 20px 5px;
        }
      }
      .el-form-item__label {
        line-height: 139px;
      }
      .el-input__inner {
        border: 0;
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

    .right-btns {
      width: 25px;
      position: absolute;
      top: 0;
      right: -24px;
    }

    .add-plan {
      position: absolute;
      top: 0;
      right: 0;
      width: 25px;
      height: 51px;
      border: 1px solid #e1e2e5;
      border-radius: 0 3px 3px 0;
      background: #f0f1f5;
      cursor: pointer;

      i {
        margin: 20px 5px;
      }
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
