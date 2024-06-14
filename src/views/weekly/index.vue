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
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="btnAddClick">新增</el-button>
            <el-dialog
                :title="WeeklyProjects.title"
                :visible.sync="dialogFormVisible"
                fullscreen
            >
                <el-form :model="WeeklyProjects">
                    <el-form-item>
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
                        <label class="el-form-item__label">日期</label>
                        <el-input
                            v-model="weekTime"
                            :clearable="true"
                            placeholder="请选择日期"
                            style="width: 250px"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item
                        v-for="item in WeeklyProjects.WeeklyProjectDatas"
                        :key="item.ProjectClassificationInfoId"
                        :label="item.ClassificationName"
                    >
                        <el-input
                            class="textarea"
                            type="textarea"
                            v-model="item.JobContent" 
                        ></el-input>
                    </el-form-item>
                    <el-form-item class="AddFooter">
                        <el-button type="primary" @click="BtnAdd"
                            >确 定</el-button
                        >
                        <el-button @click="dialogFormVisible = false"
                            >取 消</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <el-table :data="WeeklyData" border stripe :height="height" ref="table">
            <el-table-column
                label="日期"
                prop="BegDate"
                :formatter="dateFmatter"
                width="120px"
                fixed
            >
            </el-table-column>
            <el-table-column
                v-for="item in WeeklyProjects.WeeklyProjectDatas"
                :key="item.ProjectClassificationInfoId"
                :prop="item.ProjectClassificationInfoId"
                :label="item.ClassificationName"
                :formatter="dataFormatter"
                width="300px"
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
                        @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    getWeeklyWorkLog,
    AddWeeklyWorkPlan,
    DeleteWeeklyWorkPlan,
    getProjectClassification,
    EditWeeklyWorkPlan,
} from "@/api/weekly";
import {
    formatDate,
    getMonthFirstDay,
    getMonthLastDay,
} from "@/utils/dateHelper";
import {  Message } from "element-ui";
export default {
    filters: {},
    data() {
        return {
            height: 500,
            WeeklyProjects: { 
                title: "",
                WeeklyProjectDatas: [], 
            },
            WeeklyData: [],
            form: {
                date: [null, null],
            }, 
            dialogFormVisible: false,
            formLabelWidth: "120px", 
            seletWeekValue: "",
            weekTime: "",
            startTimeNum: "",
            endTimeNum: ""
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
        getProjectClassification().then((response) => {
            var list = [];
            response.data.forEach((element) => {
                list.push({
                    ClassificationName: element.classificationName,
                    ProjectClassificationInfoId: element.id + "",
                    JobContent :''
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
                window.document.documentElement.clientHeight -
                40 -
                50 -
                domheight;
        },
        initDate() {
            var date = new Date();
            var firstDay = getMonthFirstDay(date);
            var lastDay = getMonthLastDay(date);
            this.form.date = [firstDay, lastDay];
        },
        search() { 
            getWeeklyWorkLog({
                begDate: this.form.date[0],
                endDate: this.form.date[1],
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
        btnAddClick() {
            this.changeweek(new Date());
            this.WeeklyProjects.title = "新增";
            this.WeeklyProjects.WeeklyProjectDatas.forEach(item=> { 
                item.JobContent = "";
            })
            this.dialogFormVisible = true;
        },
        BtnAdd() {  
            if (this.WeeklyProjects.title == "新增") {
                let itemList = [];
                this.WeeklyProjects.WeeklyProjectDatas.forEach((c) =>
                    itemList.push({
                        ProjectClassificationInfoId: c.ProjectClassificationInfoId,
                        JobContent: c.JobContent,
                    })
                );
                AddWeeklyWorkPlan({
                    BegDate: this.timestampToTime(this.startTimeNum),
                    ItemList: itemList,
                }).then((response) => { 
                    if (response.result == "success") {
                        Message({
                            message: response.msg,
                            type: "success",
                            duration: 5 * 1000,
                        });
                        this.dialogFormVisible = false;
                        this.search();
                    }
                });
            } else if ((this.WeeklyProjects.title = "修改")) {
                var editData = [];
                this.WeeklyProjects.WeeklyProjectDatas.forEach((x) =>
                    editData.push({ 
                        BegDate : this.timestampToTime(this.startTimeNum) ,
                        Id: x.Id,
                        JobContent: x.JobContent,
                        ProjectClassificationInfoId:x.ProjectClassificationInfoId,
                    })
                ); 
                EditWeeklyWorkPlan({ pPlanNextWeekInfoList: editData }).then(
                    (response) => {
                        if (response.result == "success") {
                            Message({
                                message: response.msg,
                                type: "success",
                                duration: 5 * 1000,
                            }); 
                            this.dialogFormVisible = false;
                            this.search();
                        }
                    }
                );
            }
        },
        handleEdit(index, row) { 
            this.WeeklyProjects.WeeklyProjectDatas.forEach(item=> {   
                var rowVaue =JSON.parse(row[item.ProjectClassificationInfoId]) ;
                item.JobContent = rowVaue.JobContent 
                item.Id = rowVaue.Id 
            });   
            this.WeeklyProjects.title = "修改";
            this.changeweek(new Date(row.BegDate)); 
            this.dialogFormVisible = true;
        },
        handleDelete(index, row) { 
            var ids = []; 
            this.WeeklyProjects.WeeklyProjectDatas.forEach(element => {
               ids.push(JSON.parse(row[element.ProjectClassificationInfoId]).Id);
            }); 
            this.$confirm("确认删除？").then((_) => {
                DeleteWeeklyWorkPlan({ idList: ids }).then((response) => {
                    if (response.result == "success") {
                        Message({
                            message: response.msg,
                            type: "success",
                            duration: 5 * 1000,
                        });
                        this.search();
                    }
                });
            });
        },
        dataFormatter(row, column, cellValue, index) {
            var data = JSON.parse(cellValue);
            return data.JobContent;
        },
        dateFmatter(row, column, cellValue, index) {
            return formatDate(new Date(cellValue));
        },
        onSubmit() {
            this.search();
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
.textarea {
    width: 80%;
    height: 40px;
}
label {
    width: 120px;
    height: 40px;
}
.el-date-editor {
    width: 50%;
}
.el-table .cell {
    white-space: pre-line;
}
</style>
