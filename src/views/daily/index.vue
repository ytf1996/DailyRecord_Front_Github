<template>
  <div class="app-container" style="height:calc(100vh - 50px)">
    <div class="input">
      <el-form :inline="true" ref="form" :model="form" label-width="80px">
        <el-form-item label="服务单位">
          <el-input
            type="input"
            placeholder="服务单位"
            v-model="form.serviceUnit"
            :disabled="true"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="年月">
          <el-date-picker
            type="month"
            placeholder="年月"
            v-model="form.yearMonth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="服务人员">
          <el-input
            type="input"
            placeholder="服务人员"
            v-model="form.serviceStaff"
            :disabled="true"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="顾问性质">
          <el-input
            type="input"
            placeholder="顾问性质"
            v-model="form.natureOfConsultant"
            :disabled="true"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="正常工时">
          <el-input
            type="input"
            placeholder="正常工时"
            :disabled="true"
            v-model="normalWorkingHours"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="加班工时">
          <el-input
            type="input"
            placeholder="加班工时"
            :disabled="true"
            v-model="overtimeHours"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="合计工时">
          <el-input
            type="input"
            placeholder="合计工时"
            :disabled="true"
            v-model="totalManHours"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="saveInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </div>  
      <el-table :data="list"    :height="height" id="daily_table" :row-class-name="tableRowClassName" >
        <el-table-column prop="dt" label="日期" width="100px" fixed="left"></el-table-column>
        <el-table-column
          prop="whatDayDes"
          label="星期"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="whetherOnBusinessTrip"
          label="是否出差"
          class="input"
          width="80px"
        > 
          <template scope="scope"> 
            <el-select
              v-model="scope.row.whetherOnBusinessTrip"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="travelSite"
          label="差旅地点"
          class="input"
          width="180px"
        >
          <template scope="scope">
            <el-input
              size="small"
              v-model="scope.row.travelSite"
              type="textarea"
              :rows="1"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="jobClassificationInfoId"
          label="工作分类"
          class="input"
          width="140px"
        >
          <template scope="scope"> 
            <el-select
              v-model="scope.row.jobClassificationInfoId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in jobClassifications"
                :key="item.id"
                :label="item.classificationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="jobContent"
          label="工作内容"
          class="input"
          width="460px"
          autosize
        >
          <template scope="scope">
            <el-input
              size="small"
              v-model="scope.row.jobContent"
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="begWorkTimeDesc"
          label="上班时间"
          class="input"
          width="140px"
        >
          <template scope="scope">  
            <el-time-picker
              v-model="scope.row.begWorkTimeDesc"
              size="mini"
              style="width: 93%"
              :picker-options="{
                   selectableRange: '00:00:00 - 23:59:00'
              }"
              format="HH:mm"
              placeholder="选择时间" 
            >
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column
          prop="endWorkTimeDesc"
          label="下班时间"
          class="input"
          width="140px"
        >
          <template scope="scope">
               <el-time-picker
              v-model="scope.row.endWorkTimeDesc"
              size="mini"
              style="width: 93%"
              :picker-options="{
                   selectableRange: '00:00:00 - 23:59:00'
              }"
              format="HH:mm"
              placeholder="选择时间" 
            >
               </el-time-picker>  
          </template>
        </el-table-column>
        <el-table-column
          prop="normalWorkHour"
          label="正常工作小时"
          width="100px"
        >
          <template scope="scope">
            <el-input
              size="small"
              v-model="scope.row.normalWorkHour"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="extraWorkHour"
          label="加班小时"
          class="input"
          width="100px"
        >
          <template scope="scope">
            <el-input
              size="small"
              v-model="scope.row.extraWorkHour"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="xj" label="小计" width="60px"    :formatter="subtotalWorkHourFormatter">
        </el-table-column>
        <el-table-column prop="remark" label="备注"  width="200px">
          <template scope="scope">
            <el-input
              size="small"
              v-model="scope.row.remark"
              type="textarea"
              :rows="5" 
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
      </el-table> 
  </div>
</template> 
<script>
import {
  getDailsWorkLog,
  getDefaultParams,
  getJobClassifications,
  SaveDairyWork,
} from "@/api/daily";
import { formatDate, onlyShowTime } from "@/utils/dateHelper";
import { MessageBox, Message, Row } from "element-ui"; 
import { keepTwoDecimal  } from  "@/utils/NumericalProcessing"
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      height:100,
      list: [], 
      dialogFormVisible: false,
      form: {
        serviceUnit: "",
        yearMonth: null,
        serviceStaff: "",
        natureOfConsultant: "", 
      }, 
      options: [
        { id:0, value: true, label: "是" },
        { id:1 ,value: false, label: "否" },
      ],
      jobClassifications: [],
      formEdit: { title: "" },
      worktime: [null, null],
    };  
  },
   computed: {
      normalWorkingHours: function () {
        var days= 0 ;
        var hours = 0;
        this.list.forEach(element => {    
            hours+=  (element.normalWorkHour-0); 
        }); 
        days =   keepTwoDecimal(hours/8) ;
      return  days ;
    },
    overtimeHours: function(){
        var days= 0 ;
        var hours = 0;
        this.list.forEach(element => {      
            hours+=  (element.extraWorkHour-0); 
        }); 
        days =   keepTwoDecimal(hours/8) ;
      return  days ;

    },
    totalManHours:function(){
        var days= 0 ;
        var hours = 0; 
        this.list.forEach(element => {    
            hours+= (element.normalWorkHour-0) + (element.extraWorkHour-0); 
        }); 
        days = keepTwoDecimal(hours/8) ;
      return  days ;
    } 
   },
  created() { 
    this.initData();
    this.formDefaultValue();
    window.onresize=()=>{
    this.reloadHeight();
    }
},
  mounted() { 
    this.form.yearMonth = new Date();
    this.formDefaultValue();
    this.InitJobClassifications();
    this.$nextTick(()=>{     
    this.reloadHeight();
    }) 
    
  },  
  methods: {  
     tableRowClassName({row, rowIndex}) { 
        if (! (row.normalWorkHour > 0)) {
          return 'warning-row';
        }  
        return '';
      },
    reloadHeight(){
        const domheight = this.$refs.form.$el.offsetHeight;
        this.height=window.document.documentElement.clientHeight -40 -50-domheight;
    }, 
    saveInfo() {  
      var requestData = []; 
      this.list.forEach((element) => { 
        var requestDataItem = {
          Id: element.id,
          WhetherOnBusinessTrip: element.whetherOnBusinessTrip, //是否出差
          TravelSite: element.travelSite, //差旅地点
          JobClassificationInfoId: element.jobClassificationInfoId, //工作分类
          JobContent: element.jobContent, //工作内容
          BegWorkTime: element.begWorkTimeDesc, //上班时间
          EndWorkTime: element.endWorkTimeDesc, //下班时间
          NormalWorkHour: element.normalWorkHour, //正常工作小时
          ExtraWorkHour: element.extraWorkHour, //加班小时
          Remark: element.remark, //备注
        }; 
        requestData.push(requestDataItem);
      });   
      SaveDairyWork({ workDiaryInfoList: requestData }).then((response) => { 
        if (response.result == "success") {
          Message({
            message: response.msg,
            type: "success",
            duration: 5 * 1000,
          });
          this.search();
        }
      });
    },
    InitJobClassifications() {
      getJobClassifications().then((response) => {
        this.jobClassifications = response.data;
      });
    },
    formDefaultValue() { 
      getDefaultParams({name :"daily"}).then((response) => { 
        this.form.serviceUnit = response.data.serviceUnit;
        this.form.serviceStaff = response.data.name;
        this.form.natureOfConsultant = response.data.counselorPropertyDes; 
      });
    },
    initData() {},
    search() { 
      getDailsWorkLog({
        begDate: formatDate(this.form.yearMonth),
        name:"daily"
      }).then((response) => {
        response.data.diaryList.forEach((element) => {
          element.dt = element.dt.split("T")[0]; 
          element.begWorkTimeDesc = element.begWorkTime;
          element.endWorkTimeDesc = element.endWorkTime;
        });

        this.list = response.data.diaryList; 
      });
    },
    onSubmit() {
      this.search();
    },
       subtotalWorkHourFormatter(row, column, cellValue, index) {  
       row.xj = ( row.normalWorkHour-0) + ( row.extraWorkHour -0); 
      return row.xj;
    },

    handleEdit(index, row) {},
  }, 
}; 
</script> 
<style>
  .el-table .warning-row {
    background: oldlace;
  }
</style>
 