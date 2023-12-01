<template>
  <div class="app-container online-review">
    <div class="app-main">
      <h4 class="small-title">项目配置</h4>
      <el-form :model="configData" ref="queryForm" :rules="configRule" label-width="158px">
        <el-row>
          <el-col :lg="6">
            <el-form-item label="绩效评分标准 - 优" prop="excellentScore">
              <el-input v-model="configData.excellentScore" placeholder="请输入最低标准" :validate-event="false" />
            </el-form-item>
          </el-col>
          <el-col :lg="6"> <p class="score">—— 100</p> </el-col>
        </el-row>
        <el-row>
          <el-col :lg="6">
            <el-form-item label="绩效评分标准 - 良" prop="goodScore">
              <el-input v-model="configData.goodScore" placeholder="请输入最低标准" :validate-event="false" />
            </el-form-item>
          </el-col>
          <el-col :lg="6">
            <p class="score">—— {{ configData.excellentScore - 1 }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="6">
            <el-form-item label="绩效评分标准 - 中" prop="averageScore">
              <el-input v-model="configData.averageScore" placeholder="请输入最低标准" :validate-event="false" />
            </el-form-item>
          </el-col>
          <el-col :lg="6">
            <p class="score">—— {{ configData.goodScore - 1 }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="6">
            <el-form-item label="绩效评分标准 - 差" prop="poorScore">
              <el-input v-model="configData.poorScore" placeholder="请输入最低标准" :validate-event="false" />
            </el-form-item>
          </el-col>
          <el-col :lg="6">
            <p class="score">—— {{ configData.averageScore - 1 }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="16">
            <el-form-item label="新增资产配置说明" prop="assetIllustrate">
              <el-input
                v-model="configData.assetIllustrate"
                placeholder="请输入"
                type="textarea"
                rows="5"
                maxlength="200"
                show-word-limit
                :validate-event="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="submit" class="configbtn">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { getProConfig, updateProConfig } from '@/api/system/proconfig'
export default {
  name: 'proConfig',
  data() {
    const validateScore = (rule, value, callback) => {
      const reg = /^([0-9][0-9]{0,1}|100)$/
      if (!reg.test(value)) {
        callback(new Error('请输入0-100之间的正整数'))
      } else {
        callback()
      }
    }

    const validateLiang = (rule, value, callback) => {
      if (this.configData.excellentScore) {
        if (this.configData.excellentScore - 1 <= value) {
          callback(new Error('请输入正确的分数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateZhong = (rule, value, callback) => {
      if (this.configData.goodScore) {
        if (this.configData.goodScore - 1 <= value) {
          callback(new Error('请输入正确的分数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateCha = (rule, value, callback) => {
      if (this.configData.averageScore) {
        if (this.configData.averageScore - 1 <= value) {
          callback(new Error('请输入正确的分数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      configData: {},
      configRule: {
        excellentScore: [{ required: true, validator: validateScore }],
        goodScore: [{ required: true, validator: validateScore }, { validator: validateLiang }],
        averageScore: [{ required: true, validator: validateScore }, { validator: validateZhong }],
        poorScore: [{ required: true, validator: validateScore }, { validator: validateCha }],
        assetIllustrate: [{ required: true, message: '请输入新增资产配置说明' }],
      },
    }
  },
  created() {
    this.getProjectConfig()
  },
  methods: {
    // 获取项目配置
    getProjectConfig() {
      getProConfig(1).then((res) => {
        this.configData = res.data
      })
    },

    // 提交
    submit() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          updateProConfig(this.configData).then((res) => {
            if (res.code == 200) {
              this.$message.success('项目配置成功')
            }
          })
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.online-review {
  background: #eeeeee;
}

.app-main {
  width: 95%;
  min-height: 800px;
  margin: 0 auto;
  padding: 20px 30px;
  background: #fff;

  .score {
    margin: 0;
    line-height: 32px;
    padding-left: 10px;
  }

  .configbtn {
    margin: 30px;
  }
}
</style>
