<template>
  <div class="app-container" style="height: calc(100vh - 50px)">
    <el-form
      class="elForm"
      :inline="true"
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-date-picker
        v-model="seletWeekValue"
        :editable="false"
        style="opacity: 0; position: absolute; z-index: 100"
        size="mini"
        :picker-options="{ firstDayOfWeek: 1 }"
        type="week"
        format="yyyy年第WW周"
        :clearable="false"
        :default-time="['00:00:00', '23:59:59']"
        placeholder="请选择日期"
        @change="changeweek"
      >
      </el-date-picker>
      <el-form-item>
        <el-input
          v-model="weekTime"
          :clearable="true"
          placeholder="请选择日期"
          style="width: 250px"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <!--给按钮绑定事件-->
      <el-button type="primary" @click="exportExcel">导出</el-button>
    </el-form>
    <el-table
      :data="WeeklyData"
      border
      stripe
      :height="height"
      id="out-table"
      ref="table"
    >
      <!-- <el-table-column label="日期" prop="BegDate" :formatter="dateFmatter" width="120px" fixed>
        </el-table-column>  -->
      <el-table-column
        label="编号"
        prop="userOrder"
        width="120px"
        :fixed="fixed"
      >
      </el-table-column>
      <el-table-column label="公司" prop="company" width="120px" :fixed="fixed">
      </el-table-column>
      <el-table-column label="职责" prop="duty" width="120px" :fixed="fixed">
      </el-table-column>
      <el-table-column
        label="工程师"
        prop="userName"
        width="120px"
        :fixed="fixed"
      >
      </el-table-column>
      <el-table-column
        v-for="item in WeeklyProjects.WeeklyProjectDatas"
        :key="item.ProjectClassificationInfoId"
        :label="item.ClassificationName"
        :prop="item.ProjectClassificationInfoId"
        :formatter="dataFormatter"
        width="300px" 
      > 
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getWeeklyWorkLogListAll,
  getProjectClassification,
  outPutExcel
} from "@/api/weekly";
import {
  formatDate,
  getMonthFirstDay,
  getMonthLastDay,
} from "@/utils/dateHelper";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { Divider } from 'element-ui';

export default {
  filters: {},
  data() {
    return {
      height: 500,
      WeeklyProjects: {
        WeeklyProjectDatas: [],
      },
      WeeklyData: [],
      form: {
        date: [null, null],
      },
      seletWeekValue: "",
      weekTime: "",
      startTimeNum: "",
      endTimeNum: "",
      fixed: "left",
    };
  },
  created() {},
  computed: {},
  mounted() {
    this.changeweek();
    window.onresize = () => {
      this.reloadHeight();
    };
    this.$nextTick(() => {
      this.reloadHeight();
    });

    this.initDate();
    getProjectClassification().then((response) => {
      var list = [];
      response.data.forEach((element) => {
        list.push({
          ClassificationName: element.classificationName,
          ProjectClassificationInfoId: element.id + "",
        });
      });
      this.WeeklyProjects.WeeklyProjectDatas = list;
    });
    this.search();
  },
  methods: {
    timestampToTime(timestamp) {
      var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + "";
      D = D.length < 2 ? "0" + D : D;
      return Y + M + D;
    },
    // 周选择器开始时间和结束时间
    changeweek(val) {
      // val===> Mon Nov 09 2020 00:00:00 GMT+0800 (中国标准时间)
      let todayDay = val ? new Date(val) : new Date();
      let todayOfWeek = todayDay.getDay();
      // let todayOfmonth = todayDay.getMonth()
      // let todayOfDate = todayDay.getDate()
      let spendDay = 1;
      if (todayOfWeek !== 0) {
        spendDay = 7 - todayOfWeek; // 开始时间到结束时间还有几天
      }
      //  86400000为一天的毫秒数
      this.startTimeNum = todayDay.valueOf() - (6 - spendDay) * 86400000; // 开始时间时间戳
      this.endTimeNum = todayDay.valueOf() + spendDay * 86400000; // 结束时间时间戳
      let startTimeStr = this.timestampToTime(this.startTimeNum); // 时间戳转字符串
      let endTimeStr = this.timestampToTime(this.endTimeNum);
      this.weekTime = startTimeStr + " - " + endTimeStr; // 选择的范围
      // console.log(this.weekTime); // 2021-11-15   -  2021-11-21

      // console.log(this.timestampToTime(this.startTimeNum));
      // console.log(this.seletWeekValue);
    },
    reloadHeight() {
      var domheight = this.$refs.form.$el.offsetHeight;
      this.height =
        window.document.documentElement.clientHeight - 40 - 50 - domheight;
    },
    initDate() {
      var date = new Date();
      var firstDay = getMonthFirstDay(date);
      var lastDay = getMonthLastDay(date);
      this.form.date = [firstDay, lastDay];
    },
    search() {
      getWeeklyWorkLogListAll({
        begDate: this.timestampToTime(this.startTimeNum),
        endDate: this.timestampToTime(this.endTimeNum),
      }).then((response) => {
        var obj = JSON.parse(response.data);
        this.WeeklyData = obj.WeeklyData;
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.table.doLayout();
          }, 100);
        });
      });
    },
    dataFormatter(row, column, cellValue, index) {
      var data = JSON.parse(cellValue);
      var contents=data.JobContent?.split("\n");
      var res= null;
      if(contents!=null){   
       res = <div> {contents.map(item=> { return <div> {item}<br/></div>}) }</div>   
      }  
       return  res;
    },
    dateFmatter(row, column, cellValue, index) {
      return formatDate(new Date(cellValue));
    },
    onSubmit() { 
      this.search();
      this.WeeklyProjects.WeeklyProjectDatas;
    },
    exportExcel() {  
         outPutExcel(
     {  begDate: this.timestampToTime(this.startTimeNum),
       endDate: this.timestampToTime(this.endTimeNum)}
      ).then((respone)=>{   
        const elt = document.createElement('a');
        elt.setAttribute('href', respone.data);  
        elt.click(); 
      })

      // this.fixed = false;
      // this.$nextTick(() => { 
      //   let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"),{raw:true});  
      //   var wchs = [ 
      //    { wch: 10 },
      //    { wch: 10 },
      //    { wch: 10 }, 
      //    { wch: 10 } 
      //   ] ;    
      //   this.WeeklyProjects.WeeklyProjectDatas.forEach(element => {
      //     wchs.push({wch:40});
      //   }); 
      //   wb.Sheets.Sheet1['!cols']  = wchs;   
      //   for (let cellIndex  in wb.Sheets.Sheet1) {
      //     if(cellIndex.indexOf('!')!==0){
      //          console.log( wb.Sheets.Sheet1[cellIndex]);
      //         wb.Sheets.Sheet1[cellIndex]['s'] = {
      //           font:{
      //             sz:20,
      //             bold:true
      //           },
      //           alignment:{wrapText:true} 
      //         };
      //     } 
      //   }  

      //   let wbout = XLSX.write(wb, {
      //     bookType: "xlsx",
      //     bookSST: true,
      //     type: "array",
      //   });
      //   try {
      //     FileSaver.saveAs(
      //       new Blob([wbout], { type: "application/octet-stream" }),
      //       "周报.xlsx"
      //     );
      //   } catch (e) {
      //     if (typeof console !== "undefined") console.log(e, wbout);
      //   } finally {
      //     this.fixed = "left";
      //   }
      // }); 
    },
  },
};
</script> 
<style>
.el-table .cell {
  white-space: pre-line;
}
</style>
