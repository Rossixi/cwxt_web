<template>
  <div class="assignment">
    <h2>项目任务书</h2>
    <el-form ref="assignmentFormRef" :model="assignmentForm" label-position="left" label-width="250px" v-if="assignmentForm">
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="学校名称"> <el-input v-model="assignmentForm.schoolName" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目名称"> <el-input v-model="assignmentForm.proName" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="12"
          ><el-form-item label="项目编码"> <el-input v-model="assignmentForm.proNo" :disabled="review"></el-input> </el-form-item
        ></el-col>
        <el-col :lg="12"
          ><el-form-item label="责任部门"> <el-input v-model="assignmentForm.deptName" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="实施地址"> <el-input v-model="assignmentForm.address" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="12"
          ><el-form-item label="项目负责人"> <el-input v-model="assignmentForm.headerName" :disabled="review"></el-input> </el-form-item
        ></el-col>
        <el-col :lg="12"
          ><el-form-item label="项目负责人电话">
            <el-input
              v-model="assignmentForm.headerTel"
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              :disabled="review"
            ></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24">
          <el-form-item label="项目属性" prop="resource" class="pro-attr">
            <el-radio-group v-model="assignmentForm.proAttr" :disabled="review">
              <el-radio label="延续项目"></el-radio>
              <el-radio label="新增项目"></el-radio>
            </el-radio-group> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目必要性分析" class="pro-necessity">
            <el-input type="textarea" rows="3" v-model="assignmentForm.proNecessity" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目可行性分析" class="pro-necessity">
            <el-input type="textarea" rows="3" v-model="assignmentForm.proFeasibility" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目主要内容及相关预算说明" class="pro-content">
            <el-input type="textarea" rows="5" v-model="assignmentForm.proContentAndStatement" :disabled="review"></el-input>
            <el-form-item label="申请总金额（万元）" class="all-money">
              <el-input v-model="assignmentForm.appAmount" type="number" :disabled="review"></el-input>
            </el-form-item>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目预算经济分类" class="pro-economic" ref="economicRef">
            <el-table :data="assignmentForm.economicClf" border show-summary :summary-method="getSummaries" style="width: 100%">
              <el-table-column label="经济分类">
                <template slot-scope="scope">
                  <el-form-item :prop="assignmentForm.economicClf.economic">
                    <el-select v-model="scope.row.economic" placeholder="请选择" :disabled="review">
                      <el-option v-for="item in economicList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="金额（万元）">
                <template slot-scope="scope">
                  <el-form-item :prop="assignmentForm.economicClf.money">
                    <el-input v-model="scope.row.money" type="number" :disabled="review"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-economic" @click="addEconomic" v-if="!review"><i class="el-icon-circle-plus-outline"></i></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="项目进度计划安排" class="pro-plan" ref="proPlanRef">
            <el-table :data="assignmentForm.proPlan" border style="width: 100%">
              <el-table-column label="开始时间">
                <template slot-scope="scope">
                  <el-form-item :prop="assignmentForm.proPlan.startTime">
                    <el-date-picker
                      v-model="scope.row.startTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :disabled="review"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="结束时间">
                <template slot-scope="scope">
                  <el-form-item :prop="assignmentForm.proPlan.endTime">
                    <el-date-picker
                      v-model="scope.row.endTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :disabled="review"
                    >
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="完成的内容">
                <template slot-scope="scope">
                  <el-form-item :prop="assignmentForm.proPlan.content">
                    <el-input v-model="scope.row.content" :disabled="review"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
            <div class="add-plan" @click="addProPlan" v-if="!review"><i class="el-icon-circle-plus-outline"></i></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="预期效益" class="pro-necessity">
            <el-input type="textarea" rows="3" v-model="assignmentForm.expectedRevenue" :disabled="review"></el-input> </el-form-item
        ></el-col>
      </el-row>
      <el-row>
        <el-col :lg="24"
          ><el-form-item label="学校意见及承诺" class="school-option">
            <el-input type="textarea" rows="3" v-model="assignmentForm.schoolOpinion" disabled></el-input>
            <p class="school-date">年月日</p>
          </el-form-item></el-col
        >
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
export default {
  name: 'assignment',
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
      economicList: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      assignmentForm: null,
    }
  },

  mounted() {
    this.assignmentForm = JSON.parse(JSON.stringify(this.form))
    console.log(this.assignmentForm)
    this.$nextTick(function () {
      const labelEconomic = this.$refs.economicRef.$el.querySelector('.el-form-item__label')
      labelEconomic.style.lineHeight = 88 + 51 * this.assignmentForm.economicClf.length + 'px'
      const labelProPlan = this.$refs.proPlanRef.$el.querySelector('.el-form-item__label')
      labelProPlan.style.lineHeight = 48 + 51 * this.assignmentForm.proPlan.length + 'px'
    })
  },

  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map((item) => {
          return parseFloat(item.money)
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
      })

      return sums
    },

    addEconomic() {
      this.assignmentForm.economicClf.push({ economic: '', money: null })
      const labelEconomic = this.$refs.economicRef.$el.querySelector('.el-form-item__label')
      labelEconomic.style.lineHeight = 88 + 51 * this.assignmentForm.economicClf.length + 'px'
    },

    addProPlan() {
      this.assignmentForm.proPlan.push({ startTime: '', endTime: '', content: '' })
      const labelProPlan = this.$refs.proPlanRef.$el.querySelector('.el-form-item__label')
      labelProPlan.style.lineHeight = 48 + 51 * this.assignmentForm.proPlan.length + 'px'
    },

    save() {
      this.$emit('paper-data', this.assignmentForm, 'one')
    },

    // 判断是否修改
    isEdit() {
      return this.deepCompare(this.assignmentForm, this.form)
    },

    // 取消保存
    cancelSave() {
      this.assignmentForm = JSON.parse(JSON.stringify(this.form))
    },

    goBack() {
      const labelEconomic = this.$refs.economicRef.$el.querySelector('.el-form-item__label')
      labelEconomic.style.lineHeight = 89 + 51 * this.assignmentForm.economicClf.length + 'px'
      const labelProPlan = this.$refs.proPlanRef.$el.querySelector('.el-form-item__label')
      labelProPlan.style.lineHeight = 48 + 51 * this.assignmentForm.proPlan.length + 'px'
      this.$emit('paper-cancel', '1')
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

    .pro-economic,
    .pro-plan {
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

    .pro-plan {
      .add-plan {
        position: absolute;
        bottom: 0;
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
        line-height: 99px;
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
