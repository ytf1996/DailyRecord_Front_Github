 
/**
* 日期格式化
*/
  export function formatDate(date) {    
    // console.log(date);
    var y = date.getFullYear();
    // console.log(y);
    var m = String(date.getMonth() + 1);
    m = m.length < 2 ? "0" + m : m;
    var d = String(date.getDate());
    d = d.length <2 ? "0" + d : d;
    return y + "-" + m + "-" + d;
} 
/**
     * 时间格式调整
     */ 
 export function onlyShowTime(row){ 
   if(row!= null)
   {  
      let [date, time] = row.split("T"); 
      return time;
   } 
}

export function getMonthFirstDay(date){  
    var nowYear = date.getFullYear() //当前年
    var nowMonth = date.getMonth() //当前月 （值为0~11）
    var res=new Date(nowYear,nowMonth,1)  // 本月开始时间 ;   
   return  res;
} 
export function getMonthLastDay(date){ 
  var nowYear = date.getFullYear() //当前年
  var nowMonth = date.getMonth() //当前月 （值为0~11） 
 var res =  new Date(nowYear, nowMonth+1,0); 
  return res; // 本月结束时间
}

 