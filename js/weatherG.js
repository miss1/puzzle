/**
 * Created by Administrator on 2017/3/8.
 */
var count = 0;
var limit = 0;

$(document).ready(function () {
    preperforM();
    initGame($('#img_list').find('img')[0].src);
    initclick();
});

//自适应手机
function preperforM() {
    //$("#game_content").css('height', documentHeight - 190);
    var w;
    if (documentWidth > 700){
        limit = parseInt(documentWidth / 110) + 1;
        w = 300;
        $("#imgArea").css('width', w);
    }else {
        limit = 7;
        w = documentHeight - 270;
        if ($("#imgArea").width() > w){
            $("#imgArea").css('width', w);
        }else {
            w = $("#imgArea").width();
        }
    }
    $("#imgArea").css('height', w);
    $("#game_reward").css({width: w, height: w});
    if (documentHeight - 180 - w > 90){
        $("#game_c").css('height', documentHeight - 180 - w);
    }else {
        $("#game_c").css('height', 90);
    }
}

//点击事件绑定
function initclick() {
    //返回上一页
    $("#game_hrader").click(function () {
        history.go(-1);
    });

    //底部tab栏点击事件
    $("#game_footer ul").on("click", "li", function () {
        console.log($(this).find('img')[0].src);
        initGame($(this).find('img')[0].src, this);
    });
}

//移除选中状态
function removeSclection() {
    $("#game_footer ul li").each(function () {
        $(this).removeClass("select");
    });
}

//改变tab栏状态
function changeState(target) {
    $(target).addClass("select").siblings().removeClass("select");
    //让滚动条定位到所点击的位置
    $("#game_footer").animate({
        scrollLeft: $(target).offset().left - $("#game_footer").offset().left + $("#game_footer").scrollLeft()
    });
}

