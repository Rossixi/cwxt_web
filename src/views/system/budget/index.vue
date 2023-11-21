<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择分类状态" clearable size="small">
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

      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="budgetList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="分类名称" width="260"></el-table-column>
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

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :lg="24">
            <el-form-item label="一级分类" prop="parentId">
              <!-- <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择一级分类" /> -->
              <el-select v-model="form.parentId" placeholder="选择一级分类" clearable size="small">
                <el-option label="无上级分类" :value="0" />
                <el-option v-for="item in firstBudgetName" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="13">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item label="分类状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择分类状态" clearable size="small">
                <el-option label="正常" :value="0" />
                <el-option label="停用" :value="1" />
              </el-select>
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
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept'
import { listBudget, firstBudget, addConomic, updateConomic, deleteConomic } from '@/api/system/budget'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'budget',
  components: { Treeselect },
  data() {
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
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [{ required: true, message: '一级分类不能为空', trigger: 'change' }],
        name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '分类状态不能为空', trigger: 'change' }],
      },

      firstBudgetName: null,
      budgetList: [],
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

      listBudget(this.queryParams).then((res) => {
        this.budgetList = res.data
        this.loading = false
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
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
        parentId: undefined,
        name: undefined,
        status: undefined,
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true

      listBudget(this.queryParams).then((res) => {
        this.budgetList = res.data
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.form.id = '0'
      this.open = true
      this.title = '添加部门'

      firstBudget().then((res) => {
        this.firstBudgetName = res.data
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.parentId = row.parentId
      this.form.id = row.id
      this.form.name = row.name
      this.form.status = row.status
      firstBudget().then((res) => {
        this.firstBudgetName = res.data
      })
      this.open = true
      this.title = '修改部门'
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != '0') {
            updateConomic(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addConomic(this.form).then((response) => {
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
      this.$confirm('是否确认删除名称为 "' + row.name + '" 的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return deleteConomic(row.id)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    //展开/折叠操作
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
  },
}
</script>
