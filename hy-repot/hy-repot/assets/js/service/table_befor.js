$(document).ready(function () {
    ReportPreviewMain.init();

});
var date = "";
var searchtext = "";
/*var page = 0;*/
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
        }
    },
    Model: {
        fomattime: function (date) {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(date);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + PreviewMainMVC.Model.add(m) + '-' + PreviewMainMVC.Model.add(d) + ' ' + PreviewMainMVC.Model.add(h) + ':' + PreviewMainMVC.Model.add(mm) + ':' + PreviewMainMVC.Model.add(s);
        },
        add: function (m) {
            return m < 10 ? '0' + m : m
        }
    },
    View: {
        initControl: function () {
            //点击table后的跳转事件
            $('table').on('click', 'td', function () {
                var row = $(this).parent().prevAll().length + 1;
                var uid = date[row - 1].uid;
                console.log(uid);
                $(location).attr('href', 'table_after.html?uid=' + uid);
            });
            $(".btn-search").click(function () {
                searchtext = $("#searchtext").val();
                //如果没有则查询全部
                PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, searchtext,1);
            });
        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        initData: function () {
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, searchtext, 1);

        },
        chooseStatus: function (status) {
            if (status == 1) {
                return "<span class='label label-success'>启用</span>"
            } else {
                return "<span class='label label-danger'>启用</span>"
            }
        }
    },
    Controller: {
        inserttable: function (url, searchtext, pages) {
            $.ax(
                url,
                {
                    serchname: searchtext,
                    page: pages-1,
                    roles:usershow("roles")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    var trlist = "";
                    $("#body_table tr").remove();
                    if (data.code == 1) {
                        var reportlist = data.reportList;
                        //赋值全局变量
                        date = reportlist;
                        for (var i = 0; i < reportlist.length; i++) {
                            trlist += "<tr>" +
                                "<td>" + reportlist[i].id + "</td>" +
                                "<td>" + reportlist[i].name + "</td>" +
                                "<td>" + reportlist[i].datasources[0].name + "</td>" +
                                "<td>" + reportlist[i].createUser + "</td>" +
                                "<td>" + PreviewMainMVC.Model.fomattime(reportlist[i].gmtCreated) + "</td>" +
                                "<td>" + PreviewMainMVC.Model.fomattime(reportlist[i].gmtModified) + "</td>" +
                                "<td>" + reportlist[i].comment + "</td>" +
                                "<td>" + PreviewMainMVC.View.chooseStatus(reportlist[i].status) + "</td> " +
                                "</tr>"
                        }
                        $("#body_table").append(trlist);
                        var count = Math.ceil(data.count / 25);
                        console.log(count)
                        var options = PreviewMainMVC.Controller.creartPage(pages, count);
                        $('#example').bootstrapPaginator(options);

                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        creartPage: function (beforpage, countpage) {
            var options = {
                bootstrapMajorVersion: 3, //版本
                currentPage: beforpage, //当前页数
                totalPages: countpage, //总页数
                itemTexts: function (type, page, current) {
                    switch (type) {
                        case "first":
                            return "首页";
                        case "prev":
                            return "上一页";
                        case "next":
                            return "下一页";
                        case "last":
                            return "末页";
                        case "page":
                            return page;
                    }
                },//点击事件，用于通过Ajax来刷新整个list列表
                onPageClicked: function (event, originalEvent, type, page) {
                    $("#body_table tr").remove();
                    PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, searchtext, page);
                }
            };
            return options;
        }
    }
};