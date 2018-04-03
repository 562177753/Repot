var config={
     /*BaseUrl:"http://10.76.1.220:8080/SSM-Test2/"*/
    BaseUrl:"http://localhost:8889/SSM-Test2/"
  /* BaseUrl:"http://192.168.1.85:9090/SSM-Test2/"*/
};
//显示提示框
var showdiago=function(text){
    $("#myModalLabel").text(text);
    $('#myModal').modal();
};
//显示提示框
var showdiagoto=function(text){
    $('#myModalto').modal();
};
//获取已登录用户的信息
var usershow=function(name){
    var userobj= JSON.parse(localStorage.getItem("user"));
    return userobj[name];
}
//获取当前系统时间
var getNowFormatDate=function() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    var currentdatebefor=date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return [currentdate,currentdatebefor];
};
//获取当前时间前n天的时间
var getNowBefore=function(n){
    var now = new Date();
    var date = new Date(now.getTime() - n * 24 * 3600 * 1000);
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//获取当前时间后n天的时间
var getNowafter=function(n,date){
    var d = new Date(date);
    // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
    d.setMonth((d.getMonth()) + n);
    var yy1 = d.getFullYear();
    var mm1 = d.getMonth()+1;
    var dd1 = d.getDate();
    if (mm1 < 10 ) {
        mm1 = '0' + mm1;
    }
    if (dd1 < 10) {
        dd1 = '0' + dd1;
    }
    return yy1 + '-' + mm1 + '-' + dd1;
}
//验证手机号
var phonetext=function(phone){
    var length = phone.length;
    if(length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(phone) )
    {
        return true;
    }else{
        return false;
    }
};
//验证邮箱
var emailtext=function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
        return true;
    else
        return false;
};
//阻止事件冒泡
function contains(parent, node) {
    if(parent.compareDocumentPosition){ //ff
        var _flag = parent.compareDocumentPosition(node);
        return (_flag == 20 || _flag == 0)? true : false;
    }else if(parent.contains){ //ie
        return parent.contains(node);
    }
};
//小数化成百分数
var toPercent=function (point){
    var str=Number(point*100).toFixed(1);
    str+="%";
    return str;
};
