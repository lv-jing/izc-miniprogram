//'yyyy年MM月dd日hh:mm:ss'
const formatTime = (format, time = Date.now()) => {
  //'yyyy年MM月dd日hh:mm:ss'
  const t = new Date(time);
  const db = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|hh|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return db(t.getFullYear());
        break;
      case 'MM':
        return db(t.getMonth() + 1);
        break;
      case 'dd':
        return db(t.getDate());
        break;
      case 'hh':
        return db(t.getHours());
        break;
      case 'mm':
        return db(t.getMinutes());
        break;
      case 'ss':
        return db(t.getSeconds());
        break;
    }
  });
}
const judegCardId = (idcode) => {
  // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
  // 详情查看javascript的数值范围
  // 加权因子
  var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var code = idcode + "";
  var seventeen = code.substring(0, 17);
  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  var arr = seventeen.split("");
  var len = arr.length;
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }
  var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
  // 判断格式是否正确
  var format = idcard_patter.test(idcode);
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return format ? true : false;
}

module.exports = {
  formatTime,
  judegCardId
}