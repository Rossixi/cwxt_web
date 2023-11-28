<template>
  <div class="stepbox">
    <el-steps :active="activeNum" class="steps" :width="500">
      <el-step title="项目申请" @click.native="handleStep(0)"></el-step>
      <el-step title="系部审核" @click.native="handleStep(1)"></el-step>
      <el-step title="资产处审核" @click.native="handleStep(2)"></el-step>
      <el-step title="财务处审核" @click.native="handleStep(3)"></el-step>
      <el-step title="分管财务院长审核" @click.native="handleStep(4)"></el-step>
      <el-step title="上会审批意见" @click.native="handleStep(5)"></el-step>
      <el-step title="项目申请（复审）" @click.native="handleStep(6)"></el-step>
      <el-step title="系部审核（复审）" @click.native="handleStep(7)"></el-step>
      <el-step title="资产处审核（复审）" @click.native="handleStep(8)"></el-step>
      <el-step title="财务处审核（复审）" @click.native="handleStep(9)"></el-step>
      <el-step title="绩效自评" @click.native="handleStep(10)"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'step',
  props: {
    activeNum: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // active: 0,
    }
  },

  methods: {
    handleStep(val) {
      this.activeNum = val
    },
  },
}
</script>

<style lang="scss" scoped>
$publicColor: #148be6;
$publicHeight: 35px;

.steps {
  margin: 0 auto 30px;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-step {
    height: 100%;
    margin-bottom: 20px;

    .el-step__line {
      background-color: rgba(0, 0, 0);
      margin-right: 10px !important;
      margin-left: 180px !important;
      top: 50%;
      height: 1px;
    }
    .el-step__icon {
      width: $publicHeight;
      height: $publicHeight;
      font-size: 16px;
      border: 1px solid;
      .el-step__icon-inner {
        font-weight: unset !important;
      }
    }
    .el-step__head {
      width: 250px;
    }
    .el-step__head.is-process {
      color: $publicColor;
      border-color: $publicColor;
    }
    .el-step__head.is-success {
      color: $publicColor;
      border-color: $publicColor;
    }
    .is-process .el-step__icon.is-text {
      background: $publicColor;
      color: #fff;
    }
    .el-step__title.is-process {
      color: $publicColor;
    }
    .el-step__title.is-success {
      color: #565656;
    }
    .el-step__title {
      position: absolute;
      top: 1px;
      left: 45px;
    }
  }

  ::v-deep .el-step:nth-child(1) {
    .el-step__line {
      margin-left: 130px !important;
    }
  }

  ::v-deep .el-step:nth-child(2) {
    .el-step__line {
      margin-left: 130px !important;
    }
  }

  ::v-deep .el-step:nth-child(3) {
    .el-step__line {
      margin-left: 140px !important;
    }
  }

  ::v-deep .el-step:nth-child(4) {
    .el-step__line {
      margin-left: 140px !important;
    }
  }

  ::v-deep .el-step:nth-last-child(2) {
    .el-step__line {
      margin-left: 190px !important;
    }
  }

  ::v-deep .el-step:nth-last-child(3) {
    .el-step__line {
      margin-left: 190px !important;
    }
  }
}
</style>
