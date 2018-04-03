$(document).ready(function () {
    ReportPreviewMain.init();

});
var writeid = "";
var delectid="";
var pageflag=false;
var searchtext="";
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
        getRole: {
            url: PreviewCommon.baseUrl + "getRole"
        },
        insertRole: {
            url: PreviewCommon.baseUrl + "insertRole"
        },
        report: {
            url: PreviewCommon.baseUrl + "report"
        },
        updatetComment: {
            url: PreviewCommon.baseUrl + "updatetComment"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        } ,
        delectRole: {
            url: PreviewCommon.baseUrl + "delectRole"
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
            $("#addrole").click(function () {
                $("#addRoles-dialog").modal("show");
            });
            $("#search").click(function(){
                searchtext=$("#search_input").val();
                pageflag=false;
                $('.pagination').jqPagination("destroy");
                PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0,searchtext);
            });
            $("#search_input").keyup(function(evnet){
                if (evnet.keyCode == '13') {
                    searchtext=$("#search_input").val();
                    pageflag=false;
                    $('.pagination').jqPagination("destroy");
                    PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0,searchtext);
                }

            });
            $("#btn_submit").click(function () {
                $("#addRoles-dialog").modal("hide");
                var json = {};
                var id = $("#id").val();
                var name = $("#name").val();
                var englishname = $("#englishname").val();
                var comment = $("#comment").val();
                var txt_statu = 1;
                if (id != "" && name != "" && englishname != "" && comment != "") {
                    json["id"] = parseInt(id);
                    json["name"] = name;
                    json["code"] = englishname;
                    json["comment"] = comment;
                    json["createUser"] = usershow("account");
                    json["status"] = parseInt(txt_statu);
                    PreviewMainMVC.Controller.insertrole(PreviewMainMVC.URLs.insertRole.url, json);
                } else {

                    showdiago("不能有空项");
                }

            });
            $('table').on('click', '.write', function () {
                $("#choose_dialog").modal("show");
                writeid = $(this).parent().parent().find(".id").text();
                PreviewMainMVC.Controller.getreport(PreviewMainMVC.URLs.report.url, writeid + "");
            });
            $('table').on('click', '.delectrole', function () {
                delectid = $(this).parent().parent().find(".id").text();
                $("#delectRole-dialog").modal();
            });
            $('#delect_role').click(function(){
                $("#delectRole-dialog").modal("hide");
                PreviewMainMVC.Controller.delectRole(PreviewMainMVC.URLs.delectRole.url, delectid + "");
            });
            $('table').on('click', '.delect', function () {
                var id = $(this).parent().parent().find(".id").text();
                var json = {};
                json["id"] =parseInt(id);
                json["writeid"] = parseInt(writeid);
                json["type"] = 0;
                PreviewMainMVC.Controller.updatereport(PreviewMainMVC.URLs.updatetComment.url, json);
            });
            $('table').on('click', '.insert', function () {
                var id = $(this).parent().parent().find(".id").text();
                var json = {};
                json["id"] =parseInt(id);
                json["writeid"] = parseInt(writeid);
                json["type"] = 1;
                json["username"] = usershow("account");
                PreviewMainMVC.Controller.updatereport(PreviewMainMVC.URLs.updatetComment.url,json);
            });

        }
        ,
        bindEvent: function () {

        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            searchtext="";
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0,'');
        }
    },
    Controller: {
        getRole: function (url,page,name) {
            $(".load").css("display","block");
            $.ax(
                url,
                {page:page,name:name,
                    username:usershow("account")},
                false,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        var roleList = data.roleList;
                        var content = "";
                        $("#body_table tr").remove();
                        for (var i = 0; i < roleList.length; i++) {
                            content += "<tr>" +
                                "<td class='id'>" + roleList[i].id + "</td>" +
                                "<td>" + roleList[i].name + "</td>" +
                                "<td>" + roleList[i].code + "</td>" +
                                "<td>" + roleList[i].comment + "</td>" +
                                "<td>" + roleList[i].createUser + "</td>" +
                                "<td>" + PreviewMainMVC.Model.fomattime(roleList[i].gmtCreated) + "</td>" +
                                "<td>" + PreviewMainMVC.Model.fomattime(roleList[i].gmtModified) + "</td>" +
                               /* "<td><button class='btn btn-xs btn-success write'>修改权限表</button></td>" +*/
                                "<td><button class='btn btn-danger btn-sm write' style='border-radius: 3px!important;background: #7385C1;padding-left: 3px;padding-right: 3px'> 修改权限</button><button class='btn btn-danger btn-sm delectrole' style='border-radius: 3px!important;margin-left: 3px;background: #C56B77;padding-left: 3px;padding-right: 3px'> 删除用户</button></td> " +
                                +"</tr>"
                        }
                        $("#body_table").append(content);
                        pagecount=data.count;
                        if(!pageflag){

                            pageflag=true;
                            PreviewMainMVC.Controller.creartPage(page+1,Math.ceil(pagecount/25));
                        }

                        $(".load").css("display","none");

                    } else {
                        $(".load").css("display","none");
                        showdiago(data.message);
                    }
                },
                function () {
                    $(".load").css("display","none");
                    showdiago("网络发生错误");
                }
            );
        },
        /*没做*/
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
        getreport: function (url, id) {
            $.ax(
                url,
                {username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        $("#body_delecr tr").remove();
                        $("#body_insert tr").remove();
                        var reportList = data.reportList;
                        for (var i = 0; i < reportList.length; i++) {
                            var flag = false;
                            var comment = reportList[i].comment.split(",");
                            console.log(comment.length);
                            for (var j = 0; j < comment.length; j++) {
                                if (id == comment[j]) {
                                    flag = true;
                                }
                            }
                            if (flag) {
                                var content = " <tr>" +
                                    "<td class='id'>" + reportList[i].id + "</td>" +
                                    "<td>" + reportList[i].name + "</td>" +
                                    "<td><button class='btn btn-xs btn-danger delect' style='border-radius: 3px!important;background: #C56B77;padding-left: 3px;padding-right: 3px'>删除此表权限</button></td>" +
                                    "</tr>";
                                $("#body_delecr").append(content);
                            } else {
                                var content = " <tr>" +
                                    "<td class='id'>" + reportList[i].id + "</td>" +
                                    "<td>" + reportList[i].name + "</td>" +
                                    "<td><button class='btn btn-xs btn-success insert' style='border-radius: 3px!important;background: #7385C1;padding-left: 3px;padding-right: 3px'>添加此表权限</button></td>" +
                                    "</tr>";
                                $("#body_insert").append(content);
                            }
                        }
                    } else {

                    }
                },
                function () {
                    $("#choose_dialog").modal("hide");
                    showdiago("添加失败,请检查网络");
                }
            );
        },
        insertrole: function (url, jsondate) {
            $(".load").css("display","block");
            $.ax(
                url,
                jsondate,
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {

                        /* PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0);*/
                        $(".load").css("display","none");
                        $("#choose_dialog").modal("show");
                        writeid=data.id+"";
                        $("#id").val("");
                        $("#name").val("");
                        $("#englishname").val("");
                        $("#comment").val("");
                        searchtext="";
                        $('.pagination').jqPagination("destroy");
                        pageflag=false;
                        PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0,searchtext);
                        PreviewMainMVC.Controller.getreport(PreviewMainMVC.URLs.report.url, data.id + "");
                    } else {
                        $(".load").css("display","none");
                        showdiago(data.message);
                    }
                },
                function () {
                    $(".load").css("display","none");
                    showdiago("有重复项目,请检查");
                }
            );
        },
        /*没做*/
        updatereport: function (url, jsondate) {
            $.ax(
                url,
                jsondate,
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    PreviewMainMVC.Controller.getreport(PreviewMainMVC.URLs.report.url, writeid+ "");

                },
                function () {

                }
            );
        },
        chooseStatus: function (status) {
            if (status == 1) {
                return "<span class='label label-success'>启用</span>"
            } else {
                return "<span class='label label-danger'>启用</span>"
            }
        },
        delectRole: function (url,id) {
            $.ax(
                url,
                {
                    id: id,
                    username:usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                   if(data.code==1){
                       showdiago("删除成功");
                       searchtext="";
                       $('.pagination').jqPagination("destroy");
                       pageflag=false;
                       PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,0,searchtext);
                   }else {
                       showdiago("删除失败");
                   }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );

        },
        creartPage: function (beforpage,countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string:'{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function(page) {
                    PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url,page-1,searchtext);
                }
            });
        }

    }
};