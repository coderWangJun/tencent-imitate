~function ($) {
    function PluginChangeBg() {
        let $container = this;

        ~function () {
            $container.on("mouseover", function (e) {
                let $target = $(e.target);

                $target.parents().each(function (index, item) {

                    if ($(item).hasClass("imgLink")) {

                        let $figure_keyframes_mask = $(item).find(".figure_keyframes_mask"),
                            $figure_keyframes_pic = $(item).find(".figure_keyframes_pic"),
                            $figure_keyframes_outer = $(item).find(".figure_keyframes_outer");

                        //判断如果大图不存在，大图的alt值为空，mark层及进度条不再显示
                        if($(item).find(".figure_keyframes_pic").attr("src")===""){
                            $(item).find(".figure_keyframes_pic").attr("alt","").siblings().css("opacity", 0);
                        }
                        $figure_keyframes_pic.css("display", "block");//大图呈现
                        $figure_keyframes_mask.css("display", "block");//mark显示
                        $figure_keyframes_outer.css("display", "block");//进度条显示
                    }
                });
            });
        }();

        ~function () {
            $container.on("mousemove", function (e) {
                let $target = $(e.target);
                $target.parents().each(function (index, item) {

                    if ($(item).hasClass("imgLink")) {
                        let $figure_keyframes = $(item).find(".figure_keyframes"),
                            $figure_keyframes_pic = $(item).find(".figure_keyframes_pic"),
                            $figure_keyframes_inner = $(item).find(".figure_keyframes_inner"),
                            $figure_keyframes_outer = $(item).find(".figure_keyframes_outer"),
                            maxW = $figure_keyframes.outerWidth() - 8,//鼠标移动的最大值
                            proW = $figure_keyframes_outer.outerWidth(),//底条宽度
                            curW = $figure_keyframes.outerWidth();//大图父级盒子的宽度

                        //当前鼠标位置距离$figure_keyframes的距离
                        let strW = e.pageX - $figure_keyframes.offset().left - 4;

                        //边界判断
                        strW = strW < 4 ? strW : (strW > maxW ? maxW : strW);
                        //白色进度条的进度
                        $figure_keyframes_inner.css("width", strW / proW * 100 + "%");
                        //根据大图中各个小图距离左边、上边的距离定义成一个二维数组。
                        let L = $figure_keyframes.outerWidth(),
                            T = $figure_keyframes.outerHeight();
                        let ary = [[0, -L, -L * 2], [0, -T, -T * 2]];
                        //let ary = [[0, -194, -388], [0, -137, -274]];

                        //通过解构赋值，得到每一张图片在大图中的位置。
                        let [[, a,], [b, ,]] = ary;
                        let [[, , c], [d, ,]] = ary;
                        let [[f, ,], [, g,]] = ary;
                        let [[, h,], [, i,]] = ary;
                        let [[, , j], [, k,]] = ary;
                        let [[m, ,], [, , n]] = ary;
                        let [[, x,], [, , y]] = ary;

                        let meanValue = curW / 8;

                        if (strW <= meanValue && strW > 0) {
                            $figure_keyframes_pic.css({
                                left: 0,
                                top: 0
                            });
                        }
                        if (strW <= meanValue * 2 && strW > meanValue) {
                            $figure_keyframes_pic.css({
                                left: a,
                                top: b
                            });
                        }
                        if (strW <= meanValue * 3 && strW > meanValue * 2) {
                            $figure_keyframes_pic.css({
                                left: c,
                                top: d
                            });
                        }
                        if (strW <= meanValue * 4 && strW > meanValue * 3) {
                            $figure_keyframes_pic.css({
                                left: f,
                                top: g
                            });
                        }
                        if (strW <= meanValue * 5 && strW > meanValue * 4) {
                            $figure_keyframes_pic.css({
                                left: h,
                                top: i
                            });
                        }
                        if (strW <= meanValue * 6 && strW > meanValue * 5) {
                            $figure_keyframes_pic.css({
                                left: j,
                                top: k
                            });
                        }
                        if (strW <= meanValue * 7 && strW > meanValue * 6) {
                            $figure_keyframes_pic.css({
                                left: m,
                                top: n
                            });
                        }
                        if (strW <= meanValue * 8 && strW > meanValue * 7) {
                            $figure_keyframes_pic.css({
                                left: x,
                                top: y
                            });
                        }
                    }
                });
            });
        }();

        ~function () {
            $container.on("mouseout", function (e) {

                let $target = $(e.target);

                $target.parents().each(function (index, item) {
                    if ($(item).hasClass("imgLink")) {
                        let $figure_keyframes_mask = $(item).find(".figure_keyframes_mask"),
                            $figure_keyframes_pic = $(item).find(".figure_keyframes_pic"),
                            $figure_keyframes_outer = $(item).find(".figure_keyframes_outer");

                        $figure_keyframes_pic.css("display", "none");//大图隐藏
                        $figure_keyframes_mask.css("display", "none");//mark层隐藏
                        $figure_keyframes_outer.css("display", "none");//进度条隐藏
                    }
                });
            });
        }();
    }

    $.fn.extend({
        PluginChangeBg: PluginChangeBg
    });
}(jQuery);