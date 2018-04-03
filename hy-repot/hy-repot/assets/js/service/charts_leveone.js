$(document).ready(function () {
    ReportPreviewMain.init();


});
var ReportPreviewMain = {
    init: function () {
        PreviewMainMVC.View.initControl();
        PreviewMainMVC.View.bindEvent();
        PreviewMainMVC.View.bindValidate();
        PreviewMainMVC.View.initData();
    }
};
var PreviewCommon = {
    baseUrl: config.BaseUrl
};

var PreviewMainMVC = {
    URLs: {
        loadLegion: {
            url: PreviewCommon.baseUrl + "getLegio"
        },
        LegioAll: {
            url: PreviewCommon.baseUrl + "getLegioAll"
        },
        Loadcharts: {
            url: PreviewCommon.baseUrl + "loadChars"
        },uid:{
            uid:"c838e707-6dfe-486e-9e2d-e68cee6d7e8b"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            $("#creat_chart").click(function () {
                $(".load").css("display","block");
                var json= PreviewMainMVC.Controller.creatjson();
                PreviewMainMVC.Controller.loadCharts(PreviewMainMVC.URLs.Loadcharts.url,json,PreviewMainMVC.URLs.uid.uid);

            });
            $("#resert_chart").click(function () {
                PreviewMainMVC.Controller.resertParms();

            });
            $('.charts-level').hover(function(e){
                $(this).stop(false, true).animate({'width':$(this).width()+50},200);
                e.stopPropagation();
            },function(e){
                $(this).stop(false, true).animate({'width':$(this).width()-50},200);
                e.stopPropagation();
            });
            $("#loaddown").click(function () {
                var A = $(".widget");
                var x = A.children(".widget-content");
                var z = A.children(".widget-chart");
                var y = A.children(".divider");
                if (A.hasClass("widget-closed")) {
                    $(".widget").css("display","block");
                    $(this).children("i").removeClass("icon-angle-up").addClass("icon-angle-down");
                    x.slideDown(200, function () {
                        A.removeClass("widget-closed")
                    });
                    z.slideDown(200);
                    y.slideDown(200);


                } else {
                    $(".widget").css("display","none");
                    $(this).children("i").removeClass("icon-angle-down").addClass("icon-angle-up");
                    x.slideUp(200, function () {
                        A.addClass("widget-closed")
                    });
                    z.slideUp(200);
                    y.slideUp(200)
                }
            });
            $('.down-ul').on("click",function(){
                var select_ul=$(this).parent().parent().find("ul");
                var input=$(this).parent().find("input");
                if(select_ul.css('display')=="block"){
                    input.blur();
                }else {
                    input.focus();
                }

            });
        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            var date = getNowFormatDate();
            $("#startTime").val(date[1]);
            $("#endTime").val(date[0]);
            PreviewMainMVC.Controller.loadlegion(PreviewMainMVC.URLs.loadLegion.url,PreviewMainMVC.URLs.uid.uid);
            PreviewMainMVC.Controller.loadLegioAll(PreviewMainMVC.URLs.LegioAll.url,"%",PreviewMainMVC.URLs.uid.uid);
            var json= PreviewMainMVC.Controller.creatjson();
            PreviewMainMVC.Controller.loadCharts(PreviewMainMVC.URLs.Loadcharts.url,json,PreviewMainMVC.URLs.uid.uid);
        }
    },
    Controller: {
        Creatchart: function (data1, data2,data3) {

            var option = {
                title : {
                    text: '',
                    subtext: ''
                },
                tooltip : {
                    show:false,
                    trigger: 'item',
                    formatter: ''
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                legend: {
                    data : ['展现','点击','访问','咨询','订单']
                },
                calculable : true,
                series : [
                    {
                        name:'',
                        type:'funnel',
                        x: '10%',
                        width: '80%',
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1,
                                label: {
                                    textStyle: {
                                        fontSize:15
                                    }
                                    /*formatter: '{b}预期'*/
                                },
                                labelLine: {
                                    show : false
                                }
                            },
                            emphasis: {
                                label: {

                                    position:'inside',
                                    /*formatter: '{b}预期 : {c}%'*/
                                }
                            }
                        },
                        data:data3
                    },
                    {
                        name:'实际',
                        type:'funnel',
                        x: '10%',
                        width: '80%',
                        maxSize: '80%',
                        itemStyle: {
                            normal: {
                                opacity:0,
                                borderColor: '#fff',
                                borderWidth: 0,
                                label: {
                                    position: 'inside',
                                    formatter: '{b}',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            emphasis: {
                                opacity:0,
                                label: {
                                    position:'inside',
                                    formatter: '{b}'
                                }
                            }
                        },
                        data:data2
                    }
                ]
            };
            return option;
        },
        loadlegion: function (url,uid) {
            $(".load").css("display","block");
            $.ax(
                url,
                {
                    uid: uid,
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        var legionlist = data.legionlist;
                        var liststr = "";
                        for (var i = 0; i < legionlist.length; i++) {
                            /*liststr += " <option value='" + legionlist[i].legion_name + "'>" + legionlist[i].legion_name + "</option>";*/
                            liststr+='  <li><span style="display: none">'+legionlist[i].legion_name+'</span><a href="javascript:;">'+legionlist[i].legion_name+'</a></li>';
                        }
                        $("#legion_name_ul").append(liststr);
                        PreviewMainMVC.Controller.loadController("legion_name");
                    }
                },
                function () {
                    $(".load").css("display","none");
                    showdiago("网络发生错误");
                }
            );

        },
        loadLegioAll: function (url, legio,uid) {
            $.ax(
                url,
                {
                    uid: uid,
                    legio_name: legio,
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data)
                    //pm
                    var pm = data.listpm;
                    var pmstr="";
                    $("#pm_ul .delect").remove();
                    for (var key in pm){
                        pmstr+='  <li class="delect"><span  style="display: none">'+ pm[key].pm+'</span><a href="javascript:;">'+ pm[key].pm+'</a></li>';
                    }
                    $("#pm_ul").append(pmstr);
                    PreviewMainMVC.Controller.loadController("pm");
                    //resp_account
                    var resp_account = data.listresp_account;
                    var resp_accountstr="";
                    $("#resp_account_ul .delect").remove();
                    for (var key in resp_account){
                        resp_accountstr+='  <li class="delect"><span  style="display: none">'+ resp_account[key].resp_account+'</span><a href="javascript:;">'+ resp_account[key].resp_account+'</a></li>';
                    }
                    $("#resp_account_ul").append(resp_accountstr);
                    PreviewMainMVC.Controller.loadController("resp_account");
                    //flow_name
                    var flow_name = data.listflow_name;
                    var flow_namestr="";
                    $("#flow_name_ul .delect").remove();
                    for (var key in flow_name){
                        flow_namestr+='  <li class="delect"><span  style="display: none">'+ flow_name[key].flow_name+'</span><a href="javascript:;">'+ flow_name[key].flow_name+'</a></li>';
                    }
                    $("#flow_name_ul").append(flow_namestr);
                    PreviewMainMVC.Controller.loadController("flow_name");

                    //realm
                    var realm = data.listrealm;
                    var realmstr="";
                    $("#realm_ul .delect").remove();
                    for (var key in realm){
                        realmstr+='  <li class="delect"><span  style="display: none">'+ realm[key].realm+'</span><a href="javascript:;">'+ realm[key].realm+'</a></li>';
                    }
                    $("#realm_ul").append(realmstr);
                    PreviewMainMVC.Controller.loadController("realm");

                    //site_name
                    var site_name = data.listsite_name;
                    var site_namestr="";
                    $("#site_name_ul .delect").remove();
                    for (var key in site_name){
                        site_namestr+='  <li class="delect"><span  style="display: none">'+ site_name[key].site_name+'</span><a href="javascript:;">'+ site_name[key].site_name+'</a></li>';
                    }
                    $("#site_name_ul").append(site_namestr);
                    PreviewMainMVC.Controller.loadController("site_name");

                    //province
                    var province = data.listprovince;
                    var provincestr="";
                    $("#province_ul .delect").remove();
                    for (var key in province){
                        provincestr+='  <li class="delect"><span  style="display: none">'+ province[key].province+'</span><a href="javascript:;">'+ province[key].province+'</a></li>';
                    }
                    $("#province_ul").append(provincestr);
                    PreviewMainMVC.Controller.loadController("province");
                    //carrier
                    var carrier = data.listcarrier;
                    var carrierstr="";
                    $("#carrier_ul .delect").remove();
                    for (var key in carrier){
                        carrierstr+='  <li class="delect"><span  style="display: none">'+ carrier[key].carrier+'</span><a href="javascript:;">'+ carrier[key].carrier+'</a></li>';
                    }
                    $("#carrier_ul").append(carrierstr);
                    PreviewMainMVC.Controller.loadController("carrier");

                    //ad
                    var ad = data.listad;
                    var adstr="";
                    $("#ad_ul .delect").remove();
                    for (var key in ad){
                        adstr+='  <li class="delect"><span  style="display: none">'+ ad[key].ad+'</span><a href="javascript:;">'+ ad[key].ad+'</a></li>';
                    }
                    $("#ad_ul").append(adstr);
                    PreviewMainMVC.Controller.loadController("ad");

                    //promotion
                    var promotion = data.listpromotion;
                    var promotionstr="";
                    $("#promotion_ul .delect").remove();
                    for (var key in promotion){
                        promotionstr+='  <li class="delect"><span  style="display: none">'+ promotion[key].promotion+'</span><a href="javascript:;">'+ promotion[key].promotion+'</a></li>';
                    }
                    $("#promotion_ul").append(promotionstr);
                    PreviewMainMVC.Controller.loadController("promotion");
                    //sku
                    var sku = data.listsku;
                    var skustr="";
                    $("#sku_ul .delect").remove();
                    for (var key in sku){
                        skustr+='  <li class="delect"><span  style="display: none">'+ sku[key].sku+'</span><a href="javascript:;">'+ sku[key].sku+'</a></li>';
                    }
                    $("#sku_ul").append(skustr);
                    PreviewMainMVC.Controller.loadController("sku");

                },
                function () {
                    $(".load").css("display","none");
                    showdiago("网络发生错误");
                }
            );
        },
        creatjson:function(){
            var json={};

            json.startTime= $("#startTime").val();
            json.endTime= $("#endTime").val();
            json.legion_name= $("#legion_name").text();
            json.pm= $("#pm").text();
            json.resp_account= $("#resp_account").text();
            json.flow_name= $("#flow_name").text();
            json.site_name= $("#site_name").text();
            json.realm= $("#realm").text();
            json.ad= $("#ad").text();
            json.province= $("#province").text();
            json.carrier= $("#carrier").text();
            json.promotion= $("#promotion").text();
            json.sku= $("#sku").text();
            return json;
        },
        loadCharts:function(url,json,uid){
            $.ax(
                url,
                {
                    uid: uid,
                    json:JSON.stringify(json),
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if(data.code==1){
                        var tablelist=data.tablelist;
                        if(tablelist[0].show_count!=""||tablelist[0].show_count!=null){
                            for(key in tablelist[0]){
                                if(key=="show_count"){
                                    $("#show_on").text("展现数:"+tablelist[0].show_count);
                                }else if(key=="click_count"){
                                    $("#show_tw").text("点击数:"+tablelist[0].click_count);
                                }else if(key=="count_count"){
                                    $("#show_th").text("总名片数:"+tablelist[0].count_count);
                                }else if(key=="opportunity_count"){
                                    $("#show_fo").text("总机会数:"+tablelist[0].opportunity_count);
                                }else if(key=="regist_count"){
                                    $("#show_fi").text("总报名数:"+tablelist[0].regist_count);
                                }
                            }
                            document.getElementById("proportion_on").setAttribute('data-afterData','点击率:'+Math.round(tablelist[0].click_count/tablelist[0].show_count*100)+"%");
                            document.getElementById("proportion_tw").setAttribute('data-afterData','网销率:'+Math.round(tablelist[0].count_count/tablelist[0].click_count*100)+"%");
                            document.getElementById("proportion_th").setAttribute('data-afterData','机会有效率:'+Math.round(tablelist[0].opportunity_count/tablelist[0].count_count*100)+"%");
                            document.getElementById("proportion_fo").setAttribute('data-afterData','转化率:'+Math.round(tablelist[0].regist_count/tablelist[0].opportunity_count*100)+"%");                           $(".load").css("display","none");

                        }else {
                            $(".load").css("display","none");
                            showdiago("查询结果为空");
                        }
                    }else {
                        $(".load").css("display","none");
                        showdiago("查询结果为空");
                    }

                },
                function () {
                    $(".load").css("display","none");
                    showdiago("网络发生错误");
                }
            );
        },
        inserttable: function (url, searchtext) {
            if (usershow("roles") == 4) {
                $("#index").removeClass("displaynone");
                $("#down_7").removeClass("displaynone");
                $("#down_8").removeClass("displaynone");
            }
            ;
            $.ax(
                url,
                {
                    serchname: searchtext,
                    roles: usershow("roles"),
                    username: usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    var banner = [];
                    var banner1 = [];
                    if (data.code == 1) {
                        var reportlist = data.reportList;
                        for (var i = 0; i < reportlist.length; i++) {
                            $("#down_" + reportlist[i].type).removeClass("displaynone");
                            if ($("#down_" + reportlist[i].type).find("ul").length > 0) {
                                if (reportlist[i].type1 == "0") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li>");
                                } else if (reportlist[i].type1 == "1") {
                                    /*for (var j = 0; j < banner.length; j++) {
                                     if (reportlist[i].type != banner[j][0] && reportlist[i].type1 != banner[j][1]) {
                                     $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a href='table_top.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                     var type2_arr = [reportlist[i].type, reportlist[i].type1];
                                     banner.push(type2_arr);
                                     }
                                     }*/
                                } else if (reportlist[i].type1 == "2") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a href='table_three.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                }
                                else if (reportlist[i].type1 == "3") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a href='table_five.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                } else if (reportlist[i].type1 == "4") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<li><a href='table_four.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                }
                            } else {
                                if (reportlist[i].type1 == "0") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li></ul>");
                                } else if (reportlist[i].type1 == "1") {
                                    /* $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                     var type2_arr = [reportlist[i].type, reportlist[i].type1];
                                     banner.push(type2_arr);
                                     $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_top.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                     */
                                } else if (reportlist[i].type1 == "2") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_three.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }else if (reportlist[i].type1 == "3") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_five.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }
                                else if (reportlist[i].type1 == "4") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_four.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }
                            }
                        }

                        console.log(banner)
                    } else {
                        showdiago("网络发生错误");
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        loadController:function(name){
            $("#"+name+"_input").on('focus',function(){
                $(this).parent().parent().find("ul").css("display","block");
                console.log($(this).parent().parent().find("ul"));
            });
            $("#"+name+"_input").on('blur',function(){
                var ul=$(this).parent().parent().find("ul");

                setTimeout(function(){
                  /*  $(".select_ul").css("display","none");*/
                    ul .css("display","none");
                    if(name=="legion_name"){
                        PreviewMainMVC.Controller.loadLegioAll(PreviewMainMVC.URLs.LegioAll.url,$('#legion_name').text(),PreviewMainMVC.URLs.uid.uid);
                    }
                },200)

            });
            $("#"+name+'_ul li').on('click',function(){
                var input=$(this).parent().parent().find("input");
                input.val($(this).find("a").text());
                var p=$(this).parent().parent().find("p");
                p.text($(this).find("span").text());
                var ul=$(this).parent().parent().find("ul");
                ul.css("display","none");
            });

        },
        resertParms:function(){
            var date = getNowFormatDate();
            $("#startTime").val(date[1]);
            $("#endTime").val(date[0]);
            $("#legion_name").text("%");
            $("#legion_name_input").val("全选");
            $("#pm").text("%");
            $("#pm_input").val("全选");
            $("#resp_account").text("%");
            $("#resp_account_input").val("全选");
            $("#flow_name").text("%");
            $("#flow_name_input").val("全选");
            $("#site_name").text("%");
            $("#site_name_input").val("全选");
            $("#realm").text("%");
            $("#realm_input").val("全选");
            $("#ad").text("%");
            $("#ad_input").val("全选");
            $("#province").text("%");
            $("#province_input").val("全选");
            $("#carrier").text("%");
            $("#carrier_input").val("全选");
            $("#promotion").text("%");
            $("#promotion_input").val("全选");
            $("#sku").text("%");
            $("#sku_input").val("全选");

        }
    }
};