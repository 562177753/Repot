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
var titlelistone="";
var resertdate={};
var percentstr=[];
var pageflag=false;
var loadtableflag=false;

var PreviewMainMVC = {
    URLs: {
        loadPrams: {
            url: PreviewCommon.baseUrl + "getReportByUid"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        LoadReport: {
            url: PreviewCommon.baseUrl + "getReportByAll"
        },
        loadexcel: {
            url: PreviewCommon.baseUrl + "getReportToExcel"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            $("#cereat_table").click(function () {
                PreviewMainMVC.Controller.creattable();
            });
            $("#load_table").click(function () {
                window.location.href = encodeURI(PreviewMainMVC.URLs.loadexcel.url + "?json=" + JSON.stringify(jsondata) + "&uid=" + uid+"&username="+usershow("account")+"&type="+PreviewMainMVC.Controller.GetQueryString("type")+"&legion="+usershow("legion"));
            });
            $("#resert_table").click(function () {
                PreviewMainMVC.Controller.resertParms();

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


        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            uid = PreviewMainMVC.Controller.GetQueryString("uid");
            var name=PreviewMainMVC.Controller.GetQueryString("name");
            types=PreviewMainMVC.Controller.GetQueryString("type");
            if(types==9||types=="9"){
                $("#endTimediv").css("display","none");
            }
            $('#down_'+types).addClass("current open");

           /* $('#down_'+type).children("a").text(decodeURI(name));*/
            PreviewMainMVC.Controller.loadParms(PreviewMainMVC.URLs.loadPrams.url, uid);
        }
    },
    Controller: {
        loadExcel: function (url, uid) {
            $.ax(
                url,
                {
                    json: JSON.stringify(jsondata),
                    uid: uid,
                    legion: usershow("legion"),
                    type: PreviewMainMVC.Controller.GetQueryString("type"),
                    username: usershow("account")
                },
                true,
                "Get",
                "JSONP",
                function (data) {

                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        //获取地址栏的参数
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        loadParms: function (url, uid) {
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
                    if (data.code == 1) {
                        var titleList = data.titleList;

                        console.log(data);
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
                        }else {
                            $(".data").css("display", "block");

                        }
                        //为了重置功能赋值全局变量
                        titlelistone=titleList;
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

                            resertdate[names]=defaultValue+","+defaultText;
                            if (formElement == "text") {
                                sql=sql+'<div class="delect">' +
                                    '<ul class="select-ul">' +
                                    '<div class="select_title margin-top-10 margin-left-13">' +text +
                                    '</div>' +
                                    '<input id="'+names+'" value="' + defaultValue + '>' +
                                    '</ul>' +
                                    '</div>';
                                jsondata[names] = defaultValue;
                                $("#select").append(sql);
                            }else if(formElement == "button"){
                             /*   sql=sql+'<div style="float: left;margin-left: 5px"><a href="' + defaultValue + '" style="display: inline-block;color:#0C2D5C;background: #F5F6FA;padding:3px 20px;border-radius: 5px;font-size: 15px;border: 1px solid #666666">'+text+'</a></div>';
                                $("#button").append(sql);*/
                            }else {
                               /* sql = sql+"<div  class='delect'>" +
                                    "<ul class='select-ul' id='"+names+"_ul"+"'>" +
                                    "<input type='hidden' id='"+names+"' value='"+defaultValue+"'>" +
                                    "<div class='select_title margin-top-10 margin-left-13'>" + text + ":</div>";*/
                                sql+=' <div style="margin-top: 10px;float: left"> ' +
                                    '<div class="select_title" style="margin-left: 15px">' + text + '</div>' +
                                    ' <div class="time-content"> ' +
                                    '<div class="form-group"> ' +
                                    '<div class="input-group date"> <p id="' + names + '" style="display: none">' + defaultValue + '</p>' +
                                    '<input id="' + names + '_input" type="text" class="form-control inputde" value="' + defaultText + '"/>' +
                                    '  <span class="input-group-addon down-ul ' +names +"-ul"+ '" style=""> <div class="icon-triangle"></div> </span> </div>' +
                                    ' <ul class="select_ul" id="' + names + '_ul" style="z-index: 10000;position: relative">' ;
                                jsondata[names] = defaultValue;
                                for (var j = 0; j < arraytitle.length; j++) {
                                    if (defaultText == arraytitle[j].name) {
                                        flag = true;
                                    }
                                }
                                if (!flag) {
                                    sql=sql+'<li><span style="display: none">'+defaultValue+'</span><a href="javascript:;">'+defaultText+'</a></li>'
                                }
                                for (var j = 0; j < arraytitle.length; j++) {
                                    sql=sql+'<li><span style="display: none">'+arraytitle[j].name+'</span><a href="javascript:;">'+arraytitle[j].text+'</a></li>'
                                }
                                sql+=" </ul></div></div></div>";
                                $("#select").append(sql);
                               /* PreviewMainMVC.Controller.loadController(names);*/
                                $("#" + names + "_input").on('focus', function () {
                                    $(this).parent().parent().find("ul").css("display", "block");
                                    console.log($(this).parent().parent().find("ul"));
                                });
                                $("#" + names + "_input").on('blur', function () {
                                    var ul = $(this).parent().parent().find("ul");
                                    console.log($(this).parent().parent().find("ul"));
                                    setTimeout(function () {
                                        ul.css("display", "none");
                                    }, 200)

                                });
                                $("#" + names + '_ul li').on('click', function () {
                                    var input = $(this).parent().parent().find("input");
                                    input.val($(this).find("a").text());
                                    var p = $(this).parent().parent().find("p");
                                    p.text($(this).find("span").text());
                                    jsondata["name"] = $(this).find("span").text();
                                    console.log("name="+$(this).find("span").text()+"\n");
                                    var ul = $(this).parent().parent().find("ul");
                                    ul.css("display", "none");
                                });
                                $('.' + names + "-ul").on("click", function () {
                                    var select_ul = $(this).parent().parent().find("ul");
                                    console.log($(this).parent().parent().find("ul"));
                                    var input = $(this).parent().find("input");
                                    if (select_ul.css('display') == "block") {
                                        input.blur();
                                    } else {
                                        input.focus();
                                    }

                                });
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
                        var heard = data.heard;
                        var jsonheader = JSON.parse(heard);
                        var columns = [];
                        var fixconut = 0;
                        for (var i = 0; i < jsonheader.length; i++) {

                            if(jsonheader[i].percent==true){
                                percentstr.push(jsonheader[i].name);
                            }
                            var char = {};
                            char.field = jsonheader[i].name;
                            char.title = jsonheader[i].text;
                            char.width=jsonheader[i].width;
                            columns.push(char);
                            if (jsonheader[i].type == 1) {
                                fixconut++;
                            }

                        }
                        columnsdate = columns;
                        fixconutdate = fixconut;


                        PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uid, columns, fixconut, 1);

                    } else {
                        var heard = data.heard;
                        var jsonheader = JSON.parse(heard);
                        var columns = [];
                        var fixconut = 0;
                        for (var i = 0; i < jsonheader.length; i++) {
                            var char = {};
                            if(jsonheader[i].percent==true){
                                percentstr.push(jsonheader[i].name);
                            }
                            char.field = jsonheader[i].name;
                            char.title = jsonheader[i].text;
                            char.width=jsonheader[i].width;
                           /* if (i == jsonheader.length - 1 || i == 1) {
                                char.width = "220";
                            } else {
                                char.width = "100";
                            }*/

                            columns.push(char);
                            if (jsonheader[i].type == 1) {
                                fixconut++;
                            }

                        }
                        columnsdate = columns;
                        fixconutdate = fixconut;


                        PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uid, columns, fixconut, 1);
                    }
                },
                function () {
                    $(".load").css("display","none");
                    showdiago("网络发生错误");
                }
            );

        },
        loadController: function (name) {
            $("#" + name + "_input").on('focus', function () {
                $(this).parent().parent().find("ul").css("display", "block");
                console.log($(this).parent().parent().find("ul"));
            });
            $("#" + name + "_input").on('blur', function () {
                var ul = $(this).parent().parent().find("ul");
                console.log($(this).parent().parent().find("ul"));
                setTimeout(function () {
                    ul.css("display", "none");
                }, 200)

            });
            $("#" + name + '_ul li').on('click', function () {
                var input = $(this).parent().parent().find("input");
                input.val($(this).find("a").text());
                var p = $(this).parent().parent().find("p");
                p.text($(this).find("span").text());
                jsondata["name"] = $(this).find("span").text();
                console.log("name="+$(this).find("span").text()+"\n");
                var ul = $(this).parent().parent().find("ul");
                ul.css("display", "none");
            });
            $('.' + name + "-ul").on("click", function () {
                var select_ul = $(this).parent().parent().find("ul");
                console.log($(this).parent().parent().find("ul"));
                var input = $(this).parent().find("input");
                if (select_ul.css('display') == "block") {
                    input.blur();
                } else {
                    input.focus();
                }

            });

        },
        loadTable: function (url, uid, columns, fixconut, page) {
            $.ax(
                url,
                {
                    json: JSON.stringify(jsondata),
                    uid: uid,
                    page: page - 1,
                    legion:usershow("legion"),
                    type:PreviewMainMVC.Controller.GetQueryString("type"),
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        var datalist=data.tablelist;
                        for(var i=0;i<datalist.length;i++){
                            for(var j=0;j<percentstr.length;j++){
                                if(datalist[i][percentstr[j]]!=null&&datalist[i][percentstr[j]]!=""){
                                    datalist[i][percentstr[j]]=toPercent(parseFloat(datalist[i][percentstr[j]]))+"";
                                }
                             /*   datalist[i][percentstr[j]]=toPercent[datalist[i][percentstr[j]]];*/
                            }
                        }
                        console.log(datalist);
                        var height = document.documentElement.clientHeight - 130;
                        loadtableflag=true;
                        PreviewMainMVC.Controller.loadtable(datalist, columns, height, fixconut);

                        var count = Math.ceil(data.count / 25);
                        if(datalist.length>0){
                            if(!pageflag){
                                pageflag=true;
                                PreviewMainMVC.Controller.creartPage(page, count);
                            }
                        }else {
                            if(!pageflag){
                                pageflag=true;
                                PreviewMainMVC.Controller.creartPage(0, 0);
                            }
                        }

                        $("#update_time").text("更新时间:"+data.updatetime);
                        $('.fixed-table-toolbar').remove();

                        $(".load").css("display","none");
                    } else {
                        $(".load").css("display","none");
                        showdiago(data.message);
                    }
                },
                function () {
                    $(".load").css("display","none");
                    loadtableflag=false;
                    showdiago("网络发生错误");
                }
            );

        },
        loadtable: function (date, columns, height, fixconut) {
            $('#tb_user').bootstrapTable({
                //直接从本地数据初始化表格
                data: date,
                method: 'get',      //请求方式（*）
                toolbar: '#toolbar',    //工具按钮用哪个容器
                striped: false,      //是否显示行间隔色
                cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: false,     //是否显示分页（*）
                sortable: false,      //是否启用排序
                sortOrder: "asc",     //排序方式
                queryParams: function (params) {
                    return params;
                },         //传递参数（*）
                sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
                pageNumber: 1,      //初始化加载第一页，默认第一页
                pageSize: 25,      //每页的记录行数（*）
                pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
                search: false,      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                classes:'table-no-bordered table-hover',
                showColumns: false,     //是否显示所有的列
                showRefresh: false,     //是否显示刷新按钮
                minimumCountColumns: 2,    //最少允许的列数
                height: height,
                selectItemName: 'parentItem',
                fixedColumns: true,
                fixedNumber: fixconut,
                //注册加载子表的事件。注意下这里的三个参数！
                onExpandRow: function (index, row, $detail) {
                    InitSubTable(index, row, $detail);
                },
                columns: columns,
                onEditableSave: function (field, row, oldValue, $el) {
                    alert("更新保存事件，原始值为" + oldValue);

                }
            });
        },
        creattable: function () {
            for (var k in jsondata) {

                console.log("执行1");

                if($("#" + k).is("input")){
                    jsondata[k] = $("#" + k).val();
                }else {
                    jsondata[k] = $("#" + k).text();
                }

            }
            $('#tb_user').bootstrapTable('destroy');
            if(loadtableflag){
                $('.pagination').jqPagination("destroy");
            }
            pageflag=false;
            PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uid, columnsdate, fixconutdate, 1);
        },
        creartPage: function (beforpage,countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string:'{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function(page) {
                    $('#tb_user').bootstrapTable('destroy');
                    PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uid, columnsdate, fixconutdate, page);
                }
            });
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
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a id='" +reportlist[i].uid +"' href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li>");
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
                        $('#down_'+types +" .sub-menu").css("display","block");
                        $("#"+uid).css("color","#0C8569");
                    } else {
                        showdiago("网络发生错误");
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        resertParms:function(){
            var date = getNowFormatDate();
            jsondata["startTime"] = date[1];
            jsondata["endTime"] = date[0];
            $("#startTime").val(date[1]);
            $("#endTime").val(date[0]);
            for(key in resertdate){
                var date=resertdate[key].split(",");
                $("#"+key).text(date[0]);
                $("#"+key+"_input").val(date[1]);
            }

        }

    }
};