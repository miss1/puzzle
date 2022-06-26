/**
 * Created by Administrator on 2017/1/16.
 */
documentWidth = window.innerWidth;
documentHeight = window.innerHeight;

$(document).ready(function () {
    setBgPic();
});

//设置背景图
function setBgPic() {
    $("body").css('background', 'url("'+ './img/bg_sunny.png' +'")');
    if (documentWidth > 700){
        $("body").css('background-size', 'auto '+documentHeight+'px');
        $("body").css('background-repeat', 'repeat');
    }else {
        $("body").css('background-size', documentWidth+'px '+documentHeight+'px');
        $("body").css('background-repeat', 'repeat-y');
    }
}

//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        return decodeURI(r[2]);
    }
    return null;
}
