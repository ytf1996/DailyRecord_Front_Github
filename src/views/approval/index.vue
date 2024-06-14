<template>
  <div class="app-container" style="height: calc(100vh - 50px)">
    <div class="input">
      <el-form
        class="elForm"
        :inline="true"
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item>
          <div class="block">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="source"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :height="height"
      >
        <el-table-column prop="userName" style="width: 180px" label="工程师">
        </el-table-column>
        <el-table-column
          prop="begAbsenceTime"
          style="width: 180px"
          label="开始时间"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="endAbsenceTime"
          style="width: 180px"
          label="结束时间"
          :formatter="formatter"
        >
        </el-table-column>
        <el-table-column
          prop="absenceHours"
          style="width: 40px"
          label="请假时长"
        >
        </el-table-column>
        <el-table-column
          prop="absenceReason"
          style="width: 240px"
          label="请假原因"
        >
        </el-table-column>
        <el-table-column prop="absenceRemark" style="width: 240px" label="备注">
        </el-table-column>
        <el-table-column
          prop="whetherApprove"
          style="width: 40px"
          label="是否审批"
          :formatter="formatterwhetherApprove"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150px"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="el-button--default"
              @click="handleApproval(scope.$index, scope.row)"
              >同意</el-button
            >
            <el-button
              size="mini"
              class="el-button--danger"
              @click="handleRefuse(scope.$index, scope.row)"
              >驳回</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  GetAbsenceInfo,
  AbsenceAdd,
  AbsenceModify,
  AbsenceRemove,
  AbsenceReply,
  GetAbsenceInfoAll,
} from "@/api/absence";
import {
  formatDate,
  getMonthFirstDay,
  getMonthLastDay,
} from "@/utils/dateHelper";
import { MessageBox, Message } from "element-ui";
export default {
  filters: {},
  data() {
    return {
      title: "",
      source: [],
      form: {
        date: [null, null],
      },
      dialogFormVisible: false,
      height: 0,
      addForm: {
        title: "新增",
        date: [],
        AbsenceHours: 0,
        AbsenceReason: "",
        AbsenceRemark: "",
      },
    };
  },
  created() {},
  computed: {},
  mounted() {
    window.onresize = () => {
      this.reloadHeight();
    };
    this.$nextTick(() => {
      this.reloadHeight();
    });
    this.initDate();
  },
  methods: {
    initDate() {
      var date = new Date();
      var firstDay = getMonthFirstDay(date);
      var lastDay = getMonthLastDay(date);
      this.form.date = [firstDay, lastDay];
    },
    reloadHeight() {
      var domheight = this.$refs.form.$el.offsetHeight;
      this.height =
        window.document.documentElement.clientHeight - 40 - 50 - domheight;
    },
    query() {
      GetAbsenceInfoAll({
        begDate: this.form.date[0],
        endDate: this.form.date[1],
        isOnlyNotDealed: false,
      }).then((request) => {
        request.data.forEach((element) => {
          element.userName = element.createdBy.name;
        });
        this.source = request.data;
      });
    },
    btnAddForm() {
      this.addForm.title = "新增";
      this.addForm.date[0] = "";
      this.addForm.date[1] = "";
      this.addForm.AbsenceHours = null;
      this.addForm.AbsenceReason = null;
      this.addForm.AbsenceRemark = null;
      this.addForm.id = null;
      this.dialogFormVisible = true;
    },
    btnAdd() {
      if (this.addForm.title == "新增") {
        var addData = {
          begAbsenceTime: this.addForm.date[0],
          endAbsenceTime: this.addForm.date[1],
          absenceHours: this.addForm.AbsenceHours,
          absenceReason: this.addForm.AbsenceReason,
          absenceRemark: this.addForm.AbsenceRemark,
        };
        AbsenceAdd(addData).then((response) => {
          this.dialogFormVisible = false;
          this.query();
        });
      } else {
        var addData = {
          begAbsenceTime: this.addForm.date[0],
          endAbsenceTime: this.addForm.date[1],
          absenceHours: this.addForm.AbsenceHours,
          absenceReason: this.addForm.AbsenceReason,
          absenceRemark: this.addForm.AbsenceRemark,
          id: this.addForm.id,
        };
        AbsenceModify(addData).then((response) => {
          this.dialogFormVisible = false;
          this.query();
        });
      }
    },
    handleEdit(index, row) {
      this.addForm.title = "修改";
      this.addForm.date[0] = row.begAbsenceTime;
      this.addForm.date[1] = row.endAbsenceTime;
      this.addForm.AbsenceHours = row.absenceHours;
      this.addForm.AbsenceReason = row.absenceReason;
      this.addForm.AbsenceRemark = row.absenceRemark;
      this.addForm.id = row.id;
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm("确认删除？").then(() => {
        AbsenceRemove({ id: row.id }).then((response) => {
          if (response.result == "success") {
            Message({
              message: response.msg,
              type: "success",
              duration: 5 * 1000,
            });
            this.query();
          }
        });
      });
    },
    handleApproval(index, row) {
      this.$confirm("确认同意？").then(() => {
        AbsenceReply({ id: row.id, WhetherApprove: true }).then((response) => {
          if (response.result == "success") {
            Message({
              message: response.msg,
              type: "success",
              duration: 5 * 1000,
            });
            this.query();
          }
        });
      });
    },
    handleRefuse(index, row) {
      this.$confirm("确认驳回？").then(() => {
        AbsenceReply({ id: row.id, WhetherApprove: false }).then((response) => {
          if (response.result == "success") {
            Message({
              message: response.msg,
              type: "success",
              duration: 5 * 1000,
            });
            this.query();
          }
        });
      });
    },
    formatter(row, column, cellValue, index) {
      var date = new Date(cellValue);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month.toString().length < 2) {
        month = "0" + month;
      }
      var day = date.getDate();
      if (day.toString().length < 2) {
        day = "0" + day;
      }
      var hh = date.getHours();
      if (hh.toString().length < 2) {
        hh = "0" + hh;
      }
      var mm = date.getMinutes();
      if (mm.toString().length < 2) {
        mm = "0" + mm;
      }
      return year + "-" + month + "-" + day + " " + hh + ":" + mm;
    },
    formatterwhetherApprove(row, column, cellValue, index) {
      if (cellValue == null) {
        return "未审批";
      }
      return cellValue == true ? "已通过" : "被驳回";
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.whetherApprove == false) {
        return "warning-row";
      }
      if (row.whetherApprove == true) {
        return "success-row";
      }
      return "";
    },
  },
};
</script>

<style>
.elForm {
  float: left;
}
.el-dialog {
  width: 80%;
  height: 60%;
}
.el-textarea {
  width: 80%;
  height: 40px;
}
label {
  width: 100px;
  height: 40px;
}
.el-date-editor {
  width: 50%;
}
.el-table .cell {
  white-space: pre-line;
}
.AddFooter {
  margin-left: 100px;
}
</style>