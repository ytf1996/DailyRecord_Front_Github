import request from "@/utils/request";

export function getWeeklyWorkLog(params) {
  return request({
    url: "/DailyRecord/PlanNextWeek/List",
    method: "get",
    params,
  });
}
export function getWeeklyWorkLogListAll(params){
  return request({
    url: "/DailyRecord/PlanNextWeek/ListAll",
    method: "get",
    params,
  });
}
export function AddWeeklyWorkPlan(data) { 
  return request({
    url: "/DailyRecord/PlanNextWeek/Add",
    method: "post",
    data,
  });
}


export function getProjectClassification() {
  return request({
    url: "/DailyRecord/ProjectClassification/List",
    method: "get",
  });
}

export function EditWeeklyWorkPlan(data) {   
  return request({
    url: "/DailyRecord/PlanNextWeek/Edit",
    method: "post",
    data,
  });
}
export function DeleteWeeklyWorkPlan(data) {   
  return request({
    url: "/DailyRecord/PlanNextWeek/Delete",
    method: "delete",
    data,
  });
}

export  function get_List_ShowAll_ForAdministrator(params)
{
  return request({
    url: "/DailyRecord/PlanNextWeek/List_ShowAll_ForAdministrator",
    method: "get",
    params,
  });
}


export function outPutExcel(data) { 
  return request({
    url: "/DailyRecord/PlanNextWeek/WeekReportListExport_url",
    method: "post",
    data
  }) 
}


