<template>
  <div class="assignment">
    <h2>新增资产配置限额表</h2>
    <div class="first-line">
      <div class="xibu-name">
        <p>系部名称：（单位签字盖章）</p>
      </div>
      <div class="tiankong"></div>
      <div class="tips">
        <p>
          注：单件资产超20万以上（包含20万）必须提供配置说明。（有无配置说明请在附件里标注清楚，配置说明单独WORD页交电子档和纸质档，并盖章签字。）
        </p>
      </div>
    </div>
    <el-table :data="assetForm" border show-summary :summary-method="getSummaries" :cell-style="{ 'text-align': 'center' }" style="width: 100%">
      <el-table-column type="index" label="序号" min-width="5%"> </el-table-column>
      <el-table-column label="资产名称" min-width="16%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.assetName" :disabled="review"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="是否软件" min-width="8%">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isSoftWare" placeholder="" :disabled="review">
            <el-option value="是"> </el-option>
            <el-option value="否"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" min-width="15%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.assetType" :disabled="review"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="新增数量" min-width="7%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.addNum" type="number" :disabled="review" @input="handleNum(scope)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）" min-width="12%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.unitPrice" type="number" :disabled="review" @blur="fixedPrice(scope)"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="新增总金额（元）" min-width="12%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.totalPrice" disabled></el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="18%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :disabled="review"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="附件（有/无）" min-width="8%">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isAttachment" placeholder="" :disabled="review">
            <el-option value="有"> </el-option>
            <el-option value="无"> </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <div class="btns">
      <button class="submit" @click="save" v-if="!review">保存</button>
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

    review: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assetForm: null,
      pattern: /^[1-9]\d*$/,
    }
  },

  mounted() {
    this.assetForm = JSON.parse(JSON.stringify(this.form))
    this.addTenRow()
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
            if (item.addNum && item.unitPrice) {
              item.totalPrice = parseFloat(item.addNum * item.unitPrice).toFixed(2) + ''
            }
            return parseFloat(item.totalPrice)
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
            sums[index] += ' 元'
          } else {
            sums[index] = ''
          }
        }
      })

      return sums
    },

    save() {
      this.$emit('paper-data', this.assetForm, 'two')
      return true
    },

    cancelSave() {
      this.assetForm = JSON.parse(JSON.stringify(this.form))
      this.addTenRow()
    },

    // 补齐十行
    addTenRow() {
      if (this.assetForm.length < 10 && !this.review) {
        for (let i = this.assetForm.length - 1; i < 9; i++) {
          this.assetForm.push({
            assetName: '',
            isSoftWare: '',
            assetType: '',
            addNum: null,
            unitPrice: null,
            totalPrice: null,
            remark: '',
            isAttachment: '',
          })
        }
      }
    },

    // 判断是否修改
    isEdit() {
      return this.deepCompare(this.assetForm.slice(0, 1), this.form)
    },

    fixedPrice(scope) {
      if (scope.row.unitPrice < 0) {
        this.$message.error('请填写正确的单价')
        scope.row.unitPrice = ''
        scope.row.totalPrice = ''
      } else {
        scope.row.unitPrice = parseFloat(scope.row.unitPrice).toFixed(2) + ''
      }
    },

    handleNum(scope) {
      // if (scope.row.addNum < 0) {
      //   this.$message.error('请填写正确的数量')
      //   scope.row.addNum = ''
      //   scope.row.totalPrice = ''
      // } else {
      // }
      const reg = /^[1-9]\d*$/
      if (!reg.test(scope.row.addNum)) {
        this.$message.error('请输入正确的数量')
        scope.row.addNum = ''
        scope.row.totalPrice = ''
      }
    },

    goBack() {
      this.$emit('paper-cancel', '2')
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

      p {
        margin: 20px 30px;
        font-size: 14px;
        line-height: 24px;
        color: #898b8e;
      }
    }
  }

  ::v-deep {
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

  .pro-attr {
    border: 1px solid #dcdfe6;
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
