<template>
  <div class="app-container" style="height: calc(100vh - 50px)">
    <div class="input">
      <el-form :inline="true" ref="form" :model="form" label-width="80px">
        <el-form-item label="年月">
          <el-date-picker
            type="month"
            placeholder="年月"
            v-model="form.yearMonth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="outPut">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" :height="height" id="daily_table">
      <el-table-column type="index" width="120px" label="序号">
      </el-table-column>
      <el-table-column prop="userName" label="姓名" width="200px">
      </el-table-column>
      <el-table-column
        prop="normalWorkHourSummary"
        label="正常工时(人天)"
        width="200px"
      >
      </el-table-column>
      <el-table-column
        prop="extraWorkHourSummary"
        label="加班工时(人天)"
        width="200px"
      >
      </el-table-column>
      <el-table-column
        prop="subtotalAbsenceDaySummary"
        label="请假工时(人天)"
        width="200px"
      >
      </el-table-column>

      <el-table-column
        prop="subtotalWorkHourSummary"
        label="小计(人天)"
        width="200px"
      >
      </el-table-column>
      <el-table-column align="center" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >日报</el-button
          >
          <el-button
            size="mini"
            @click="handleApprovalEdit(scope.$index, scope.row)"
            >请假</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" fullscreen>
      <daily-template
        ref="dailySummary"
        :ajaxName="ajaxName"
        :selectId="selectId"
        :yearMonth="yearMonth"
      ></daily-template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="approvalVisiable" fullscreen>
      <ApprovalTemplate ref="approvalTemplate" :Name="name" :YearMonth= "form.yearMonth"  :dialogFormVisible = "approvalVisiable" ></ApprovalTemplate>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalVisiable = false">取 消</el-button>
        <el-button type="primary" @click="approvalVisiable = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template> 
<script>
import { queryDailySummary, outPutExcel } from "@/api/daily";
import { formatDate } from "@/utils/dateHelper";
import DailyTemplate from "@/views/daily/dailyTemplate.vue";
import ApprovalTemplate from "@/views/approval/approvalTemplate.vue";
export default {
  components: { DailyTemplate, ApprovalTemplate },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
        dialogVisible: false,
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: [],
      form: { yearMonth: "" },
      height: 0,
      dialogVisible: false,
      ajaxName: "dailySummary",
      selectId: -1,
      yearMonth: "",
      name: "",
      approvalVisiable: false,
    };
  },
  computed: {},
  created() {
    window.onresize = () => {
      this.reloadHeight();
    };
  },
  mounted() {
    this.form.yearMonth = new Date();
    this.$nextTick(() => {
      this.reloadHeight();
    });
  },
  methods: {
    reloadHeight() {
      const domheight = this.$refs.form.$el.offsetHeight;
      this.height =
        window.document.documentElement.clientHeight - 40 - 50 - domheight;
    },
    search() {
      queryDailySummary({
        begDate: formatDate(this.form.yearMonth),
      }).then((response) => {
        this.list = response.data;
      });
    },
    onSubmit() {
      this.search();
    },
    handleEdit(index, row) {
      this.selectId = row.id;
      this.yearMonth = this.form.yearMonth;
      this.dialogVisible = true;
    },
    handleApprovalEdit(index, row) {
      this.name = row.userName;
      this.approvalVisiable = true;

      console.log(this.form.yearMonth);
    },

    outPut() {
      outPutExcel({
        yearMonth: formatDate(this.form.yearMonth),
        contractedSupplier: "网新",
      }).then((respone) => {
        const elt = document.createElement("a");
        elt.setAttribute("href", respone.data);
        elt.click();
      });
    },
  },
};
</script> 
<style>
</style>
 