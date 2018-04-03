$(document).ready(function () {
    ReportPreviewMain.init();

});
var pageflag = false;
var delectid = "";
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
        getDateSourceBySearchAndPage: {
            url: PreviewCommon.baseUrl + "getDateSourceBySearchAndPage"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        insertDateSource: {
            url: PreviewCommon.baseUrl + "insertDateSource"
        },
        delectDateSource: {
            url: PreviewCommon.baseUrl + "delectDateSource"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            $("#search").click(function () {
                pageflag = true;
                $('.pagination').jqPagination("destroy");
                searchtext = $("#search_input").val();
                PreviewMainMVC.Controller.getDateSourceBySearchAndPage(PreviewMainMVC.URLs.getDateSourceBySearchAndPage.url, 0, searchtext);
            });
            $("#adddate").click(function () {
                $("#adddatasource-diaglog").modal();
            });
            $('table').on('click', '.delectdata', function () {
                delectid = $(this).parent().parent().find(".id").text();
                $("#delectData-dialog").modal();
            });
            $('#delect_data').click(function () {
                $("#delectData-dialog").modal("hide");
                PreviewMainMVC.Controller.delectDateSource(PreviewMainMVC.URLs.delectDateSource.url, delectid);
            });
            $("#register").click(function () {
                {
                    var flag = false;
                    $("input[class=text]").each(function (i) {
                        var text = $(this).val();
                        if (text == "") {
                            flag = true;
                            return;
                        }
                    });
                    if (flag) {
                        showdiago("不能有空项");
                    } else {
                        var datajson = {};
                        datajson['name'] = $("#name").val();
                        datajson['jdbcUrl'] = $("#jdbcurl").val();
                        datajson['driverClass'] = $("#driverclass").val();
                        datajson['user'] = $("#user").val();
                        datajson['password'] = $("#password").val();
                        datajson['comment'] = $("#comment").val();
                        datajson['username'] = usershow("account");
                        PreviewMainMVC.Controller.insertDateSource(PreviewMainMVC.URLs.insertDateSource.url, datajson);
                    }

                }
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
            PreviewMainMVC.Controller.getDateSourceBySearchAndPage(PreviewMainMVC.URLs.getDateSourceBySearchAndPage.url, 0, "");
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
        getDateSourceBySearchAndPage: function (url, page, searchtext) {
            $.ax(
                url,
                {
                    serchname: searchtext,
                    page: page,
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        var datasourceliststr = "";
                        var datasourcelist = data.datasourcelist;
                        $("#body_table tr").remove();
                        for (var i = 0; i < datasourcelist.length; i++) {
                            datasourceliststr += "<tr>" +
                                "<td class='id'>" + datasourcelist[i].id + "</td>" +
                                "<td>" + datasourcelist[i].name + "</td>" +
                                "<td>" + datasourcelist[i].jdbcUrl + "</td>" +
                                "<td>" + datasourcelist[i].driverClass + "</td>" +
                                "<td>" + datasourcelist[i].comment + "</td>" +
                                "<td>" + PreviewMainMVC.Controller.fomattime(datasourcelist[i].gmtModified) + "</td>" +
                                "<td><button class='btn btn-danger btn-sm delectdata' style='border-radius: 3px!important;background: #C56B77;padding-left: 3px;padding-right: 3px'> 删除数据源</button></td> " +
                                "</tr>";
                        }
                        $("#body_table").append(datasourceliststr);
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
        /*没做标志*/
        insertDateSource: function (url, json) {
            $.ax(
                url,
                json,
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        $("#adddatasource-diaglog").modal("hide");
                        pageflag = true;
                        $('.pagination').jqPagination("destroy");
                        PreviewMainMVC.Controller.getDateSourceBySearchAndPage(PreviewMainMVC.URLs.getDateSourceBySearchAndPage.url, 0, "");
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );
        },
        delectDateSource: function (url, id) {
            $.ax(
                url,
                {id: id, username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        pageflag = true;
                        $('.pagination').jqPagination("destroy");
                        PreviewMainMVC.Controller.getDateSourceBySearchAndPage(PreviewMainMVC.URLs.getDateSourceBySearchAndPage.url, 0, "");
                        showdiago(data.message);
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
                    PreviewMainMVC.Controller.getDateSourceBySearchAndPage(PreviewMainMVC.URLs.getDateSourceBySearchAndPage.url, page - 1, searchtext);
                }
            });
        }
    }
};