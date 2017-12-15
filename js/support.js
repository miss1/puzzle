/**
 * Created by Administrator on 2017/1/16.
 */
documentWidth = window.innerWidth;
documentHeight = window.innerHeight;

/*bmob后端云相关*/
var APPLICATIONID = "cc41b6fbd69c6e48da4b16d9e197337a";
var RESTAPIKEY = "d6a24c39ec32e986376dbd7f96460fb7";

$(document).ready(function () {
    setBgPic();
});

//设置背景图
function setBgPic() {
    $("body").css('background', 'url("'+ '../img/bg_sunny.png' +'")');
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

//从服务器中获取气象小知识
function queryKnowledge(idname, callback) {
    var knowledge = Bmob.Object.extend("knowledge");
    var query = new Bmob.Query(knowledge);
    var sing = (parseInt(Math.random() * 15)).toString();
    console.log(sing);
    query.equalTo("sing", sing);
    query.find({
        success:function (result) {
            if (result.length != 0){
                console.log(result[0].get("content"));
                $("#"+idname).text(result[0].get("content"));
                if (typeof (callback) == 'function'){
                    callback(result[0].get("content"));
                }
            }
        },
        error:function (err) {
            console.log("query fail");
        }
    });
}