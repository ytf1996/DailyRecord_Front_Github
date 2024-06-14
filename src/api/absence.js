import request from "@/utils/request";

export function GetAbsenceInfo(params) {
    return request({
        url: "/DailyRecord/Absence/List",
        method: "get",
        params
    });
}

export function GetAbsenceInfoAll(params) { 
    return request({
        url: "/DailyRecord/Absence/List_ShowAll_ForAdministrator",
        method: "get",
        params
    });
}
 
export function AbsenceAdd(data) {
    return request({
        url: "/DailyRecord/Absence/Add",
        method: "post",
        data
    })
}

export function AbsenceModify(params) {
    return request({
        url: "/DailyRecord/Absence/Edit",
        method: "post",
        params
    })
}

export function AbsenceRemove(params) {
    return request({
        url: "/DailyRecord/Absence/Delete",
        method: "delete",
        params
    })
}

export function AbsenceReply(params) {
    return request({
        url: "/DailyRecord/Absence/Reply",
        method: "post",
        params
    })
}