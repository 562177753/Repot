$(document).ready(function () {
    ReportPreviewMain.init();

});
var pageflag = false;
var searchtext = "";
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
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        getReportByPage: {
            url: PreviewCommon.baseUrl + "getReportByPage"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            $("#search").click(function () {
                pageflag = true;
                $('.pagination').jqPagination("destroy");
                searchtext = $("#search_input").val();
                PreviewMainMVC.Controller.getReportByPage(PreviewMainMVC.URLs.getReportByPage.url, searchtext, 0);
            });
            $("#addreport").click(function(){
                window.location.href='add_report.html';
            });
        },
        bindEvent: function () {

        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            searchtext = "";
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            PreviewMainMVC.Controller.getReportByPage(PreviewMainMVC.URLs.getReportByPage.url, "", 0);
        }
    },
    Controller: {
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
        getReportByPage: function (url, text, page) {
            $.ax(
                url,
                {
                    serchname: text,
                    page: page,
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    $("#body_table tr").remove();
                    if (data.code == 1) {
                        var reportList = data.reportList;
                        var reportListstr = "";
                        for (var i = 0; i < reportList.length; i++) {
                            reportListstr += "<tr>" +
                                "<td class='id'>" + reportList[i].id + "</td>" +
                                "<td>" + reportList[i].name + "</td>" +
                                "<td>" + reportList[i].datasources[0].name + "</td>" +
                                "<td>" + reportList[i].createUser + "</td>" +
                                "<td>" + reportList[i].comment + "</td>" +
                                "<td>" + PreviewMainMVC.Controller.fomattime(reportList[i].gmtCreated) + "</td>" +
                                "<td>" + PreviewMainMVC.Controller.fomattime(reportList[i].gmtModified) + "</td>" +
                                "<td><button class='btn btn-danger btn-sm write' style='border-radius: 3px!important;background: #7385C1;padding-left: 3px;padding-right: 3px'> 修改用户</button><button class='btn btn-danger btn-sm delectuser' style='border-radius: 3px!important;margin-left: 3px;background: #C56B77;padding-left: 3px;padding-right: 3px'> 删除用户</button></td> " +
                                "</tr>";
                        }
                        $("#body_table").append(reportListstr);
                        var pagecount = data.count;
                        if (!pageflag) {
                            pageflag = true;
                            PreviewMainMVC.Controller.creartPage(page + 1, Math.ceil(pagecount / 25));
                        }
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        fomattime: function (date) {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(date);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + PreviewMainMVC.Controller.add(m) + '-' + PreviewMainMVC.Controller.add(d) + ' ' + PreviewMainMVC.Controller.add(h) + ':' + PreviewMainMVC.Controller.add(mm) + ':' + PreviewMainMVC.Controller.add(s);
        },
        add: function (m) {
            return m < 10 ? '0' + m : m
        },
        creartPage: function (beforpage, countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string: '{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function (page) {
                    PreviewMainMVC.Controller.getReportByPage(PreviewMainMVC.URLs.getReportByPage.url, searchtext, page - 1);
                }
            });
        }
    }
};