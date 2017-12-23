/**
 * Created by yangbo on 2017/11/24.
 */
/*姬利*/

//顶部宣传
~function(){
    let $site_head_drawer=$('.site_head_drawer '),
        $head_drawer_bait=$('.head_drawer_bait'),
        $head_drawer_inner_wrap=$('.head_drawer_inner_wrap'),
        $head_drawer_inner=$('.head_drawer_inner'),
        $close=$('#close '),//关闭右侧X按钮

        $drawer_switch=$('.drawer_switch'),
        $drawer_btn_prev=$('.drawer_btn_prev'),//右按钮
        $drawer_btn_next=$('.drawer_btn_next'),//左按钮
        $site_head_l=$('#site_head_l');

    //下箭头
        $head_drawer_bait.on('click',function () {
            $(this).css('height','0');
            $head_drawer_inner.css('marginTop','-20px');
            $head_drawer_inner_wrap.css('height','372px');
            $site_head_l.removeClass('site_head_drawer_hide');
        });

        // 上箭头处理
        $drawer_switch.on('click',function () {
            $head_drawer_inner_wrap.css('height','');
            $head_drawer_bait.css('height','');
            $head_drawer_inner.css('marginTop','-120px');
            $site_head_l.addClass('site_head_drawer_hide');
        });

        //顶部轮播切换
        $drawer_btn_next.on('click',function () {
            $(".drawer_item:lt(6)").css('display','none');
            $(this).css('visibility','hidden');
            $drawer_btn_prev.css('visibility','visible');
            $drawer_btn_prev.css('opacity','1');

        });
        $drawer_btn_prev.on('click',function () {
            $(".drawer_item:lt(6)").css('display','inline-block');
            $(this).css('visibility','hidden');
            $drawer_btn_next.css('visibility','visible');
        });

        //关闭按钮处理
        $close.on('click',function () {
            $site_head_drawer.css('display','none');
        });
}();


//轮播
let bannerRender=(function () {
        let $banner_Container=$('.banner_Container'),
            $wrapper=$banner_Container.find('.wrapper'),
            $banner_focus=$('.banner_focus'),
            $slideList=null,
            $imgList=null,
            $focusList=null;


        let initIndex=-1,
            autoSetTimer=null,//定时器
            auto=null,
            autoTimer=3000;

        let $plan=$.Callbacks();
        //获取数据
            $plan.add((result)=>{
                    let str1=``,
                        str2=``;
                    for (let i = 0; i < result.banner.length; i++) {
                        let item=result.banner[i];
                        str1+=`<li><a href="${item.link}"><img src="" data-img="${item.img}" alt="" ></a></li>`;
                        str2+=`<a href="${item.link}" class="focus_link ${i.className=i===initIndex?'select':null}">
                  <div class="focus_tit">${item.title}</div>
                  <div class="focus_txt">${item.text}</div>
              </a>`;
                    }
                    $wrapper.html(str1);
                    $banner_focus.html(str2);

                $slideList=$banner_Container.find('li');
                $imgList=$banner_Container.find('img');
                $focusList=$banner_focus.find('a');
            });
        //渲染页面
            $plan.add(result=>{
                $imgList.each((index,item)=>{
                    lazyImg($imgList.eq(index));
                });

                function lazyImg(curImg) {
                    let $Img=$(new Image);
                    $Img.on('load',function () {
                        curImg.css('display','block').attr('src',$(this).attr('src'))
                            .animate({
                                opacity:1
                            },500);
                        $Img=null;
                    });
                    $Img.attr("src",curImg.data('img'));
                }
            });

        let getData=function () {
          $.ajax({
              url:'json/jl/banner.json',
              method:'get',
              dataType:'json',
              async:false,
              success:$plan.fire
          });
        };

        let sport=function () {
            autoSetTimer=setInterval(move,autoTimer);
        };
            function move() {
            initIndex++;
            if(initIndex===10){
                initIndex=0;
            }
            change();
        }

        //滑过图片切换
        let pictureSwitch=function () {

            $focusList.on('mouseenter',function () {
                clearInterval(autoSetTimer);
                initIndex=$(this).index();
                auto=setTimeout(change,20);
                // change();
            }).on('mouseleave',function () {
                clearTimeout(auto);
                autoSetTimer=setInterval(move,autoTimer);
            });
        };
            function change() {
            let cur=$slideList.eq(initIndex);
            cur.css('zIndex','1')
                .siblings().css('zIndex','0');
            cur.stop().animate({
                opacity:1
            },0).siblings().css('opacity','0');

            //焦点切换
            $focusList.eq(initIndex).addClass('select').siblings().removeClass('select');
         }

         return{
            init:function () {
                getData();
                sport();
                pictureSwitch();
            }
        }
})();
bannerRender.init();


//回到顶部
~function(){
    let $_top=$('._top '),
        $ft_vcoin_mm=$('.ft_vcoin_mm'),
        $btn_close_J=$ft_vcoin_mm.find('#btn_close_J');


    $btn_close_J.on('click',function () {
        $ft_vcoin_mm.css('display','none');
        $(this).css('display','none');
    });


    $(window).on('scroll',function () {
            let $winH=document.documentElement||document.body,
                {scrollTop:scrollT,clientHeight:winH}=$winH;
            if(scrollT>winH){
                $_top.css('display','block');
            }else {
                $_top.css('display','none');
            }
        $_top.on('click',function () {
           $(window).scrollTop(0);
        });
    })
}();
