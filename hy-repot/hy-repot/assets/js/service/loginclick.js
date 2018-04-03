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
    View: {
        initControl: function () {
            $("#login").click(function(){
                PreviewMainMVC.Controller.login();
            });
            $("#pwd").keyup(function (evnet) {
                if (evnet.keyCode == '13') {
                    PreviewMainMVC.Controller.login();
                }
            });
        },
        bindEvent: function () {
        },
        bindValidate: function () {
        },
        initData: function () {

        }
    },
    Controller: {
        login: function () {
            var usernmae=$("#username").val();
            var pwd=$("#pwd").val();
            if(usernmae!=null&&pwd!=null){
              /*  $(".load").css("display","block");*/
                $.ax(
                    PreviewCommon.baseUrl + "login",
                    {
                        username: usernmae,
                        pwd: pwd,
                    },
                    true,
                    "Get",
                    "json",
                    function (data) {
                        if (data.code == 1) {
                            localStorage.setItem("user",JSON.stringify(data.userList[0]));
                            /*if(data.userList[0].roles==4){*/
                            $(location).attr('href', 'index.html');
                          /*  }else {
                                $(location).attr('href', 'table_after.html?uid=c6184e66-fc7c-47e7-9b98-af1ec72d1bcb');
                            }*/
                           /* $(".load").css("display","none");*/
                        } else {
                           /* $(".load").css("display","none");*/
                            showdiago(data.message);
                        }
                    },
                    function () {
                      /*  $(".load").css("display","none");*/
                        showdiago("网络发生错误");
                    }
                );

            }else {
                //用户名或密码为空
                showdiago("用户名或密码为空");
            }

        }
    }
};
