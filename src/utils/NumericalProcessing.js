//四舍五入保留2位小数（若第二位小数为0，则保留一位小数）
export  function keepTwoDecimal(num) { 
    var result = parseFloat(num); 
    result = Math.round(num * 100) / 100; 
    return result;
   }