/**
 * Created by yangbo on 2017/11/24.
 */

// 陈万军

//导航模块
let site_channel_render = (function () {
    let $site_channel = $(".site_channel"),
        $site_channel_render = $(".site_channel_render");
    //发布订阅
    let $plane = $.Callbacks();
    //渲染数据
    $plane.add(function (res) {
        let str = ``;
        let list = $(res.List);
        list.each(function (index, item) {
            str += ` <a href="${item.link}">${item.nav}</a>`
        });
        $site_channel_render.find(".channel_list_box").html(str);
        $site_channel_render.show();
    });
    //事件委托到整个盒子上
    $site_channel.delegate('span', "mouseenter", function (e) {
        $(this).next("u").show();
        $(this).parent().siblings().find("u").hide();
        if ($(this).html() === "电视剧") {
            $.ajax({
                url: 'json/cwj/tv.json',
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (res) {
                    $plane.fire(res)
                }
            })
        } else if ($(this).html() === "综艺") {
            $.ajax({
                url: 'json/cwj/zy.json',
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (res) {
                    $plane.fire(res)
                }

            })
        } else if ($(this).html() === "电影") {
            $.ajax({
                url: 'json/cwj/dy.json',
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (res) {
                    $plane.fire(res)
                }

            })
        } else if ($(this).html() === "VIP影院") {
            $.ajax({
                url: 'json/cwj/vip.json',
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (res) {
                    $plane.fire(res)
                }

            })
        } else {
            $site_channel_render.hide();
        }
    }).on("mouseleave", function () {
        $(this).find("u").hide();
        $site_channel_render.hide();
    });
    //隐藏 hideNav
    let hideNav = function () {

        $(".menu_btn").click(function () {
            $(".site_hide_nav").toggle();
        });
        $(window).on('scroll', function () {
            $(".site_hide_nav").hide();
        });
    }
    //隐藏显示看过历史记录(临时-处理）
    $(".site_quick").delegate('.look_history_box',"mouseenter", function () {
        $(this).find("u").show();
        $(".history_con").show();
        $(this).siblings("a").on("mouseenter", function () {
            $(this).siblings(".look_history_box").find("u").hide();
            $(".history_con").hide();
        });
    }).on("mouseleave", function () {
        $(this).find("u").hide();
        $(".history_con").hide();
    });
    $(".site_quick").delegate('.down_load_box',"mouseenter", function () {
        $(this).find("u").show();
        $(".down_load_con").show();
        $(this).siblings("a").on("mouseenter", function () {
            $(this).siblings(".down_load_box").find("u").hide();
            $(".down_load_con").hide();
        });
    }).on("mouseleave", function () {
        $(this).find("u").hide();
        $(".down_load_con").hide();
    });
    $(".site_quick").delegate('.user_boxs',"mouseenter", function () {
        $(this).find("u").show();
        $(".user_con").show();
        $(this).siblings("a").on("mouseenter", function () {
            $(this).siblings(".user_boxs").find("u").hide();
            $(".user_con").hide();
        });
    }).on("mouseleave", function () {
        $(this).find("u").hide();
        $(".user_con").hide();
    });


    return {
        init: function () {
            hideNav();
        }
    };


})();
site_channel_render.init();
//搜索模块
let searchRender = (function () {
    //=>搜索框
    let $searchTxt = $("#searchTxt"),
        $search_res_box = $(".search_res_box"),
        $temp = $search_res_box.find(".default_res"),
        $search_btn = $(".search_btn"),
        $search_res = $search_res_box.find(".search_res");


    //=>通过AJAX获取需要的数据
    let queryData = function () {
        // 数据绑定
        let prompt = function (data) {
            let str = strHistory = ``;
            let item = data.default;
            $temp.html('<ul class="default_res_box"></ul>');
            item.forEach(function (item, index) {
                str += `<li class="default_res_content">
                    <a href="https://v.qq.com/" class="default_link"> <span>${item.id}</span>${item.content}</a>
                </li>`;
            })
            ;
            $search_res.html('');
            str1 = `<li class="default_res_head">
                                            <p class="clearfix">
                                                <span>热门搜索</span>
                                                <a href="#" class="more_search">更多搜索 <i class="icon-left-arrow"></i></a>
                                            </p>
                                        </li>`;
            $(".default_res_box").append(str1, str);


        };
        // 搜索结果
        let searchResult = function (data) {
            $temp.html('');
            $search_res.html('<ul class="search_result"></ul>');
            let str = ``,
                need = 0,
                //去除所有空格
                val = $searchTxt.val().split(/\s+/g);
            let reg = new RegExp(val[0], 'gi');
            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                if (need >= 10) break;
                if (reg.test(item.mark)) {
                    str += `<li  class="default_res_content">
                                            <a href="https://v.qq.com/" class="default_res_content"> ${item.name}</a>
                                        </li>`;
                    need++;
                }
            }

            $('.search_result').append(str);
        };

        if ($.trim($searchTxt.val()) === '') {

            $.ajax({
                url: 'json/cwj/default.json',
                method: 'get',
                async: 'true',
                dataType: 'JSON',
                success: function (data) {
                    prompt(data);
                }
            })
        }
        else {
            $.ajax({
                url: 'json/cwj/seach.json',
                method: 'get',
                async: 'true',
                dataType: 'JSON',
                success: function (data) {
                    searchResult(data);
                }
            })
        }


    };
    queryData();
    //=>搜索匹配
    let searchFn = function () {
        queryData();
    };

    return {
        init: function () {
            //文本发生改变后
            $searchTxt.on("input", searchFn);
            //点击搜索跳转页面
            $search_btn.on("click", () => {
                location.href = $searchTxt.data("pl")
            });
            //点击搜索框显示搜索
            $searchTxt.on("click", () => {
                $search_res_box.show();
            });

        }
    };

})();
searchRender.init();
~function () {
    $(window).on("scroll", function () {
        let $this = $(this),
            $site_boxs = $(".site_boxs");
        if ($this.scrollTop() >= 650) $site_boxs.addClass("site_head_fixed").stop().animate({
            height: 73
        }, 80, function () {
            $site_boxs.css("overflow", "visible")
        });
        else $site_boxs.removeClass("site_head_fixed").height(0);
        // if($this.scrollTop()>=480) $site_boxs.addClass("site_head_fixed");
        //        else $site_boxs.removeClass("site_head_fixed");

    })

}();
//