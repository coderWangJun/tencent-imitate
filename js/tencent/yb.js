/**
 * Created by yangbo on 2017/11/24.
 */
// 杨波

let tencentRender = (function () {
    let $custommovie = $("#custommovie"),
        $cus_figure_list = $custommovie.find('.figure_list'),
        $timetable = $("#timetable"),
        $tim_figure_list = $timetable.find('.figure_list'),
        $channelSeries = $("#channelSeries"),
        $ser_figure_list = $channelSeries.find('.figure_list'),
        $channelMovie = $("#channelMovie"),
        $mov_figure_list = $channelMovie.find('.figure_list'),
        $channelCartoon = $("#channelCartoon"),
        $car_figure_list = $channelCartoon.find('.figure_list'),
        $channelChild = $("#channelChild"),
        $chi_figure_list = $channelChild.find('.figure_list'),
        $channelUnitedstates = $("#channelUnitedstates"),
        $uni_figure_list = $channelUnitedstates.find('.figure_list'),
        $channelKarea = $("#channelKarea"),
        $kar_figure_list = $channelKarea.find('.figure_list'),
        $channelDoco = $("#channelDoco"),
        $doc_figure_list = $channelDoco.find('.figure_list');

    // 创建节点集合
    let queryData = (data, context)=> {
        let str = ``;
        for (var i = 0; i < data.length; i++) {
            var {id,mark,mark_msg,hot,text,modidx,update,score,img_src,video_title} = data[i];
            str += `<li class="list_item" data-id="${id}">
                        <a href="javascript:;" class="figure figure_mark" target="_blank" data-float="${id}">
                            <img src="${img_src}" class="figure_pic" alt="${video_title.split(' ')[0]}">
                            ${ mark ? `<i class="mark_v"><img src="images/yb/mark_${mark}.png" alt="${mark_msg}"></i>` : ``}
                            ${ update ? `<div class="figure_count">${update}</div>` : ``}
                            ${ score ? `<div class="figure_score">
                                ${
                score.split('.').map((item, index)=> {
                    if (index === 0) {
                        return `<em class="score_l">${item}</em>`
                    }
                    return `<em class="score_s">.${item}</em>`
                }).join('')
                }
                            </div>` : ``}
                            ${hot ? `<span class="figure_mask"></span><span class="figure_thermometer">
                                <i class="icon_thermometer">
                                    <i class="icon_thermometer_ball"></i>
                                    <i class="icon_thermometer_progress" style="height: ${hot}%;">
                                    </i>
                                </i>
                                <span class="add_num">+1</span>
                                <span class="thermometer_info">
                                    <span class="txt">期待指数</span>
                                    <span class="txt">${hot}%</span>
                                </span>
                            </span>` : ''}
                        </a>
                        <div class="figure_detail ${typeof modidx != 'undefined' ? 'figure_detail_collect' : ''}">
                            <strong class="figure_title">
                                <a href="#" title="${video_title.split(' ')[0]}" data-id="${id}">${video_title.split(' ')[0]}</a>
                            </strong>
                            <div class="figure_desc" title="${text}">${text}</div>
                            ${typeof modidx != 'undefined' ? `<a href="javascript:;" class="figure_collect" title="${modidx===0?'加入看单':'取消看单'}" data-followlist="${id}" data-modidx="${modidx}">
                            <i class="icon iconfont_yb icon_collect"></i>
                            <i class="icon iconfont_yb icon_collected"></i>
                            </a>` : ``}
                        </div>
                    </li>`;
        }
        context.html(str);
        if (typeof  modidx !== 'undefined') {
            collectControl();
        }
    };
    // 绑定数据
    let requestFn = (url, context)=> {
        $.ajax({
            url     : url,
            method  : 'get',
            dataType: 'json',
            cache   : false,
            success : (data)=> {
                queryData(data, context);
            }
        })
    };
    // 控制收藏
    let collectControl = function () {
        let $iControl = $timetable.find('.figure_collect');
        for (var i = 0; i < $iControl.length; i++) {
            var item = $iControl[i];
            if ($(item).data('modidx') == 0) {
                $(item).children().eq(0).show().siblings().hide();
            } else {
                $(item).children().eq(1).show().siblings().hide();
            }
        }
    };

    return {
        init: function () {
            // 封装函数，方便以后做延迟加载；
            requestFn('json/yb/custommovie.json', $cus_figure_list);
            requestFn('json/yb/timetable.json', $tim_figure_list);
            requestFn('json/yb/channelSeries.json', $ser_figure_list);
            requestFn('json/yb/channelMovie.json', $mov_figure_list);
            requestFn('json/yb/channelCartoon.json', $car_figure_list);
            requestFn('json/yb/channelChild.json', $chi_figure_list);
            requestFn('json/yb/channelUnitedstates.json', $uni_figure_list);
            requestFn('json/yb/channelKarea.json', $kar_figure_list);
            requestFn('json/yb/channelDoco.json', $doc_figure_list);
        }
    }
})();
tencentRender.init();

(function (root, factory, plug) {
    factory(jQuery, plug);
})(window, function (jQuery, plug) {
    let _default = {
        url: null
    };
    // 监听窗口变化
    let _watch = false; // 监听窗口是否发生变化
    let watchWidth = function () {
        $(window).on('resize', function () {
            _watch = true;
        });
    };
    // 发布订阅管理
    let $plan = $.Callbacks();
    // 收藏处理
    let collectionFn = function (item) {
        let collection = $("#" + $(item).data('bind_id'));
        // 处理事件源，处理情况
        let likeFn = function (e) {
            let target = e.target,
                $target = $(target);

            if ($target.hasClass('icon_collect')) {
                // 表示已经收藏过了
                collection.data('collect', 1);
                $target.hide().siblings().show().parent().attr('title','取消看单');
                // 强势接挡 专属事件
                if($target.parent().attr('data-modidx') && $target.parent().attr('data-modidx') == 0){
                    $target.parent().attr('data-modidx',1);
                    $target.parents('.list_item').find('.add_num').addClass('add_num_animate');
                    $target.parents('.list_item').find('.figure_thermometer').addClass('_animate0');
                }
            }
            if ($target.hasClass('icon_collected')) {
                // 表示已经收藏过了
                collection.data('collect', 0);
                $target.hide().siblings().show().parent().attr('title','加入看单');
                // 强势接挡 专属事件
                if($target.parent().attr('data-modidx') && $target.parent().attr('data-modidx') == 1){
                    $target.parent().attr('data-modidx',0);
                    $target.parents('.list_item').find('.add_num').removeClass('add_num_animate');
                    $target.parents('.list_item').find('.figure_thermometer').removeClass('_animate0');
                }
            }
        };
        // 事件委托
        $(document).on({
            click: likeFn
        })
    };
    collectionFn();
    // 控制视频的播放和暂停
    let videoControl = function (item) {
        let videoPause = $("#" + $(item).data('bind_id'));
        videoPause.parent().parent().on({
            mouseenter: function () {
                $(this).find('video')[0].play();
            },
            mouseleave: function (e) {
                $(this).removeClass('ani_x_card_hover').find('video')[0].pause();

            }
        })
    };
    $plan.add(videoControl);
    // 全局音量控制
    let _volume = false;
    let volumeFn = function ($showBox) {
        for (var i = 0; i < $showBox.length; i++) {
            var temp = $showBox[i];
            if (_volume === false) {
                temp.volume = 0;
            } else {
                temp.volume = 1;
            }
        }
    };
    // 控制音频的声音
    let playControl = function (item) {
        let $showBox = $('.figure_video_outlink video'),// 获取所有video 标签
            volumeControl = $("#" + $(item).data('bind_id')).find('.figure_video'), // 获取当前盒子的video容器
            $novolume = $('.icon_novolume'), // 获取音量开启按钮
            $volume = $('.icon_volume'); // 获取音量关闭按钮

        // 初始化全部音频声音
        volumeFn($showBox);

        // 处理声音开关
        volumeControl.on({
            'mouseenter': function () {
                $(this).find('.figure_video_tools').removeClass('none').find('.figure_mute').show();
                if (!_volume) {
                    $novolume.show().siblings().hide();
                } else {
                    $volume.show().siblings().hide();
                }

                $novolume.on('click', function (e) {
                    // 阻止冒泡传播和A标签的默认行为
                    e.stopPropagation();
                    e.preventDefault();
                    _volume = true;
                    // 改变全局音频的音量
                    volumeFn($showBox);
                    // 按钮切换
                    $(this).css('display', 'none').siblings().css('display', 'block');
                });

                $volume.on('click', function (e) {

                    e.stopPropagation();
                    e.preventDefault();
                    _volume = false;
                    // 改变全局音频的音量
                    volumeFn($showBox);
                    // 按钮切换
                    $(this).css('display', 'none').siblings().css('display', 'block');
                });
            },
            'mouseleave': function () {
                // 离开范围后隐藏按钮块
                $(this).find('.figure_video_tools').addClass('none').find('.figure_mute').hide();
            }
        })
    };
    $plan.add(playControl);
    // 处理事件源 后执行
    let obtain = function (e, _data) {
        let $target = $(e.target);
        // 查找事件源的所有父级元素中中符合条件的父级容器
        $target.parents().each(function (index, item) {
            if ($(item).hasClass('figure_mark')) {
                // 获取当前事件源父级容器的id
                let src_id = $(item).attr('data-float'),
                    item_Top = $(item).offset().top,
                    winH = $(window).scrollTop();
                // 如果当前容器的offsetTop已经小于window.scrollTop 就不再触发展示容器的创建和显示
                if (item_Top < winH) return;
                // 如果已经创建过对应的展示容器 就直接展示
                if ($(item).data('bind_id')) {
                    let item_posBox = $("#" + $(item).data('bind_id'));
                    // 如果屏幕尺寸发生了改变，那就需要重新获取展示载体的最新offsetLeft 和offsetTop，然后重新设置定位盒子的top和left
                    if (_watch) {
                        let item_left = $(item).parent().offset().left,
                            item_top = $(item).parent().offset().top;
                        // 设置最新的定位
                        item_posBox.parent().parent().css({
                            top : item_top - 20,
                            left: item_left - 20
                        });
                    }
                    item_posBox.parent().parent().addClass('ani_x_card_hover').siblings().removeClass('ani_x_card_hover');
                }
                // 如果没有创建的对应的展示容器，就先创建后在执行展示
                else {
                    for (var i = 0; i < _data.length; i++) {
                        let temp = _data[i];
                        if (src_id === temp.id) {
                            if (!$(item).data('bind_id')) {
                                $(item).data({
                                    'bind_id': temp.port + temp.mini,
                                    'index'  : i,
                                    'like' : temp.like
                                });
                            }
                        }
                    }
                    createElm(item, _data[$(item).data('index')]);
                }
            }
        });
        if (!$target.parents().hasClass('figure_mark')) {
            x_poster_card.children().removeClass('ani_x_card_hover');
        }
    };
    // 存储展示区域的地方
    let x_poster_card = $('.x_poster_card');
    // 创建鼠标经过相对应的显示或者追加
    let createElm = function (item, temp_data) {
        // 解构赋值 当前容器所需要的数据
        let {video_height,video_bg,video_src,video_title,video_tags,recommend_txt,review_txt,like} = temp_data;
        // 保存当前容器的定位信息
        let item_left = $(item).offset().left,
            item_top = $(item).offset().top,
            item_width = $(item).width();
        // 创建展示容器
        let str = `<div class="x_poster_card_bd" style="width:${item_width + 40}px;top:${item_top - 20}px;left:${item_left - 20}px;">
                        <div class="poster_card_video">
                            <a href="#" class="figure_video_outlink" data-collect="${like}" id="${$(item).data('bind_id')}" style='height:${video_height + 20}px'>
                                <div class="figure_video">
                                    <video src="${video_src}" loop="loop" preload='none' style="background: url('${video_bg}') center center / cover no-repeat transparent;">
                                        <img src="" class="figure_video_poster" alt="">
                                    </video>
                                    <div class="figure_video_start">
                                        <i class="icon_l icon_play_l"></i>
                                    </div>
                                    <div class="figure_video_tools none">
                                        <span class="figure_info">0秒</span>
                                        <span class="figure_mute muted">
                                            <i class='icon iconfont_yb icon_novolume'></i>
                                            <i class='icon iconfont_yb icon_volume'></i>
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div class="video_content">
                                <div class="video_title" title="${video_title}">
                                    ${video_title.split(' ').map((item, index) => {
            if (index === 0) {
                return `<a href="" class="tit">${item}</a>`;
            }
            return `<span class="type">${item}</span>`
        }).join(" ")}
                                </div>
                                ${video_tags ? `<div class="video_tags" title="${video_tags}"><span class="tag_tit">主演：</span>
                                    ${video_tags.split('/').map(function (item, index) {
            if (index === 0) {
                return `<span class="tag_tit">${item}</span>`
            }
            return `<span class="line">/</span><span class="tag_tit">${item}</span>`
        }).join("")}
                                </div>` : ``}
                                    ${recommend_txt ? `<div class="video_recommend"><span class="recommend_tit">推荐：</span><span class="recommend_txt" title="${recommend_txt}">
                                        ${recommend_txt.replace(/h1([\w\W]+)h1/i, (...arg)=> {
            return `<span class="h1">${arg[1]}</span>`;
        })}</sapn></div>` : ``}
                                ${review_txt ? `<div class="video_review">
                                    <span class="review_name">点评：</span>
                                    <span class="review_txt" title="${review_txt}">${review_txt}</span>
                                </div>` : ``}
                                <div class="video_btn">
                                    <span class="video_btn_half _follow">
                                    <a href="javascript:;" class="z_figure_collect" title="加入看单">
                                        <i class="icon iconfont_yb icon_collect"></i>
                                        <i class="icon iconfont_yb icon_collected"></i>
                                    </a>
                                    </span>
                                    <span class="link">|</span>
                                    <span class="video_btn_half _down" title="用客户端下载视频">
                                    <a href="javascript:;" class="z_figure_dl">
                                        <i class="icon iconfont_yb icon_dl"></i>
                                        <i class="icon iconfont_yb icon_dl_disabled"></i>
                                    </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`;
        // 追加创建的展示容器
        x_poster_card.append(str);
        let bind_obj = $("#" + $(item).data('bind_id')).parent().parent();

        if ($(item).data('like') == 0) {
            bind_obj.find('.icon_collect').show().siblings().hide();
        } else {
            bind_obj.find('.icon_collected').show().siblings().hide();
        }
        // 展示容器，追加动画效果
        bind_obj.addClass('ani_x_card_hover').siblings().removeClass('ani_x_card_hover');
        $plan.fire(item);
    };

    $.fn[plug] = function (options) {
        $.extend(this, _default, options);
        let that = this;
        // 监控窗口的变换
        watchWidth();
        $.ajax({
            url     : that.url,
            method  : 'get',
            dataType: 'json',
            async   : true,
            cache   : false,
            success : function (data) {
                $(that).on({
                    'mouseover': function (e) {
                        e.stopPropagation();
                        obtain(e, data);
                    }
                    ,
                    'mousemove': (e)=> {
                        e.stopPropagation();
                        obtain(e, data);
                    }
                })
            },
            error   : function (data) {

            }
        });
    }
}, 'imgOver');

// 现在有一个bug，当鼠标第一次从最左边或者最右边进入容器的时候，在还没有绑定事件的时候就，达到了触发显示的事件，但是这是刚刚绑定事件委托，所以不能触发显示效果
// 我的解决方案，如果能把页面中所有需要有这种鼠标经过就可以显示的效果请求的数据都存在一个地址，就可以解决这个问题
$(document).on({
    'mouseover': function (e) {
        let target = e.target;

        let bindFn = (ele, url_src)=> {
            if ($(ele).isBind) return;
            $(ele).isBind = true;
            // 获取当前事件源父级容器绑定事件
            $(ele).imgOver({
                url: url_src
            });
        };
        // 查找事件源的所有父级元素中中符合条件的父级容器
        switch ($(target).attr('id')) {
            case 'custommovie':
                bindFn(target, 'json/yb/custommovie.json');
                break;
            case 'timetable':
                bindFn(target, 'json/yb/timetable.json');
                break;
            case 'channelSeries':
                bindFn(target, 'json/yb/channelSeries.json');
                break;
            case  'channelMovie':
                bindFn(target, 'json/yb/channelMovie.json');
                break;
            case  'channelCartoon':
                bindFn(target, 'json/yb/channelCartoon.json');
                break;
            case  'channelChild':
                bindFn(target, 'json/yb/channelChild.json');
                break;
            case  'channelUnitedstates':
                bindFn(target, 'json/yb/channelUnitedstates.json');
                break;
            case  'channelKarea':
                bindFn(target, 'json/yb/channelKarea.json');
                break;
            case  'channelDoco':
                bindFn(target, 'json/yb/channelDoco.json');
                break;
            default :
                $(target).parents().each(function (index, item) {
                    if ($(item).attr('id') === 'custommovie') {
                        bindFn(item, 'json/yb/custommovie.json');
                    }
                    if ($(item).attr('id') === 'timetable') {
                        bindFn(item, 'json/yb/timetable.json');
                    }
                    if ($(item).attr('id') === 'channelSeries') {
                        bindFn(item, 'json/yb/channelSeries.json');
                    }
                    if ($(item).attr('id') === 'channelMovie') {
                        bindFn(item, 'json/yb/channelMovie.json');
                    }
                    if ($(item).attr('id') === 'channelCartoon') {
                        bindFn(item, 'json/yb/channelCartoon.json');
                    }
                    if ($(item).attr('id') === 'channelChild') {
                        bindFn(item, 'json/yb/channelChild.json');
                    }
                    if ($(item).attr('id') === 'channelUnitedstates') {
                        bindFn(item, 'json/yb/channelUnitedstates.json');
                    }
                    if ($(item).attr('id') === 'channelKarea') {
                        bindFn(item, 'json/yb/channelChild.json');
                    }
                    if ($(item).attr('id') === 'channelChild') {
                        bindFn(item, 'json/yb/channelChild.json');
                    }
                });
                break;
        }
    }
});

