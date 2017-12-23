/**
 * Created by yangbo on 2017/11/24.
 */

// 轮播图切换插件
~function ($) {
    let pluginTab = function (options) {
        let $tabBox = this,//这个是大盒子，（必传参数，需要配置）
            $tabList = $tabBox.find(".wj_tabList li"),
            $prev = $tabBox.find("a.wj_prev"),
            $next = $tabBox.find("a.wj_next");

        let _default = {
            len: 7,
            arrowVal: -55,
            total: 0
        };
        $.extend(this,_default,options);

        this.attr({
            len: _default.len,
            arrowVal: _default.arrowVal,
            total: _default.total,
            liList: null,
            start: null,
            end: null,
            drawing: null,
            flag: 0
        });

        let _len = null,
            _arrowVal = null,
            _total = null,
            _liList = null,
            _start = null,
            _end = null,
            _drawing = null,
            flag = 0;

        $tabBox.on("click", function (e) {

            _liList = $tabList.length;
            _len = parseFloat($(this).attr("len"));
            _arrowVal = parseFloat($(this).attr("arrowVal"));
            _total = parseFloat($(this).attr("total"));
            flag = parseFloat($(this).attr("flag"));

            $(this).attr("drawing", _liList % _len);
            _drawing = parseFloat($(this).attr("drawing"));

            let $target = $(e.target),
                elTagName = $target.prop("tagName");
            if (elTagName === "A" && $target.hasClass("wj_next")) {
                $prev.css({
                    "left": _arrowVal,
                    "display": "block"
                });
                $(this).attr("total", parseFloat(_total + _len));
                _total = $(this).attr("total")-0;

                // 判断li的总个数和传进来的len个数取模是否===0
                if (!flag) {
                    if (!(_liList % _len === 0)) {
                        $(this).attr("data-start", _len - _drawing);
                        console.log("2========="+_total);
                        // 获取要创建几个li，从哪里开始循环创建的元素
                        $(this).attr("end", $tabList.length - _drawing);
                        _end = parseFloat($(this).attr("end"));

                        $(this).attr("data-start", _end - parseFloat($(this).attr("data-start")));
                        _start = parseFloat($(this).attr("data-start"));

                        // 获取要创建的元素 [object HTMLLIElement]
                        for (let i = _start; i < _end; i++) {
                            // 添加元素到页面
                            $tabList.eq(_end).before($($tabList[i]).clone(true));
                        }

                        // 重新获取元素和个数
                        $tabList = $(this).find(".wj_tabList li");
                        _liList = $tabList.length;
                        _drawing = _liList % _len;

                        $(this).attr("flag", 1);
                        flag = parseFloat($(this).attr("flag"));

                    }
                }
                //console.log("3========="+_total);
                $tabList.each(function (index, item) {
                    index < _total ? $(item).css("display", "none") : null;
                });
                if (_total >= $tabList.length - _len) {
                    $target.css({
                        "right": 0,
                        "display": "none"
                    });
                    $(this).attr("total", $tabList.length - _len);
                }
                e.preventDefault();
            }

            if (elTagName === "A" && $target.hasClass("wj_prev")) {
                $(this).attr("total", _total - _len);
                _total = parseFloat($(this).attr("total"));
                $next.css({
                    "right": _arrowVal,
                    "display": "block"
                });
                $tabList.each(function (index, item) {
                    index >= _total ? $(item).css("display", "inline-block") : null;
                });

                if (_total <= 0) {
                    $target.css({
                        "left": 0,
                        "display": "none"
                    });
                    $(this).attr("total", 0);
                }
                e.preventDefault();
            }
        });


    };

    $.fn.extend({
        pluginTab: pluginTab
    });

}(jQuery);

// 为你推荐
let wjRecommendRender = (function ($) {
    let $wjMoreRecommend = $("#wj_more_recommend"),
        $wjMoreRecommendA = $wjMoreRecommend.find("a"),
        str = ``,
        len = 0,
        $wjRecommenList = $("#wj_recommen_list"),
        start = 0,
        end = 0;

    let ajax = function (num) {
        if (num === 0) {
            end = 10;
        } else {
            start = end + 1;
            end = start + 6;
        }
        $.ajax({
            url: "json/wj/recommend.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                console.log(res.length, start, end);
                for (let i = start; i <= end; i++) {
                    let item = res[i];
                    str += `<li>
                <a href="javascript:;">
                    <img src="${item.img}" alt="">
                    <span class="mark_quickplay"></span>
                    <div class="figure_count">${item.count}</div>
                </a>
                <a href="javascrip:;">
                    <p>${item.title}</p>
                </a>
            </li>`;
                }
                $wjRecommenList.append(str);
            }
        });
    };

    let bindHtml = function () {
        let timer = null;
        $wjMoreRecommendA.on("click", function () {
            let $this = $(this);
            $this.text("正在加载......");
            len++;
            if (len === 1) {
                timer = setTimeout(function () {
                    ajax(len);
                    $wjMoreRecommend.addClass("cur");
                    $this.text("我是有底线的");
                    clearTimeout(timer);
                    return;
                }, 800);

            }
        });
    };

    return {
        init: function () {
            ajax(0);
            bindHtml();
        }
    }
})(jQuery);
wjRecommendRender.init();

// 娱乐热点
let wjHotRender = (function ($) {
    let $wj_HotList= $("#wj_HotList"),
        str = ``;

    let ajax = function () {
        $.ajax({
            url: "json/wj/carInfo.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                $.each(res,function(index,item){
                    str += `<li>
                    <a class="imgLink figure" href="javascript:;">
                        <img class="figure_pic" src="${item.img}" alt="">
                        <span class="lyc_iconfont lyc_icon-shejishi-bofanganniu"></span>
                        <div class="figure_keyframes">
                            <img src="${item.bigImg}" alt="多张动态图" class="figure_keyframes_pic">
                            <div class="figure_keyframes_mask"></div>
                            <div class="figure_keyframes_outer">
                                <div class="figure_keyframes_inner"></div>
                            </div>
                        </div>
                    </a>
                    <div class="figure_detail_org">
                        <strong class="figure_title figure_title_f">
                            <a class="tit_link" href="javascript:;" title="娱乐热点">娱乐热点
                            </a>
                        </strong>
                        <div class="figure_desc" title="${item.title}">${item.title}
                        </div>
                    </div>
                </li>`;
                });
                $wj_HotList.append(str);
            }
        });
    };

    return {
        init: function () {
            ajax();
        }
    }
})(jQuery);
wjHotRender.init();

// 音乐·演唱会
let wjHotRender01 = (function ($) {
    let $wj_HotList= $("#wj_HotList01"),
        str = ``;

    let ajax = function () {
        $.ajax({
            url: "json/wj/game.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                $.each(res,function(index,item){
                    str += `<li>
                    <a class="imgLink figure" href="javascript:;">
                        <img class="figure_pic" src="${item.img}" alt="">
                        <span class="lyc_iconfont lyc_icon-shejishi-bofanganniu"></span>
                        <div class="figure_keyframes">
                            <img src="${item.bigImg}" alt="多张动态图" class="figure_keyframes_pic">
                            <div class="figure_keyframes_mask"></div>
                            <div class="figure_keyframes_outer">
                                <div class="figure_keyframes_inner"></div>
                            </div>
                        </div>
                    </a>
                    <div class="figure_detail_org">
                        <strong class="figure_title figure_title_f">
                            <a class="tit_link" href="javascript:;" title="音乐·演唱会">音乐·演唱会
                            </a>
                        </strong>
                        <div class="figure_desc" title="${item.title}">${item.title}
                        </div>
                    </div>
                </li>`;
                });
                $wj_HotList.append(str);
            }
        });
    };

    return {
        init: function () {
            ajax();
        }
    }
})(jQuery);
wjHotRender01.init();

// NBA
let wjHotRender02 = (function ($) {
    let $wj_HotList= $("#wj_HotList02"),
        str = ``;

    let ajax = function () {
        $.ajax({
            url: "json/wj/game.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                $.each(res,function(index,item){
                    str += `<li>
                    <a class="imgLink figure" href="javascript:;">
                        <img class="figure_pic" src="${item.img}" alt="">
                        <span class="lyc_iconfont lyc_icon-shejishi-bofanganniu"></span>
                        <div class="figure_keyframes">
                            <img src="${item.bigImg}" alt="多张动态图" class="figure_keyframes_pic">
                            <div class="figure_keyframes_mask"></div>
                            <div class="figure_keyframes_outer">
                                <div class="figure_keyframes_inner"></div>
                            </div>
                        </div>
                    </a>
                    <div class="figure_detail_org">
                        <strong class="figure_title figure_title_f">
                            <a class="tit_link" href="javascript:;" title="NBA">NBA
                            </a>
                        </strong>
                        <div class="figure_desc" title="${item.title}">${item.title}
                        </div>
                    </div>
                </li>`;
                });
                $wj_HotList.append(str);
            }
        });
    };

    return {
        init: function () {
            ajax();
        }
    }
})(jQuery);
wjHotRender02.init();

// 最强笑点
let wjHotRender03 = (function ($) {
    let $wj_HotList= $("#wj_HotList03"),
        str = ``;

    let ajax = function () {
        $.ajax({
            url: "json/wj/entertainment.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                $.each(res,function(index,item){
                    str += `<li>
                    <a class="imgLink figure" href="javascript:;">
                        <img class="figure_pic" src="${item.img}" alt="">
                        <span class="lyc_iconfont lyc_icon-shejishi-bofanganniu"></span>
                        <div class="figure_keyframes">
                            <img src="${item.bigImg}" alt="多张动态图" class="figure_keyframes_pic">
                            <div class="figure_keyframes_mask"></div>
                            <div class="figure_keyframes_outer">
                                <div class="figure_keyframes_inner"></div>
                            </div>
                        </div>
                    </a>
                    <div class="figure_detail_org">
                        <strong class="figure_title figure_title_f">
                            <a class="tit_link" href="javascript:;" title="最强笑点">最强笑点
                            </a>
                        </strong>
                        <div class="figure_desc" title="${item.title}">${item.title}
                        </div>
                    </div>
                </li>`;
                });
                $wj_HotList.append(str);
            }
        });
    };

    return {
        init: function () {
            ajax();
        }
    }
})(jQuery);
wjHotRender03.init();

// 游戏
let wjHotRender04 = (function ($) {
    let $wj_HotList= $("#wj_HotList04"),
        str = ``;

    let ajax = function () {
        $.ajax({
            url: "json/wj/bighaha.json",
            type: "get",
            dataType: "json",
            success: function (res) {
                $.each(res,function(index,item){
                    str += `<li>
                    <a class="imgLink figure" href="javascript:;">
                        <img class="figure_pic" src="${item.img}" alt="">
                        <span class="lyc_iconfont lyc_icon-shejishi-bofanganniu"></span>
                        <div class="figure_keyframes">
                            <img src="${item.bigImg}" alt="多张动态图" class="figure_keyframes_pic">
                            <div class="figure_keyframes_mask"></div>
                            <div class="figure_keyframes_outer">
                                <div class="figure_keyframes_inner"></div>
                            </div>
                        </div>
                    </a>
                    <div class="figure_detail_org">
                        <strong class="figure_title figure_title_f">
                            <a class="tit_link" href="javascript:;" title="游戏">游戏
                            </a>
                        </strong>
                        <div class="figure_desc" title="${item.title}">${item.title}
                        </div>
                    </div>
                </li>`;
                });
                $wj_HotList.append(str);
            }
        });
    };

    return {
        init: function () {
            ajax();
        }
    }
})(jQuery);
wjHotRender04.init();