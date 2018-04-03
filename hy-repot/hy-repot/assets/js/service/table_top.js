$(document).ready(function () {
    ReportPreviewMain.init();

});
//地址栏参数
var uids = "";
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
var type = 0;
var pageflag = false;
var loadtableflag = false;

var PreviewMainMVC = {
    URLs: {
        loadPrams: {
            url: PreviewCommon.baseUrl + "getReportByParmas"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        LoadReport: {
            url: PreviewCommon.baseUrl + "getReportWuWei"
        },
        loadexcel: {
            url: PreviewCommon.baseUrl + "getWuWeiReportToExcel"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            var picker1 = $('#datetimepicker1').datetimepicker({
                format: 'YYYY-MM-DD',
                locale: moment.locale('zh-cn'),
                //minDate: '2016-7-1'
            });
            var picker2 = $('#datetimepicker2').datetimepicker({
                format: 'YYYY-MM-DD',
                locale: moment.locale('zh-cn')
            });
            //动态设置最小值
            picker1.on('dp.change', function (e) {
                picker2.data('DateTimePicker').minDate(e.date);
                console.log(getNowafter(3,e.date))
              /*  picker2.data('DateTimePicker').maxDate("");*/
                /*if(type==1){
                    //月
                    picker2.data('DateTimePicker').maxDate(getNowafter(36,e.date));
                }else if (type==2){
                    //周
                    picker2.data('DateTimePicker').maxDate(getNowafter(12,e.date));
                }else if(type==3){
                    //日
                    picker2.data('DateTimePicker').maxDate(getNowafter(3,e.date));
                }
*/


            });
            
            //动态设置最大值
            picker2.on('dp.change', function (e) {
                picker1.data('DateTimePicker').maxDate(e.date);
               /* if(type==1){
                    //月
                    picker1.data('DateTimePicker').minDate(getNowBefore(-36,e.date));
                }else if (type==2){
                    //周
                    picker1.data('DateTimePicker').minDate(getNowBefore(-12,e.date));
                }else if(type==3){
                    //日
                    picker1.data('DateTimePicker').minDate(getNowBefore(-3,e.date));
                }*/

            });
            $("#month_button").click(function () {
                uids = "c6184e66-fc7c-47e7-9b98-af1ec72d1bcb";
                $("#date_div button").css("background", "#F5F6FA");
                $("#date_div button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                type = 1;
            });
            $("#week_button").click(function () {
                uids = "6ed6f6a6-12af-477b-86f2-1e3abcc55430";
                $("#date_div button").css("background", "#F5F6FA");
                $("#date_div button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                type = 2
            });
            $("#day_button").click(function () {
                uids = "e45e21a4-f97a-4063-989b-1626b227bd4e";
                $("#date_div button").css("background", "#F5F6FA");
                $("#date_div button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                type = 3;
            });
            $("#type button").click(function () {
                $("#type button").css("background", "#F5F6FA");
                $("#type button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                $(".disable").attr("disabled", true);
                PreviewMainMVC.Controller.resterParmas();
                if ($(this).html() == "呼叫军团") {
                    $("#legion_name_input").removeAttr("disabled");
                    $("#legion_name_input").parent().find(".down-ul").removeAttr("disabled");
                    jsondata["type"] = "呼叫军团";
                } else if ($(this).html() == "流量军团") {
                    $("#liuliang_name_input").removeAttr("disabled");
                    $("#liuliang_name_input").parent().find(".down-ul").removeAttr("disabled");
                    jsondata["type"] = "流量军团";
                } else if ($(this).html() == "分校") {
                    $("#fenxiao_name_input").removeAttr("disabled");
                    $("#fenxiao_name_input").parent().find(".down-ul").removeAttr("disabled");
                    jsondata["type"] = "分校";
                } else if ($(this).html() == "地区") {
                    $("#diqu_name_input").removeAttr("disabled");
                    $("#diqu_name_input").parent().find(".down-ul").removeAttr("disabled");
                    jsondata["type"] = "地区";
                } else if ($(this).html() == "SKU") {
                    $("#sku_name_input").removeAttr("disabled");
                    $("#sku_name_input").parent().find(".down-ul").removeAttr("disabled");
                    jsondata["type"] = "SKU";
                }
            });
            $("#genre button").click(function () {
                $("#genre button").css("background", "#F5F6FA");
                $("#genre button").css("color", "#0C2D5C");
                $(this).css("background", "#0C2D5C");
                $(this).css("color", "#ffffff");
                jsondata["content"] = this.id;

            });
            $('.down-ul').on("click", function () {
                var select_ul = $(this).parent().parent().find("ul");
                var input = $(this).parent().find("input");
                if (select_ul.css('display') == "block") {
                    input.blur();
                } else {
                    input.focus();
                }
            });
            $("#cereat_table").click(function () {
                /*$(".load").css("display","block");*/
                PreviewMainMVC.Controller.creattable();


            });
            $("#load_table").click(function () {
                window.location.href = encodeURI(PreviewMainMVC.URLs.loadexcel.url + "?json=" + JSON.stringify(jsondata) + "&uid=" + uids + "&username=" + usershow("account") + "&type=" + type );
                /*PreviewMainMVC.Controller.loadExcel(PreviewMainMVC.URLs.loadexcel.url, uids);*/
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


        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            var name = PreviewMainMVC.Controller.GetQueryString("name");
            types = PreviewMainMVC.Controller.GetQueryString("type");
            $('#down_' + types).addClass("current open");
            $("#day_button").css("background", "#0C2D5C");
            $("#day_button").css("color", "#ffffff");
            $("#hujiaojuntuan").css("background", "#0C2D5C");
            $("#hujiaojuntuan").css("color", "#ffffff");
            type = 3;
            $("#count_educate_amount").css("background", "#0C2D5C");
            $("#count_educate_amount").css("color", "#ffffff");
            jsondata["content"] = "count_educate_amount";
            jsondata["type"] = "呼叫军团";
            jsondata["name"] = "%";
            $("#legion_name_input").removeAttr("disabled");
            $("#legion_name_input").parent().find(".down-ul").removeAttr("disabled");
            uids = "e45e21a4-f97a-4063-989b-1626b227bd4e";
            PreviewMainMVC.Controller.loadParms(PreviewMainMVC.URLs.loadPrams.url, uids);
        }
    },
    Controller: {
        loadController: function (name) {
            $("#" + name + "_input").on('focus', function () {
                $(this).parent().parent().find("ul").css("display", "block");
            });
            $("#" + name + "_input").on('blur', function () {
                var ul = $(this).parent().parent().find("ul");

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

        },
        resterParmas: function () {
            jsondata["name"]="%";
            $("#legion_name_input").val("全选");
            $("#legion_name").text("%");
            $("#liuliang_name_input").val("全选");
            $("#liuliang_name").text("%");
            $("#diqu_name_input").val("全选");
            $("#diqu_name").text("%");
            $("#fenxiao_name_input").val("全选");
            $("#fenxiao_name").text("%");
            $("#sku_name_input").val("全选");
            $("#sku_name").text("%");

        },
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
                        console.log(data);
                        //先赋值时间
                        var date = getNowFormatDate();
                        jsondata["startTime"] = date[1];
                        jsondata["endTime"] = date[0];
                        $("#startTime").val(date[1]);
                        $("#endTime").val(date[0]);
                        var list1 = data.list1;
                        var list2 = data.list2;
                        var list3 = data.list3;
                        var list4 = data.list4;
                        var list5 = data.list5;
                        var list1str = "";
                        for (key in list1) {
                            list1str += '  <li class="delect"><span  style="display: none">' + list1[key].name + '</span><a href="javascript:;">' + list1[key].name + '</a></li>';
                        }
                        ;
                        $("#legion_name_ul").append(list1str);
                        PreviewMainMVC.Controller.loadController("legion_name");
                        var list2str = "";
                        for (key in list2) {
                            list2str += '  <li class="delect"><span  style="display: none">' + list2[key].name + '</span><a href="javascript:;">' + list2[key].name + '</a></li>';
                        }
                        ;
                        $("#liuliang_name_ul").append(list2str);
                        PreviewMainMVC.Controller.loadController("liuliang_name");
                        var list3str = "";
                        for (key in list3) {
                            list3str += '  <li class="delect"><span  style="display: none">' + list3[key].name + '</span><a href="javascript:;">' + list3[key].name + '</a></li>';
                        }
                        ;
                        $("#diqu_name_ul").append(list3str);
                        PreviewMainMVC.Controller.loadController("diqu_name");
                        var list4str = "";
                        for (key in list4) {
                            list4str += '  <li class="delect"><span  style="display: none">' + list4[key].name + '</span><a href="javascript:;">' + list4[key].name + '</a></li>';
                        }
                        ;
                        $("#fenxiao_name_ul").append(list4str);
                        PreviewMainMVC.Controller.loadController("fenxiao_name");
                        var list5str = "";
                        for (key in list5) {
                            list5str += '  <li class="delect"><span  style="display: none">' + list5[key].name + '</span><a href="javascript:;">' + list5[key].name + '</a></li>';
                        }
                        ;
                        $("#sku_name_ul").append(list5str);
                        PreviewMainMVC.Controller.loadController("sku_name");
                        $(".load").css("display", "none");

                    }
                    PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uids, 1);
                },
                function () {
                    $(".load").css("display", "none");
                    showdiago("网络发生错误");
                }
            );

        },
        loadTable: function (url, uid, page) {
            $.ax(
                url,
                {
                    json: JSON.stringify(jsondata),
                    uid: uid,
                    page: page - 1,
                    type: type,
                    username: usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1&&data.tablelist.length>0) {
                        var heard = data.header;
                        var columns = [];
                        var fixconut = 0;
                        for (var i = 0; i < heard.length; i++) {
                            var char = {};
                            char.field = heard[i].name;
                            char.title = heard[i].text;
                            char.width = heard[i].width;
                            columns.push(char);
                            if (heard[i].type == 1) {
                                fixconut++;
                            }

                        }
                        columnsdate = columns;
                        fixconutdate = fixconut;
                        var datalist = data.tablelist;
                        console.log(datalist);
                        var height = document.documentElement.clientHeight - 130;
                        loadtableflag = true;
                        PreviewMainMVC.Controller.loadtable(datalist, columns, height, fixconut);

                        var count = Math.ceil(data.count / 25);
                        if (datalist.length > 0) {
                            if (!pageflag) {
                                pageflag = true;
                                PreviewMainMVC.Controller.creartPage(page, count);
                            }
                        } else {
                            if (!pageflag) {
                                pageflag = true;
                                PreviewMainMVC.Controller.creartPage(0, 0);
                            }
                        }

                        $("#update_time").text("更新时间:" + data.updatetime);
                        $('.fixed-table-toolbar').remove();

                        $(".load").css("display", "none");
                    } else {
                        $(".load").css("display", "none");
                        showdiago("暂时没有查到数据");
                    }
                },
                function () {
                    $(".load").css("display", "none");
                    loadtableflag = false;
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
                classes: 'table-no-bordered table-hover',
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

            $('#tb_user').bootstrapTable('destroy');
            if (loadtableflag) {
                $('.pagination').jqPagination("destroy");
            }
            jsondata['startTime']=$("#startTime").val();
            jsondata['endTime']=$("#endTime").val();
            pageflag = false;
            PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uids, 1);
        },
        creartPage: function (beforpage, countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string: '{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function (page) {
                    $('#tb_user').bootstrapTable('destroy');
                    PreviewMainMVC.Controller.loadTable(PreviewMainMVC.URLs.LoadReport.url, uids, page);
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
                                    $("#down_" + reportlist[i].type + " .sub-menu").append(" <li><a  href='table_after.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].name + "</a></li>");
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
        resertParms: function () {
            $(".disable").attr("disabled", true);
            $("#date_div button").css("background", "#F5F6FA");
            $("#date_div button").css("color", "#0C2D5C");
            $("#type button").css("background", "#F5F6FA");
            $("#type button").css("color", "#0C2D5C");
            $("#genre button").css("background", "#F5F6FA");
            $("#genre button").css("color", "#0C2D5C");
            var date = getNowFormatDate();
            jsondata["startTime"] = date[1];
            jsondata["endTime"] = date[0];
            $("#startTime").val(date[1]);
            $("#endTime").val(date[0]);
            $("#day_button").css("background", "#0C2D5C");
            $("#day_button").css("color", "#ffffff");
            $("#hujiaojuntuan").css("background", "#0C2D5C");
            $("#hujiaojuntuan").css("color", "#ffffff");
            type = 3;
            $("#count_educate_amount").css("background", "#0C2D5C");
            $("#count_educate_amount").css("color", "#ffffff");
            jsondata["content"] = "count_educate_amount";
            jsondata["type"] = "呼叫军团";
            jsondata["name"] = "%";
            $("#legion_name_input").removeAttr("disabled");
            $("#legion_name_input").parent().find(".down-ul").removeAttr("disabled");

        }

    }
};