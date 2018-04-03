$(document).ready(function () {
    ReportPreviewMain.init();

});
//地址栏参数
var uid = "";
var jsondata = {};
var columnsdate = "";
var fixconutdate = "";
var types;
var ReportPreviewMain = {
    init: function () {
        PreviewMainMVC.View.initControl();
        PreviewMainMVC.View.bindEvent();
        PreviewMainMVC.View.bindValidate();
        PreviewMainMVC.View.initData();
    }
};
var slelectdate = {};
var PreviewCommon = {
    baseUrl: config.BaseUrl
};
var titlelistone = "";
var resertdate = {};
var percentstr = [];
var name = "";
var date=[];
var ArrNum=[];
var average=[];
var pageflag = false;
var loadtableflag = false;

var PreviewMainMVC = {
    URLs: {
        //广告商接口
        loadPrams: {
            url: PreviewCommon.baseUrl + "getReportByUid"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        //折线图接口
        getReportWatcher: {
            url: PreviewCommon.baseUrl + "getReportWatcher"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            //生成表
            $("#cereat_table").click(function () {
                /*$(".load").css("display","block");*/
                PreviewMainMVC.Controller.loadChart(PreviewMainMVC.URLs.getReportWatcher.url, uid);



            });
            $("#load_table").click(function () {
                window.location.href = encodeURI(PreviewMainMVC.URLs.loadexcel.url + "?json=" + JSON.stringify(jsondata) + "&uid=" + uid + "&username=" + usershow("account") + "&type=" + PreviewMainMVC.Controller.GetQueryString("type") + "&reginon=" + usershow("reginon"));
                /* PreviewMainMVC.Controller.loadExcel(PreviewMainMVC.URLs.loadexcel.url, uid);*/
            });
            //重置
            $("#resert_table").click(function () {
                PreviewMainMVC.Controller.resertParms();

            });
            //点击收回 下拉
            $("#loaddown").click(function () {
                var A = $(".widget");
                var x = A.children(".widget-content");
                var z = A.children(".widget-chart");
                var y = A.children(".divider");
                if (A.hasClass("widget-closed")) {
                    $(".widget").css("display", "block");
                    $(this).children("i").removeClass("icon-angle-up").addClass("icon-angle-down");
                    x.slideDown(200, function () {
                        A.removeClass("widget-closed")
                    });
                    z.slideDown(200);
                    y.slideDown(200);

                } else {
                    $(".widget").css("display", "none");
                    $(this).children("i").removeClass("icon-angle-down").addClass("icon-angle-up");
                    x.slideUp(200, function () {
                        A.addClass("widget-closed")
                    });
                    z.slideUp(200);
                    y.slideUp(200)
                }
            });

            // 点击报表维度按钮
            $(".click button").click(function () {
                $(".click").children("button").css("background", "#F5F6FA");
                $(".click").children("button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                name = this.id
            });


        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        //初始化
        initData: function () {
            $('#username').text(usershow("name"));
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            uid = PreviewMainMVC.Controller.GetQueryString("uid");
            name="cpc";
            $("#cpc").css("background", "#0C2D5C");
            $("#cpc").css("color", "#ffffff");
            types = PreviewMainMVC.Controller.GetQueryString("type");
            if (types == 9 || types == "9") {
                $("#endTimediv").css("display", "none");
            }
            $('#down_' + types).addClass("current open");

            /* $('#down_'+type).children("a").text(decodeURI(name));*/
            //初始化调用getReportByUid 接口
            PreviewMainMVC.Controller.loadParms(PreviewMainMVC.URLs.loadPrams.url, uid);
        }
    },
    Controller: {
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        //加载广告商
        loadParms: function (url, uid) {
            $(".load").css("display", "block");
            $.ax(
                url,
                {
                    uid: uid,
                    username: usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    if (data.code == 1) {
                        var titleList = data.titleList;

                        // console.log(data);
                        //先赋值时间
                        var date = getNowFormatDate();
                        jsondata["startTime"] = date[1];
                        jsondata["endTime"] = date[0];

                        $("#startTime").val(date[1]);
                        $("#endTime").val(date[0]);
                        //-----------------------------------------select下拉框-----------------------------------------------------------------------------

                        //判断是否需要开始时间和结束时间
                        if (!data.data) {
                            $(".data").css("display", "none");
                        } else {
                            $(".data").css("display", "block");

                        }
                        //为了重置功能赋值全局变量
                        titlelistone = titleList;
                        for (var i = 0; i < titleList.length; i++) {
                            var sql = "";
                            var flag = false;
                            var titleleve = titleList[i];
                            var text = titleleve.text;
                            var names = titleleve.name;
                            var defaultText = titleleve.defaultText;
                            var defaultValue = titleleve.defaultValue;
                            var arraytitle = titleleve.arraytitle;
                            var formElement = titleleve.formElement;

                            resertdate[names] = defaultValue + "," + defaultText;
                            if (formElement == "text") {
                                sql = sql + '<div class="delect">' +
                                    '<ul class="select-ul">' +
                                    '<div class="select_title margin-top-10 margin-left-13">' + text +
                                    '</div>' +
                                    '<input id="' + names + '" value="' + defaultValue + '>' +
                                    '</ul>' +
                                    '</div>';
                                jsondata[names] = defaultValue;
                                $("#select").append(sql);
                            } else if (formElement == "button") {
                                /*   sql=sql+'<div style="float: left;margin-left: 5px"><a href="' + defaultValue + '" style="display: inline-block;color:#0C2D5C;background: #F5F6FA;padding:3px 20px;border-radius: 5px;font-size: 15px;border: 1px solid #666666">'+text+'</a></div>';
                                 $("#button").append(sql);*/
                            } else {
                                /* sql = sql+"<div  class='delect'>" +
                                 "<ul class='select-ul' id='"+names+"_ul"+"'>" +
                                 "<input type='hidden' id='"+names+"' value='"+defaultValue+"'>" +
                                 "<div class='select_title margin-top-10 margin-left-13'>" + text + ":</div>";*/
                                sql = sql + '<div style="margin-top: 15px">';
                                if (i == 0) {
                                    sql = sql + '<div class="select_title" style="margin-left: -50px">' + text + ':</div>';
                                } else {
                                    sql = sql + '<div class="select_title" style="margin-left: 30px">' + text + ':</div>';
                                }

                                sql = sql + '<div class="time-content">' +
                                    '<div class="form-group">' +
                                    '<div class="input-group date" > ';
                                sql = sql + '<p style="display: none" id="' + names + '">' + defaultValue + '</p><input id="' + names + "_input" + '" type="text" class="form-control inputde" value="' + defaultText + '"/>' +
                                    ' <span class="input-group-addon ' + names + '-ul' + '" style=""> ' +
                                    '<div class="icon-triangle"></div> </span> </div> ' +
                                    '<ul class="select_ul" id="' + names + '_ul' + '" style="z-index: 10000;position: relative">';
                                jsondata[names] = defaultValue;
                                for (var j = 0; j < arraytitle.length; j++) {
                                    if (defaultText == arraytitle[j].name) {
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    sql = sql + '<li><span style="display: none">' + defaultValue + '</span><a href="javascript:;">' + defaultText + '</a></li>'
                                }
                                /* $("#"+names).val(defaultValue);*/
                                for (var j = 0; j < arraytitle.length; j++) {
                                    sql = sql + '<li><span style="display: none">' + arraytitle[j].name + '</span><a href="javascript:;">' + arraytitle[j].text + '</a></li>'
                                    /*if (defaultText == arraytitle[j].name) {
                                     /!*sql = sql + "<li><span style='display: none'>"+arraytitle[j].name+"</span><a class='active'>"+ arraytitle[j].text+"</a></li>";*!/
                                     }else {
                                     /!*  sql = sql + "<li><span style='display: none'>"+arraytitle[j].name+"</span><a>"+ arraytitle[j].text+"</a></li>";*!/
                                     }*/
                                }
                                sql = sql + "</ul> </div> </div> </div></div>";
                                $("#select").append(sql);
                                $("#" + names + "_input").on('focus', function () {
                                    $(this).parent().parent().find("ul").css("display", "block");
                                });
                                $("#" + names + "_input").on('blur', function () {
                                    var ul = $(this).parent().parent().find("ul");
                                    setTimeout(function () {
                                        ul.css("display", "none");
                                    }, 200)

                                });
                                $("#" + names + '_ul li').on('click', function () {
                                    var input = $(this).parent().parent().find("input");
                                    input.val($(this).find("a").text());
                                    var p = $(this).parent().parent().find("p");
                                    p.text($(this).find("span").text());
                                    var ul = $(this).parent().parent().find("ul");
                                    ul.css("display", "none");
                                    /*input[1].attr("value",());
                                     input[0].attr("value",($(this).find("span").text()));*/
                                });
                                $('.' + names + "-ul").on("click", function () {
                                    var select_ul = $(this).parent().parent().find("ul");
                                    var input = $(this).parent().find("input");
                                    if (select_ul.css('display') == "block") {
                                        input.blur();
                                    } else {
                                        input.focus();
                                    }

                                });
                                // console.log(jsondata);
                                  /* $('.input-group-addon').on("click",function(){
                                 var input=$(this).parent().find("input");
                                 input.focus();

                                 });*/
                                /* $("#"+names+"_ul li").on('click',function(){
                                 $(this).parent().find("a").removeClass("active");
                                 $(this).find("a").addClass("active");
                                 $(this).parent().find("input").val($(this).find("span").text());
                                 });*/
                            }
                        }

                        //-----------------------------------------header-----------------------------------------------------------------------------
                    } else {

                    }
                    PreviewMainMVC.Controller.loadChart(PreviewMainMVC.URLs.getReportWatcher.url, uid);
                },
                function () {
                    $(".load").css("display", "none");
                    showdiago("网络发生错误");
                }
            );


        },
        //加载chart
        loadChart: function (url, uid) {

            var json={};
            json["startTime"]=$("#startTime").val();
            json["endTime"]=$("#endTime").val();
            json["ad"]=$("#ad").html();
            json["account"]=$("#account").html();
            json["region"]=$("#region").html();

            $.ax(
                url,
                {
                    json: JSON.stringify(json),
                    uid: uid,
                    username: usershow("account"),
                    name: name
                },
                true,
                "Get",
                "json",
                function (result) {


                    if (result.code == 1) {
                        //大盘数据

                        var charavglists=result.charavglist[0];
                            average = new Array();


                        var charlist = result.charlist;
                        date = new Array();//地址
                        ArrNum = new Array()//个数
                        for (var i = 0; i < charlist.length; i++) {
                            // console.log(charlist[i].date);
                            date.push(charlist[i].date);//X轴
                            ArrNum.push(charlist[i].nameavg);//Y轴
                            average.push(charavglists.nameavg);

                        }
                        //调用echarts 方法
                        PreviewMainMVC.Controller.Creatchart();
                        $("#update_time").text("更新时间:" + result.updatetime);
                        // $('.fixed-table-toolbar').remove();

                        $(".load").css("display", "none");
                    } else {
                        $(".load").css("display", "none");
                        showdiago(result.message);
                    }
                },
                function () {
                    $(".load").css("display", "none");
                    loadtableflag = false;
                    showdiago("网络发生错误");
                }
            );

        },
        creattable: function () {
            PreviewMainMVC.Controller.loadChart(PreviewMainMVC.URLs.getReportWatcher.url, uid);

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
                    // console.log(data);
                    var banner = [];
                    var banner1 = [];
                    if (data.code == 1) {
                        var reportlist = data.reportList;
                        for (var i = 0; i < reportlist.length; i++) {
                            $("#down_" + reportlist[i].type).removeClass("displaynone");
                            if ($("#down_" + reportlist[i].type).find("ul").length > 0) {
                                if (reportlist[i].type1 == "0") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a id='" + reportlist[i].uid + "' href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li>");
                                } else if (reportlist[i].type1 == "1") {
                                    /*for (var j = 0; j < banner.length; j++) {
                                     if (reportlist[i].type != banner[j][0] && reportlist[i].type1 != banner[j][1]) {
                                     $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a href='table_top.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                     var type2_arr = [reportlist[i].type, reportlist[i].type1];
                                     banner.push(type2_arr);
                                     }
                                     }*/
                                } else if (reportlist[i].type1 == "2") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a id='" + reportlist[i].uid + "' href='table_three.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                }
                                else if (reportlist[i].type1 == "3") {
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a id='" + reportlist[i].uid + "' href='table_five.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                } else if (reportlist[i].type1 == "4") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<li><a id='" + reportlist[i].uid + "' href='table_four.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
                                }
                            } else {
                                if (reportlist[i].type1 == "0") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a id='" + reportlist[i].uid + "' href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li></ul>");
                                } else if (reportlist[i].type1 == "1") {
                                    /* $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                     var type2_arr = [reportlist[i].type, reportlist[i].type1];
                                     banner.push(type2_arr);
                                     $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a href='table_top.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                     */
                                } else if (reportlist[i].type1 == "2") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a id='" + reportlist[i].uid + "' href='table_three.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }else if (reportlist[i].type1 == "3") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a id='" + reportlist[i].uid + "' href='table_five.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }
                                else if (reportlist[i].type1 == "4") {
                                    $("#down_" + reportlist[i].type + " a").append("<i class='arrow icon-angle-left'></i>");
                                    $("#down_" + reportlist[i].type).append("<ul class='sub-menu'><li><a id='" + reportlist[i].uid + "' href='table_four.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li></ul>");
                                }

                            }
                            $('#down_'+types +" .sub-menu").css("display","block");
                            $("#"+uid).css("color","#0C8569");
                        }
                    } else {
                        showdiago("网络发生错误");
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        resertParms: function () {
            var date = getNowFormatDate();
            jsondata["startTime"] = date[1];
            jsondata["endTime"] = date[0];
            $("#startTime").val(date[1]);
            $("#endTime").val(date[0]);
            for (key in resertdate) {
                var date = resertdate[key].split(",");
                $("#" + key).text(date[0]);
                $("#" + key + "_input").val(date[1]);
            }

        },

        Creatchart: function () {
            var myChart = echarts.init(document.getElementById('charts'));
            if(name=='ctr'){
                name='点击率'
            }else if(name=='rate_click'){
                name='网销'
            }else if(name=='cpi'){
                name='名片成本'
            }else if(name=='cpa'){
                name='机会成本'
            }else if(name=='roi'){
                name='ROI'
            }else if(name=='cpc'){
                name='CPC'
            }
            var option = {
                title: {
                    // top:"20",
                    text: name
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            //鼠标放上颜色
                            backgroundColor: '#c91d0f'
                        }
                    }
                },
                legend: {
                    // top:"25",
                    data: ['360搜索','大盘数据']
                },
                toolbox: {
                    // feature: {
                    //     saveAsImage: {}
                    // }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    // top:'20',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        // data:['周一','周二','周三','周四','周五','周六','周日'],
                        data: date,
                        axisLabel: {
                            rotate: 20 //20度角倾斜显示
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        data:[ArrNum],

                    }

                ],
                series: [
                    {
                        name:'360搜索',
                        type:'line',
                        data:ArrNum,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        itemStyle : {
                            normal : {
                                color:'#3d87e2',  //圈圈的颜色
                                lineStyle:{
                                    type:'solid',
                                    color:'#3d87e2'  //线的颜色
                                }
                            }
                        }

                    },
                    {
                        name:'大盘数据',
                        type:'line',
                        data:average,
                        markPoint: {
                            data: [
                                // {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        itemStyle : {
                            normal : {
                                color:'#fcab1e',  //圈圈的颜色
                                lineStyle:{
                                    type:'dashed',
                                    color:'#fcab1e'  //线的颜色
                                }
                            }
                        }


                    },
                    // {
                    //     name:'大盘数据',
                    //     type:'line',
                    //     width:'200px',
                    //     data:average,
                    //     // markPoint: {
                    //     //     data: [
                    //     //         {type: 'max', name: '最大值'},
                    //     //         {type: 'min', name: '最小值'}
                    //     //     ]
                    //     // }
                    //
                    // }


                ]
            };
            myChart.setOption(option);
        }


    }
};
