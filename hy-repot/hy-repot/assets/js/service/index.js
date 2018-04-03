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
    URLs: {
        Serachreport: {
            url: PreviewCommon.baseUrl + "Serachreport"
        },
        getIndex: {
            url: PreviewCommon.baseUrl + "getIndex"
        }
    },
    Model: {},
    View: {
        initControl: function () {

        },
        bindEvent: function () {
        },
        bindValidate: function () {

        },
        initData: function () {
            $('#username').text(usershow("name"));
            if (usershow("roles") == 4) {
                $("#content1").css("display", "block");
            } else {
                $("#content2").css("display", "block");
            }

            PreviewMainMVC.Controller.inserttable(PreviewMainMVC.URLs.Serachreport.url, "");
            PreviewMainMVC.Controller.getindex(PreviewMainMVC.URLs.getIndex.url);
           /* var myChart = echarts.init(document.getElementById('charts'));
            var option = PreviewMainMVC.Controller.Creatchart();
            myChart.setOption(option);*/
        }
    },
    Controller: {
        Creatchart: function (x,y) {

            var option = {
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    show: false
                },
                toolbox: {
                    show: false,
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: 10,
                        splitLine: {
                            show: false
                        },

                        lineStyle: {
                            type: 'dotted'
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(12,45,92,0.2)',
                                width: 1,//这里是为了突出显示加上的
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#0C2D5C',//坐标值得具体的颜色

                            }
                        },
                        data: x
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(12,45,92,0.2)',
                                width: 1,//这里是为了突出显示加上的
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#0C2D5C',//坐标值得具体的颜色

                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        stack: '',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        lineStyle: {
                            normal: {
                                width: 1,  //连线粗细
                                color: "#f0b209"  //连线颜色
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "#f0b209",
                                lineStyle: {
                                    color: "#f0b209"
                                }
                            },
                            emphasis: {
                                color: "#FFFFFF",
                                lineStyle: {
                                    color: "#f0b209"
                                },
                                borderColor: "#3F88FF",
                                borderWidth: '4'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 1, 0, 0,
                                    [
                                        {offset: 0, color: '#fff5be'},
                                        {offset: 0.5, color: '#f0b209'},
                                        {offset: 1, color: '#f0b209'}
                                    ]
                                )
                            }
                        },
                        data: y
                    }
                ]
            };
            return option;
        },
        getindex: function (url) {
            $.ax(
                url,
                {
                    roles: usershow("roles"),
                    username: usershow("account")
                },
                true,
                "Get",
                "json",
                function (data) {
                    console.log(data)
                    if(data.code==1){
                        $("#date1").text(data.date1[0].count_amount_today);
                        $("#date2").text(data.date2[0].count_amount_month);
                        $("#date3").text(data.date3[0].count_num_today);
                        $("#date4").text(data.date4[0].cash_cost_today);
                        $("#date5").text(data.date5[0].cash_cost_month);
                        $("#date6").text(data.date6[0].roi_month);
                        var x=[];
                        var y=[];
                        var date7=data.date7;
                        for(var i=0;i<date7.length;i++){
                            x.push(date7[i].date);
                            y.push(date7[i].count_amount_7);
                        }
                        var myChart = echarts.init(document.getElementById('charts'));
                        var option = PreviewMainMVC.Controller.Creatchart(x,y);
                        myChart.setOption(option);
                        var date8=data.date8;
                        for(var i=0;i<date8.length;i++){
                           if(i==0){
                                $("#ranking").append('<li><img src="assets/img/index/home_ranking_1.png"><span class="name">'+date8[i].name+'</span><span class="count">'+date8[i].count_amount_7+'</span></li>')
                           }else if(i==1){
                               $("#ranking").append('<li><img src="assets/img/index/home_ranking_2.png"><span class="name">'+date8[i].name+'</span><span class="count">'+date8[i].count_amount_7+'</span></li>')

                           }else if(i==2){
                               $("#ranking").append('<li><img src="assets/img/index/home_ranking_3.png"><span class="name">'+date8[i].name+'</span><span class="count">'+date8[i].count_amount_7+'</span></li>')

                           }else if(i==3){
                               $("#ranking").append('<li><img src="assets/img/index/home_ranking_4.png"><span class="name">'+date8[i].name+'</span><span class="count">'+date8[i].count_amount_7+'</span></li>')

                           }else if(i==4){
                               $("#ranking").append('<li><img src="assets/img/index/home_ranking_5.png"><span class="name">'+date8[i].name+'</span><span class="count">'+date8[i].count_amount_7+'</span></li>')

                           }
                        }
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

        }
    }
};