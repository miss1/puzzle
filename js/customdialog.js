/**
 * Created by Administrator on 2017/2/13.
 */

//弹出提示框
function alertBox(title, content, callback) {
    GenerateHtml(title, content);
    btnOk(callback);
    btnNo();
}

//弹出框结构
function GenerateHtml(title, content) {
    var _html = '';
    _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">'+ title +'</span>';
    _html += '<div id="mb_content">' + content +'</div>';
    _html += '<div id="mb_btnbox"><input id="mb_btn_ok" type="button" value="确定"/><input id="mb_btn_no" type="button" value="取消"/></div>';
    _html += '</div>';
    //必须先将_html添加到body，再设置Css样式
    $("body").append(_html);
    GenerateCss();
    $("#mb_box,#mb_con").fadeIn();
}

//弹出框样式
function GenerateCss() {
    $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
        filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6', display: 'none'
    });
    $("#mb_con").css({ zIndex: '999999', position: 'fixed', display: 'none',
        backgroundColor: 'White', borderRadius: '15px'
    });
    $("#mb_tit").css({ display: 'block', fontSize: '16px', color: '#444', padding: '10px 15px',
        backgroundColor: '#DDD', borderRadius: '15px 15px 0 0',
        borderBottom: '3px solid #009BFE', fontWeight: 'bold', textAlign: 'center'
    });
    $("#mb_content").css({ padding: '20px', lineHeight: '20px',
        borderBottom: '1px dashed #DDD', fontSize: '15px', color: '#444', textAlign: 'center'
    });
    $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'center' });
    $("#mb_btn_ok,#mb_btn_no").css({ width: '85px', height: '30px', color: 'white', border: 'none' });
    $("#mb_btn_ok").css({ backgroundColor: '#168bbb' });
    $("#mb_btn_no").css({ backgroundColor: 'gray', marginLeft: '20px' });
    var _widht = document.documentElement.clientWidth;  //屏幕宽
    var _height = document.documentElement.clientHeight; //屏幕高
    var boxHeight = $("#mb_con").height();
    if (_widht > 700){
        $("#mb_con").css('width', 400);
    }else {
        $("#mb_con").css('width', _widht - 100);
    }
    //让提示框居中
    var boxWidth = $("#mb_con").width();
    $("#mb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
}

//点击确定
function btnOk(callback) {
    $("#mb_btn_ok").click(function () {
        $("#mb_box,#mb_con").fadeTo("slow", 0.01, function () {
            $("#mb_box,#mb_con").remove();
        });
        if (typeof (callback) == 'function') {
            callback();
        }
    });
}

//点击取消
function btnNo() {
    $("#mb_btn_no").click(function () {
        $("#mb_box,#mb_con").fadeTo("slow", 0.01, function () {
            $("#mb_box,#mb_con").remove();
        });
       // $("#mb_box,#mb_con").remove();
    });
}