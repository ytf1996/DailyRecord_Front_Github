import request from "@/utils/request";


export function getDefaultParams(params) { 
  if (params.name == 'daily') {
    return request({
      url: "/DailyRecord/WorkDiary/QueryCurrentUserInfo",
      method: "get",
      params
    });
  } else if (params.name = 'dailySummary') {
    return request({
      url: "/DailyRecord/WorkDiary/QueryUserInfoById",
      method: "get",
      params,
    });
  }
}

export function getDailsWorkLog(params) {
  if (params.name == 'daily') {
    return request({
      url: "/DailyRecord/WorkDiary/List",
      method: "get",
      params,
    });
  } else if (params.name = 'dailySummary') {
    return request({
      url: "/DailyRecord/WorkDiary/PreviewDiary",
      method: "get",
      params,
    });
  }

}

export function getJobClassifications() {
  return request({
    url: "/DailyRecord/JobClassification/List",
    method: "get",
  });
}

export function SaveDairyWork(data) {
  return request({
    url: "/DailyRecord/WorkDiary/Save",
    method: "post",
    data
  });
}
export function queryDailySummary(data) {
  return request({
    url: "/DailyRecord/WorkDiary/SummaryCount",
    method: "post",
    data
  });
}

export function outPutExcel(data) {
  return request({
    url: "/DailyRecord/WorkDiary/ExportDailyReport_url",
    method: "post",
    data
  }) 
}





