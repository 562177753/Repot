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
var searchtext = "";
var pageflag = false;
var date = "";
var writeid;
var delectid;
var updatejson = {};
var PreviewCommon = {
    baseUrl: config.BaseUrl
};

var PreviewMainMVC = {
    URLs: {
        getRole: {
            url: PreviewCommon.baseUrl + "getRoleNoPage"
        },
        getAllUser: {
            url: PreviewCommon.baseUrl + "getAllUser"
        },
        getResgist: {
            url: PreviewCommon.baseUrl + "getRigister"
        },
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        }
        ,
        getUserByLogin: {
            url: PreviewCommon.baseUrl + "getUserByLogin"
        },
        updateUser: {
            url: PreviewCommon.baseUrl + "updateUser"
        },
        delectUser: {
            url: PreviewCommon.baseUrl + "delectUser"
        },
        getLegion: {
            url: PreviewCommon.baseUrl + "getLegion"
        }
    },
    Model: {},
    View: {
        initControl: function () {
            $("#register").click(function () {
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
                    /*  if (phonetext($("#telephone").val())) {
                     if (emailtext($("#email").val())) {*/
                    var json = {};
                    json['account'] = $("#account").val();
                    json['roles'] = $("#role").text();
                    var legion=""
                    for(var i=0;i<$("#login_name").val().length;i++){
                        legion+=$("#login_name").val()[i]+",";
                    }
                    json['legion'] = legion;
                    json['name'] = $("#name").val();
                    json['email'] = $("#email").val();
                    json['telephone'] = $("#telephone").val();
                    json['comment'] = $("#comment").val();
                    PreviewMainMVC.Controller.getRigister(PreviewMainMVC.URLs.getResgist.url, json);
                    /* } else {
                     showdiago("邮箱输入格式错误");
                     }

                     } else {
                     showdiago("手机号输入错误");
                     }*/
                }
            });
            $('#adduser').click(function () {
                $('#register').attr("disabled", "disabled");
                $("#account").val("");
                $("#name").val("");
                $("#email").val("");
                $("#telephone").val("");
                $("#comment").val("");
                $('#adduser-diaglo').modal();
                PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url);
                PreviewMainMVC.Controller.getLegion(PreviewMainMVC.URLs.getLegion.url);

            });
            $("#query_user").click(function () {
                if ($("#account").val() != '' && $("#account").val() != null) {
                    PreviewMainMVC.Controller.getUserByLogin(PreviewMainMVC.URLs.getUserByLogin.url, $("#account").val());
                } else {
                    $('#adduser-diaglo').modal('hide');
                    showdiago("用户名不能为空查询");
                }

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
            $(".btn").click(function () {
                $("#login_name_ul").css('display', 'none');
                $("#login_update_ul").css('display', 'none');
            });
            $(".text").click(function () {
                $("#login_name_ul").css('display', 'none');
            });
            $('.down-ulto').on("click", function () {
                var select_ul = $(this).parent().parent().find("ul");
                var input = $(this).parent().find("input");
                if (select_ul.css('display') == "block") {
                    select_ul.css('display', 'none')
                } else {
                    input.focus();
                }
            });
            $("#search").click(function () {
                searchtext = $("#search_input").val();
                pageflag = false;
                PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, searchtext);
            });
            $("#search_input").keyup(function(evnet){
                if (evnet.keyCode == '13') {
                    searchtext = $("#search_input").val();
                    pageflag = false;
                    PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, searchtext);
                }

            });
            $('#update').click(function () {
                var flag = false;
                $("input[class=textupdate]").each(function (i) {
                    var text = $(this).val();
                    if (text == "") {
                        flag = true;
                        return;
                    }
                });
                if (flag) {
                    showdiago("不能有空项");
                } else {
                   /* if (phonetext($("#telephone_update").val())) {
                        if (emailtext($("#email_update").val())) {*/
                            updatejson['roles'] = $("#role_update").text();
                            updatejson['name'] = $("#name_update").val();
                            updatejson['email'] = $("#email_update").val();
                            var legion=""
                            for(var i=0;i<$("#login_name_update").val().length;i++){
                                legion+=$("#login_name_update").val()[i]+",";
                            }
                            updatejson['legion'] = legion;
                            updatejson['telephone'] = $("#telephone_update").val();
                            updatejson['comment'] = $("#comment_update").val();
                            updatejson['username'] =usershow("account");
                            PreviewMainMVC.Controller.updateUser(PreviewMainMVC.URLs.updateUser.url, updatejson);
                      /*  } else {
                            showdiago("邮箱输入格式错误");
                        }

                    } else {
                        showdiago("手机号输入错误");
                    }*/
                }


            });
            $('table').on('click', '.write', function () {
                $('#updateuser-diaglog').modal();
                writeid = $(this).parent().parent().find(".id").text();
                function getNumber() {
                    var p = new Promise(function (resolve, reject) {
                        PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url);
                        PreviewMainMVC.Controller.getLegion(PreviewMainMVC.URLs.getLegion.url, resolve);

                    });
                    return p;
                }

                getNumber().then(
                    function (data) {
                        if (data == "1") {
                            for (var i = 0; i < date.length; i++) {
                                if (date[i].id == writeid) {
                                    updatejson['id'] = date[i].id;
                                    $("#name_update").val(date[i].name);
                                    $("#email_update").val(date[i].email);
                                    $("#telephone_update").val(date[i].telephone);
                                    $("#comment_update").val(date[i].comment);
                                    $("#role_update").text(date[i].roles);
                                    $("#role_update_input").val(date[i].role[0].name);
                                    var legionarray = date[i].legion.split(",");
                                    $('#login_name_update').selectpicker('val',legionarray );

                                }

                            }
                        }

                    },
                    function (reason, data) {
                        showdiago("角色或权限下载失败")
                    }
                );

                /**/

            });
            $('table').on('click', '.delectuser', function () {
                delectid = $(this).parent().parent().find(".id").text();
                $("#delectRole-dialog").modal();
            });
            $('#delect_user').click(function () {
                PreviewMainMVC.Controller.delectuser(PreviewMainMVC.URLs.delectUser.url, delectid);
            });
            $("#role_input").on('focus', function () {
                $(this).parent().parent().find("ul").css("display", "block");
            });
            $("#role_input").on('blur', function () {
                var ul = $(this).parent().parent().find("ul");
                setTimeout(function () {
                    ul.css("display", "none");
                }, 200)
            });
            $("#role_update_input").on('focus', function () {
                $(this).parent().parent().find("ul").css("display", "block");
            });
            $("#role_update_input").on('blur', function () {
                var ul = $(this).parent().parent().find("ul");
                setTimeout(function () {
                    ul.css("display", "none");
                }, 200)
            });
            $("#login_name").selectpicker({
                actionsBox:true//在下拉选项添加选中所有和取消选中的按钮
            });
            $("#login_name_update").selectpicker({
                actionsBox:true//在下拉选项添加选中所有和取消选中的按钮
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
            PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, "");
        }
    },
    Controller: {
        getRole: function (url) {
            $.ax(
                url,
                {username:usershow("account")},
                false,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        $("#role .delect").remove();
                        $("#role_update_ul .delect").remove();
                        var roleList = data.roleList;
                        var conttext = "";
                        for (var i = 0; i < roleList.length; i++) {
                            /* conttext += "<option value='" + roleList[i].id + "'>" + roleList[i].name + "</option>"*/
                            conttext += "<li class='delect'><span style='display: none'>" + roleList[i].id + "</span><a href='javascript:;'>" + roleList[i].name + "</a></li>"
                        }
                        $("#role_ul").append(conttext);
                        $("#role_update_ul").append(conttext);
                        $("#role_ul li").on('click', function () {
                            $("#role").text($(this).find("span").text());
                            $("#role_input").val($(this).find("a").text());
                            $("#role_ul").css("display", "none");
                        });
                        $("#role_update_ul li").on('click', function () {
                            $("#role_update").text($(this).find("span").text());
                            $("#role_update_input").val($(this).find("a").text());
                            $("#role_update_ul").css("display", "none");
                        });
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );
        },
        getLegion: function (url, resolve) {
            $.ax(
                url,
                {username:usershow("account")},
                false,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {
                        $("#login_name option").remove();
                        $('#login_name').selectpicker('refresh');
                        $("#login_name_update option").remove();
                        $('#login_name_update').selectpicker('refresh');
                        $("#login_update_ul .delect").remove();
                        var legionList = data.legionList;
                        var conttext = "";
                        var contentth = "";
                        for (var i = 0; i < legionList.length; i++) {
                            conttext+="<option class='other' value='"+legionList[i].legion_name+"'>"+legionList[i].legion_name+"</option>";
                        }
                        document.getElementById("login_name").innerHTML=conttext;
                        document.getElementById("login_name_update").innerHTML=conttext;
                        /*$("#login_name").append(conttext);*/
                        $('#login_name').selectpicker('refresh');
                        $('#login_name_update').selectpicker('refresh');
                        resolve("1");
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络发生错误");
                }
            );
        },
        getAllUser: function (url, page, name) {
            $.ax(
                url,
                {page: page, name: name,
                    username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    $("#body_table tr").remove();
                    if (data.code == 1) {
                        console.log(data);
                        var userList = data.userList;
                        date = data.userList;
                        var userstr = "";
                        for (var i = 0; i < userList.length; i++) {
                            userstr += "<tr>" +
                                "<td class='id'>" + userList[i].id + "</td>" +
                                "<td>" + userList[i].account + "</td>" +
                                "<td>" + userList[i].role[0].name + "</td>" +
                                "<td>" + userList[i].name + "</td>" +
                                "<td>" +  PreviewMainMVC.Controller.getsplit(userList[i].legion) + "</td>" +
                                "<td>" + userList[i].comment + "</td>" +
                                "<td><button class='btn btn-danger btn-sm write' style='border-radius: 3px!important;background: #7385C1;padding-left: 3px;padding-right: 3px'> 修改用户</button><button class='btn btn-danger btn-sm delectuser' style='border-radius: 3px!important;margin-left: 3px;background: #C56B77;padding-left: 3px;padding-right: 3px'> 删除用户</button></td> " +
                                "</tr>";
                        }
                        $("#body_table").append(userstr);
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
        getsplit: function (legion) {
            var legionstr="";
            if(legion.length>20){
                legionstr=legion.substring(0,20)+"...";
            }else {
                legionstr=legion
            }
            return legionstr;
        },
       /* 没做*/
        getRigister: function (url, jsondate) {
            console.log(jsondate);
            $.ax(
                url,
                {json: JSON.stringify(jsondate),
                username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data);
                    if (data.code == 1) {

                        $("input[class=text]").each(function (i) {
                            $(this).val("");
                        });
                        $('#adduser-diaglo').modal("hide");
                        $('.pagination').jqPagination("destroy");
                        pageflag = false;
                        PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, searchtext);
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
        creartPage: function (beforpage, countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string: '{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function (page) {
                    PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url, page - 1, searchtext);
                }
            });
        },
        getUserByLogin: function (url, usernname) {
            $.ax(
                url,
                {username: usernname,
                account:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    if (data.code == 1) {
                        $('#register').removeAttr("disabled");
                    } else {
                        $('#register').attr("disabled", "disabled");
                        showdiago(data.message);
                    }
                },
                function () {
                    $('#register').attr("disabled", "disabled");
                    showdiago("网络发生错误");
                }
            );
        },
        updateUser: function (url, jsondate) {
            $.ax(
                url,
                jsondate,
                true,
                "Get",
                "json",
                function (data) {
                    if (data.code == 1) {
                        $("#updateuser-diaglog").modal("hide");
                        showdiago("修改成功");
                        $("input[type=textupdate]").each(function (i) {
                            $(this).val("");
                        });

                        PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, searchtext);
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("有重复项,请认真检查");
                }
            );
        },
        delectuser: function (url, id) {
            $.ax(
                url,
                {id: id,
                    username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    if (data.code == 1) {
                        $("#delectRole-dialog").modal("hide");
                        showdiago("删除成功");
                        $('.pagination').jqPagination("destroy");
                        pageflag = false;
                        PreviewMainMVC.Controller.getAllUser(PreviewMainMVC.URLs.getAllUser.url, 0, searchtext);
                    } else {
                        showdiago(data.message);
                    }
                },
                function () {
                    showdiago("网络错误");
                }
            );
        }
    }
};