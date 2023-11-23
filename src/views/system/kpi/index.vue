<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="指标名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入指标名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择指标状态" clearable size="small">
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <!--
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="kpiList">
      <el-table-column prop="proCode" label="专项编码"></el-table-column>
      <el-table-column prop="proName" label="专项名称"></el-table-column>
      <el-table-column prop="indicatorsName1" label="一级指标"></el-table-column>
      <el-table-column prop="indicatorsName2" label="二级指标"></el-table-column>
      <el-table-column prop="indicatorsName3" label="三级指标"></el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:update']"
            >修改</el-button
          >
          <!-- <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-hasPermi="['system:dept:add']">新增</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.PageNum" :limit.sync="queryParams.PageSize" @pagination="getList" />

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :lg="14">
            <el-form-item label="专项名称" prop="proName">
              <el-input v-model="form.proName" placeholder="请输入专项名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="10">
            <el-form-item label="专项编码" prop="proCode">
              <el-input v-model="form.proCode" placeholder="请输入专项编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="14">
            <el-form-item label="一级指标" prop="indicatorsName1">
              <el-input v-model="form.indicatorsName1" placeholder="请输入一级指标" />
            </el-form-item>
          </el-col>
          <el-col :lg="10">
            <el-form-item label="一级指标编码" prop="indicatorsCode1">
              <el-input v-model="form.indicatorsCode1" placeholder="请输入一级指标编码" />
            </el-form-item>
          </el-col>
          <el-col :lg="14">
            <el-form-item label="二级指标" prop="indicatorsName2">
              <el-input v-model="form.indicatorsName2" placeholder="请输入二级指标" />
            </el-form-item>
          </el-col>
          <el-col :lg="10">
            <el-form-item label="二级指标编码" prop="indicatorsCode2">
              <el-input v-model="form.indicatorsCode2" placeholder="请输入二级指标编码" />
            </el-form-item>
          </el-col>
          <el-col :lg="14">
            <el-form-item label="三级指标" prop="indicatorsName3">
              <el-input v-model="form.indicatorsName3" placeholder="请输入三级指标" />
            </el-form-item>
          </el-col>
          <el-col :lg="10">
            <el-form-item label="三级指标编码" prop="indicatorsCode3">
              <el-input v-model="form.indicatorsCode3" placeholder="请输入三级指标编码" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="默认行数" prop="colNum">
              <el-input v-model="form.colNum" placeholder="请输入默认行数" type="number" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="分类状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择分类状态" clearable size="small">
                <el-option label="正常" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="指标说明" prop="indicatorsExplain">
              <el-input type="textarea" rows="5" v-model="form.indicatorsExplain" placeholder="请输入指标说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listKpi, addKpi, updateKpi, deleteKpi } from '@/api/system/kpi'
import { listBudget, firstBudget, addConomic, updateConomic, deleteConomic } from '@/api/system/budget'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'budget',
  components: { Treeselect },
  data() {
    const validatecolNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('默认行数不能为空'))
      } else if (!/(^[1-9]\d*$)/.test(value)) {
        callback(new Error('请输入正确的行数'))
      } else {
        callback()
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        name: undefined,
        PageNum: 1,
        PageSize: 10,
        status: undefined,
      },
      total: 0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        proName: [{ required: true, message: '专项名称不能为空', trigger: 'blur' }],
        proCode: [{ required: true, message: '专项编码不能为空', trigger: 'blur' }],
        indicatorsName1: [{ required: true, message: '一级指标不能为空', trigger: 'blur' }],
        indicatorsName2: [{ required: true, message: '二级指标不能为空', trigger: 'blur' }],
        indicatorsName3: [{ required: true, message: '三级指标不能为空', trigger: 'blur' }],
        colNum: [{ required: true, validator: validatecolNum, trigger: 'blur' }],
        status: [{ required: true, message: '请选择分类状态', trigger: 'change' }],
      },

      firstBudgetName: null,
      kpiList: [],
    }
  },
  created() {
    this.getList()

    this.getDicts('sys_normal_disable').then((response) => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true
      // listDept(this.queryParams).then((response) => {
      //   this.deptList = this.handleTree(response.data, 'deptId')
      //   this.loading = false
      // })

      listKpi(this.queryParams).then((res) => {
        this.kpiList = res.data.result
        this.total = res.data.totalNum
        this.loading = false
      })
    },
    // 字典状态字典翻译
    // statusFormat(row, column) {
    //   return this.selectDictLabel(this.statusOptions, row.status);
    // },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        proCode: undefined,
        proName: undefined,
        indicatorsCode1: undefined,
        indicatorsCode2: undefined,
        indicatorsCode1: undefined,
        indicatorsName1: undefined,
        indicatorsName1: undefined,
        indicatorsName3: undefined,
        colNum: undefined,
        status: undefined,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.id = '0'
      this.open = true
      this.title = '添加绩效指标'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      console.log(row)
      this.form = row
      this.open = true
      this.title = '修改绩效指标'
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != '0') {
            updateKpi(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addKpi(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm('是否确认删除数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return deleteKpi(row.id)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
  },
}
</script>
