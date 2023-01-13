import {
  request,
  uploadFile
} from "./request";
class API {
  // 获取openid
  getOpenId = (params) => request("/login/getWxUserInfo", "get",false, params);
  // 获取验证码
  getSms = (params) => request("/login/sms", "get",false, params);
  // 校验验证码
  checkCode = (params) => request("/login/checkCode", "post",false, params);
  // 登陆
  getLogin = (params) => request("/register", "post",false, params);
  // 上传头像
  changeAvatar = (params) => request("/patientInfo/changeAvatar", "post",false, params);
  // 获取用户信息
  findByPhone = (params) => request("/patientInfo/findByPhone", "get",false, params);
  // 个人信息保存
  putInfo = (params) => request("/patientInfo", "put",false, params);
  //协议
  getAgreement = (params) => request("/login/protocol", "get",false, params);
  // 退出登陆
  logout = (params) => request("/login/logout", "get",false, params);
  // 获取问题
  getQuestionnaire = (params) => request("/questionnaire/questionByPosition", "get",false, params);
  // 获取康复中心
  getArea = (params) => request("/hospitalInfo/listByArea", "get",false, params);
  // 体检报告列表
  getAreaList = (params) => request("/examReport/listByPhone", "get",false, params);
  // 体检报告详情
  getAreaDetail = (params) => request("/examReport/detail", "get",false, params);
  // 体检报告导出
  getAreaEXP = (params) => request("/examReport/export", "get",false, params);
  // 问卷列表
  recordList = (params) => request("/questionnaireReplyRecord/getByPhone", "get",false, params);
  // 问卷新增
  recordAdd = (params) => request("/questionnaireReplyRecord", "post",false, params);
  // 问卷详情
  recordDetail = (params) => request("/questionnaireReplyRecord/getById", "get",false, params);
  // 获取问卷部分状态
  getStatus = (params) => request("/questionnaireReplyRecord/infoForSelectPage", "get",false, params);











  // 获取患者信息
  getPatientInfo = (params) =>
    request("/patient/patient_info/info", "post", true, params);
    // 创建患者
    createPatient= (params) =>
    request("/patient/patient_info/create", "post", true, params);
  // 更新患者信息
  updatePatientInfo = (params) =>
    request("/patient/patient_info/update", "post", true, params);
          // 添加问卷信息
  createQuestionnaire = (params) =>
  request("/patient/questionnaire_info/create", "post", true, params);
      // 更新问卷信息
  updateQuestionnaire = (params) =>
  request("/patient/questionnaire_info/update", "post", true, params);
   // 创建试剂盒
   createTestKit = (params) =>
   request("/patient/reagent_info/create", "post", true, params);
     // 获取试剂盒信息
     getReportInfo = (params) =>
     request("/patient/reagent_info/info", "post", true, params);
  // 更新报告信息
  updateReport = (params) =>
    request("/patient/reagent_info/update", "post", true, params);
  // 获取医院列表
  getHospitalList = (params) =>
    request("/hospital/hospital_info/list", "post", false, params);
  // 获取医院信息
  getHospitalInfo = (params) =>
    request("/hospital/hospital_info/info", "post", false, params);
  // 获取订单信息
  getOrderInfo = (params) =>
    request("/patient/check_orders/info", "post", true, params);
  // 获取当天订单余量
  getOrderQuota = (params) =>
    request("/patient/check_orders/info", "post", false, params);
  // 创建订单
  createOrder = (params) =>
    request("/patient/check_orders/create", "post", true, params);
  // 更新订单信息
  updateOrder = (params) =>
    request("/patient/check_orders/update", "post", true, params);
      // 上传图片
  uploadFile = (params) =>
  uploadFile("/common/upload_file/create", "post", params);
}
const api = new API();
export default api;