/**
 * Created by Administrator on 2017/3/8.
 */
var count = 0;
var limit = 0;

$(document).ready(function () {
    Bmob.initialize(APPLICATIONID, RESTAPIKEY);

    preperforM();
    queryAllImg();
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

//从服务器获取所有图片
function queryAllImg() {
    var puzzle = Bmob.Object.extend("puzzle");
    var query = new Bmob.Query(puzzle);
    query.skip(count);
    query.limit(limit);
    query.find({
        success:function (result) {
            if (result.length != 0){
                var img_html = '';
                if (count == 0){
                    initGame(result[0].get("img"));
                    img_html += "<li class='select'><img src='"+ result[0].get("img") +"' class='imgcontent'></li>";
                }else {
                    img_html += "<li><img src='"+ result[0].get("img") +"' class='imgcontent'></li>";
                }
                count += limit;
                console.log(result);
                for (var i = 1; i < result.length; i++){
                    img_html += "<li><img src='"+ result[i].get("img") +"' class='imgcontent'></li>"
                }
                $("#img_list > li:last-child").before(img_html);
            }
            $("#loading").hide();
        },
        error:function (error) {
            console.log("query fail");
            $("#loading").hide();
        }
    });
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

    //底部滚动事件
    $("#game_footer").scroll(function () {
        var totalSize = 110 * ($("#img_list li").length - 1);
        if ($(this).scrollLeft() + documentWidth == totalSize){
            $("#loading").show();
            queryAllImg();
        }
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

