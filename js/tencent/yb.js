/**
 * Created by yangbo on 2017/11/24.
 */
// 杨波

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
        let collection = $("#" + $(item).data('bind_id')),
            iControl = collection.parent().find('.z_figure_collect').find('i');
        // 初始化收藏状态
        if (!collection.data('collect')) {
            $(iControl[0]).show().siblings().hide();
        } else {
            $(iControl[1]).show().siblings().hide();
        }
        // 处理事件源，处理情况
        let likeFn = function (e) {
            let target = e.target,
                $target = $(target);

            if ($target.hasClass('icon_collect')) {
                // 表示已经收藏过了
                collection.data('collect', 1);
                $target.hide().siblings().show();
            }
            if ($target.hasClass('icon_collected')) {
                // 表示已经收藏过了
                collection.data('collect', 0);
                $target.hide().siblings().show();
            }
        };
        // 事件委托
        $(document).on({
            click: likeFn
        })
    };
    $plan.add(collectionFn);
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
                    item_top = $(item).offset().top,
                    winH = $(window).scrollTop();
                // 如果当前容器的offsetTop已经小于window.scrollTop 就不再触发展示容器的创建和显示
                if (item_top < winH) return;
                // 如果已经创建过对应的展示容器 就直接展示
                if ($(item).data('bind_id')) {
                    let item_posBox = $("#" + $(item).data('bind_id'));
                    // 如果屏幕尺寸发生了改变，那就需要重新获取展示载体的最新offsetLeft 和offsetTop，然后重新设置定位盒子的top和left
                    if (_watch) {
                        let item_left = $(item).parent().offset().left,
                            item_top = $(item).parent().offset().top;
                        // 设置最新的定位
                        item_posBox.parent().parent().css({
                            top: item_top - 20,
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
                                    'index': i
                                });
                            }
                        }
                    }
                    createElm(item, _data[$(item).data('index')]);
                }
            }
        });
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
                                    <video src="${video_src}" loop="loop" style="background: url('${video_bg}') center center / cover no-repeat transparent;">
                                        <img src="" class="figure_video_poster" alt="">
                                    </video>
                                    <div class="figure_video_start">
                                        <i class="icon_l icon_play_l"></i>
                                    </div>
                                    <div class="figure_video_tools none">
                                        <span class="figure_info">0秒</span>
                                        <span class="figure_mute muted">
                                            <i class='icon iconfont icon_novolume'></i>
                                            <i class='icon iconfont icon_volume'></i>
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div class="video_content">
                                <div class="video_title" title="${video_title}">
                                    ${
                                        video_title.split(' ').map((item, index) => {
                                            if (index === 0) {
                                                return `<a href="" class="tit">${item}</a>`;
                                            }
                                            return `<span class="type">${item}</span>`
                                        }).join(" ")
                                    }
                                </div>
                                <div class="video_tags" title="${video_tags}">
                                        <span class="tag_tit">主演：</span>
                                    ${
                                        video_tags.split('/').map(function (item, index) {
                                            if (index === 0) {
                                                return `<span class="tag_tit">${item}</span>`
                                            }
                                            return `<span class="line">/</span><span class="tag_tit">${item}</span>`
                                        }).join("")
                                    }
                                </div>
                                <div class="video_recommend">
                                    <span class="recommend_tit">推荐：</span>
                                    <span class="recommend_txt" title="${recommend_txt}">
                                        ${
                                            recommend_txt.replace(/h1([\w\W]+)h1/i, (...arg)=> {
                                                return `<span class="h1">${arg[1]}</span>`;
                                            })
                                        }
                                    </sapn>
                                </div>
                                <div class="video_review">
                                    <span class="review_name">点评：</span>
                                    <span class="review_txt" title="${review_txt}">${review_txt}</span>
                                </div>
                                <div class="video_btn">
                                    <span class="video_btn_half _follow">
                                    <a href="javascript:;" class="z_figure_collect" title="加入看单">
                                        <i class="icon iconfont icon_collect"></i>
                                        <i class="icon iconfont icon_collected"></i>
                                    </a>
                                    </span>
                                    <span class="link">|</span>
                                    <span class="video_btn_half _down" title="用客户端下载视频">
                                    <a href="javascript:;" class="z_figure_dl">
                                        <i class="icon iconfont icon_dl"></i>
                                        <i class="icon iconfont icon_dl_disabled"></i>
                                    </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>`;
        // 追加创建的展示容器
        x_poster_card.append(str);
        // 展示容器，追加动画效果
        $("#" + $(item).data('bind_id')).parent().parent().addClass('ani_x_card_hover').siblings().removeClass('ani_x_card_hover');
        $plan.fire(item);
    };
    $.fn[plug] = function (options) {
        $.extend(this, _default, options);
        let that = this;
        // 监控窗口的变换
        watchWidth();
        $.ajax({
            url: that.url,
            method: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $(that).on({
                    'mouseover': function (e) {
                        obtain(e, data);
                    }
                })
            },
            error: function (data) {

            }
        });

    }
}, 'imgOver');

$(document).imgOver({
    url: 'json/yb/custommovie.json'
});