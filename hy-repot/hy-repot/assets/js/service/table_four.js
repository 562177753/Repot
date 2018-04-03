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
var uids;
var writeid;
var types;
var pagecount;
var delectid;
var updatejson = {};
var PreviewCommon = {
    baseUrl: config.BaseUrl
};

var PreviewMainMVC = {
    URLs: {

        //查看历史记录
        getuploadExcel: {
            url: PreviewCommon.baseUrl + "getuploadExcel"
        },

        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        }
        ,
        getUserByLogin: {
            url: PreviewCommon.baseUrl + "getUserByLogin"
        },

        //上传excel文件
        uploadExcel: {
            url: PreviewCommon.baseUrl + "uploadExcel"
        },
        getLegion: {
            url: PreviewCommon.baseUrl + "getLegion"
        }
    },
    Model: {},
    View: {
        initControl: function () {

            $('#files').on('change',function () {
                var files = this.files;
                sizeFile = files[0].size;

            })
            //点击上传
            $("#submit").click(function () {
                if(sizeFile>10485760) {
                    swal('您上传的文件已超出规定大小！');
                    return;
                }else{
                    PreviewMainMVC.Controller.uploadExcel(PreviewMainMVC.URLs.uploadExcel.url);
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


            $('table').on('click', '.write', function () {
                $('#updateuser-diaglog').modal();
                writeid = $(this).parent().parent().find(".id").text();
                function getNumber() {
                    var p = new Promise(function (resolve, reject) {
                        // PreviewMainMVC.Controller.getLegion(PreviewMainMVC.URLs.getLegion.url, resolve);

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
            types = PreviewMainMVC.Controller.GetQueryString("type");
            uids = PreviewMainMVC.Controller.GetQueryString("uid");
            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            PreviewMainMVC.Controller.getuploadExcel(PreviewMainMVC.URLs.getuploadExcel.url,0,"");
        }
    },
    Controller: {
        //上传excel 文件
        uploadExcel: function (url) {
            $('#name').val(usershow("account"));
            var form = document.getElementById('upload');
            formData = new FormData(form);
            $(".load").css("display", "block");
            $.ajax({
                type: "post",
                url: url,
                data: formData,
                cache: false,
                async : false,
                processData:false,
                contentType:false,
                success: function (result)
                {
                    $(".load").css("display", "none");
                    if(result.code==1){
                        swal({    title: "上传成功",
                            text: "是否下载最新excel文件?",
                            type: "info",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            cancelButtonText:'取消',
                            confirmButtonText:'确定',
                            showLoaderOnConfirm: true,
                        }, function(){
                            window.open(result.loadurl);
                            setTimeout(function(){
                                swal("下载完成！");
                            },
                            1000);
                        });
                        PreviewMainMVC.Controller.getuploadExcel(PreviewMainMVC.URLs.getuploadExcel.url,0,"");
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    swal(result.message)
                }
            });
        },
        //获取地址栏的参数
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        //加载 excel
        getuploadExcel: function (url, page) {
            $.ax(
                url,
                {page: page,
                 username:usershow("account")},
                true,
                "Get",
                "json",
                function (data) {
                    $("#body_table tr").remove();
                    if (data.code == 1) {
                        // console.log(data);
                        var datelist = data.datelist;
                        var userstr = "";
                        for (var i = 0; i < datelist.length; i++) {
                            userstr += "<tr>" +
                                "<td class='id'>" + datelist[i].id + "</td>" +
                                "<td>" + datelist[i].account + "</td>" +
                                "<td>" + datelist[i].file_name + "</td>" +
                                "<td>" +  datelist[i].upload_time + "</td>" +
                                "<td><a href='"+datelist[i].url+"' class='btn btn-danger btn-sm write' style='border-radius: 3px!important;background: #7385C1;padding-left: 3px;padding: 3px 10px'>下载</a>" +
                                "</td> " +

                                +"</tr>";
                        }
                        $("#body_table").append(userstr);
                         pagecount = data.count;
                        if (!pageflag) {
                            pageflag = true;
                            PreviewMainMVC.Controller.creartPage(page + 1, Math.ceil(pagecount / 25));
                        }
                    } else {
                        swal(data.message);
                    }
                },
                function () {
                    swal("网络发生错误");
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
        //插入表格
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
                                    $("#down_" + reportlist[i].type).append("<li><a href='table_four.html?uid=" + reportlist[i].uid + "&type=" + reportlist[i].type + "&name=" + encodeURI(reportlist[i].name) + "'>" + reportlist[i].type1Name + "</a></li>");
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
                            $("#"+uids).css("color","#0C8569");
                        }

                        // console.log(banner)
                    } else {
                        swal("网络发生错误");
                    }
                },
                function () {
                    swal("网络发生错误");
                }
            );

        },
        //翻页
        creartPage: function (beforpage, countpage) {
            $('.pagination').jqPagination({
                link_string: '/?page={page_number}',
                page_string: '{current_page}/{max_page}',
                current_page: beforpage, //设置当前页 默认为1
                max_page: countpage,
                paged: function (page) {
                    // PreviewMainMVC.Controller.getRole(PreviewMainMVC.URLs.getRole.url, page - 1, searchtext);
                    PreviewMainMVC.Controller.getuploadExcel(PreviewMainMVC.URLs.getuploadExcel.url, page - 1, searchtext);



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
                        swal(data.message);
                    }
                },
                function () {
                    $('#register').attr("disabled", "disabled");
                    swal("网络发生错误");
                }
            );
        }


    }
};