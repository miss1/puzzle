var imgOrigArr = [];  //图片的正确顺序
var imgRandArr = [];  //图片打乱后的顺序
var width;           //整张图片的宽度
var height;          //整张图片的高度
var cellWidth;       //每一碎块的宽度
var cellHeight;      //每一碎块的高度
var moveTime = 400;  //记录animate动画的运动时间，默认400毫秒

var imgCells = '';    //记录碎片节点

var lever = 3;      //难度 3x3

var isInGame = false;       //标记是否在游戏中
var scroe = 0;        //游戏步数

var presentImg;          //当前图片
var passImg = [];        //已经通关的图片
var passKnowledge = {};  //已经获取到的气象知识点

var s = 0;

function initGame(img, clicktarger) {
    presentImg = img;
    $("#btn").unbind();    //移除所有的事件绑定
    $("#level").unbind();
    $("#game_result span").unbind();
    lever = 3;
    $("#level").text("level: " + lever + "x" + lever);

    $("#imgArea").fadeIn();
    $("#game_reward").fadeOut();

    $("#game_result span").text("show");
    s = 0;

    if ($.inArray(img, passImg) != -1){
        $("#gameAnswer").text(passKnowledge[img]);
        $("#game_result span").css('background', '#62baa0');
        $("#game_result span").click(function () {
            if (s == 0){
                showReward(img);
            }else {
                showback();
            }
        });
    }else {
        $("#game_result span").css('background', '#5E5E5E');
    }

    if (isInGame){
        alertBox("切换图片", "游戏正在进行，确定要切换图片重新开始吗？", function () {
            removeSclection();
            changeState(clicktarger);

            imgSplit(img);
            $("#btn").text("开始");
            isInGame = false;
            scroe = 0;
            $("#scroe").text("步数：0");
        })
    }else {
        if (clicktarger != undefined){
            removeSclection();
            changeState(clicktarger);
        }
        imgSplit(img);
    }

    bindbtn();
    bindlevel();
}

//绑定开始按钮
function bindbtn() {
    //开始/复原游戏
    $("#btn").click(function () {
        $("#imgArea").fadeIn();
        $("#game_reward").fadeOut();
        if (isInGame){
            alertBox("复原游戏", "游戏正在进行，确定要复原吗？", function () {
                imgSplit(presentImg);
                rebackGame();
            })
        }else {
            imgSplit(presentImg);
            randomArr();
            cellOrder(imgRandArr);
            beginGamePc();
            beginGamePhone();
            $("#btn").text("复原");
            isInGame = true;
            scroe = 0;
            $("#scroe").text("步数：0");
        }
    });
}

//绑定选择难度按钮
function bindlevel() {
    //切换难度
    $("#level").click(function () {
        if (isInGame){
            alertBox("重新开始", "游戏尚未结束，确定要切换难度重新开始吗？", function () {
                if (lever < 6){
                    lever += 1;
                }else {
                    lever = 3;
                }
                imgSplit(presentImg);
                rebackGame();
                $("#level").text("level: " + lever + "x" + lever);
            })
        }else {
            if (lever < 6){
                lever += 1;
            }else {
                lever = 3;
            }
            imgSplit(presentImg);
            $("#level").text("level: " + lever + "x" + lever);
        }
    });
}

//复原游戏
function rebackGame() {
    imgCells.unbind("mouseover");
    imgCells.unbind("mouseout");
    imgCells.unbind("mousedown");
    imgCells.off("touchstart");
    $("#btn").text("开始");
    isInGame = false;
    scroe = 0;
    $("#scroe").text("步数：0");
}

//切割图片
function imgSplit(img) {
    width = $("#imgArea").width();
    height = $("#imgArea").height();
    cellWidth = width/lever;
    cellHeight = height/lever;

    imgOrigArr = [];
    imgRandArr = [];
    var cell = '';   //记录单个图片碎片的变量
    $("#imgArea").html("");
    for (var i = 0; i < lever; i++){
        for (var j = 0; j < lever; j++){
            imgOrigArr.push(i*lever+j);
            cell = document.createElement("div");
            cell.className = "imgCell";
            $(cell).css({width: cellWidth - 2, height: cellHeight - 2, left: j * cellWidth, top: i * cellHeight, background: "url('"+ img +"')", backgroundPosition: (-j)*cellWidth + 'px ' + (-i)*cellHeight + 'px'});
            $("#imgArea").append(cell);
        }
    }
    imgCells = $(".imgCell");
    imgCells.css('cursor', 'pointer');
}

//开始游戏(pc)
function beginGamePc() {

    imgCells.bind("mouseover", function () {
        $(this).addClass("hover");
    });

    imgCells.bind("mouseout", function () {
        $(this).removeClass("hover");
    });

    imgCells.bind("mousedown", function (e) {
        /*此处是图片移动*/
        $(this).css('cursor','move');

        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.pageX - $(this).offset().left;
        var cell_mouse_y = e.pageY - $(this).offset().top;

        //拖动碎片
        $(document).bind("mousemove", function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).bind("mouseup", function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.pageX - $("#imgArea").offset().left, e3.pageY - $("#imgArea").offset().top, cellIndex_1);
            //console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }
            //移除绑定
            $(document).unbind('mousemove').unbind('mouseup');
        })
    });

    imgCells.bind("mouseup", function () {
        $(this).css('cursor','pointer');
    })
}

//开始游戏(phone)
function beginGamePhone() {
    imgCells.on('touchstart', function (e) {
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.touches[0].pageX - $(this).offset().left;
        var cell_mouse_y = e.touches[0].pageY - $(this).offset().top;
        $(document).on('touchmove', function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.touches[0].pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.touches[0].pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).on('touchend', function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.changedTouches[0].pageX - $("#imgArea").offset().left, e3.changedTouches[0].pageY - $("#imgArea").offset().top, cellIndex_1);
            //console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }
            //移除绑定
            $(document).off('touchmove').off('touchend');
        })
    });
}

//打乱数组顺序
function randomArr() {
    imgRandArr = [].concat(imgOrigArr);   //将顺序的数组值赋给新数组之后打乱顺序
    for (var i = 0; i < imgOrigArr.length; i++){
        imgRandArr.sort(function () {
            return 0.5 - Math.random();
        });
    }
    /*console.log("before:"+imgOrigArr);
    console.log("after:"+imgRandArr);*/
}

//根据打乱的数组给图片排序
function cellOrder(arr) {
    for (var i = 0; i < arr.length; i++){
        imgCells.eq(i).animate({
            left: arr[i] % lever * cellWidth,
            top: Math.floor(arr[i] / lever) * cellHeight     //Math.floor向下取值（1.6为1）
        }, moveTime);
    }
}

//计算被交换碎片的下标
function cellChangeIndex(x, y, index1) {
    //鼠标拖动碎片移至大图片外
    if (x < 0 || x > width || y < 0 || y > height){
        return index1;
    }
    //鼠标拖动碎片在大图范围内移动
    var row = Math.floor(y / cellHeight);
    var col = Math.floor(x / cellWidth);
    var position = row * lever + col;
    
    var i = 0;
    while ((i < imgRandArr.length) && (imgRandArr[i] != position)){
        i++;
    }
    return i;
}

//被拖动的图片返回原位置
function cellReturn(index) {
    var row = Math.floor(imgRandArr[index]/lever);
    var col = imgRandArr[index] % lever;

    imgCells.eq(index).animate({
        left: col * cellWidth,
        top: row * cellHeight
    }, moveTime, function () {
        imgCells.eq(index).css('z-index','10');
    })
}

//交换图片位置
function cellExchange(indexfrom, indexto) {
    var rowform = Math.floor(imgRandArr[indexfrom] / lever);
    var colform = imgRandArr[indexfrom] % lever;
    var rowto = Math.floor(imgRandArr[indexto] / lever);
    var colto = imgRandArr[indexto] % lever;

    //交换图片的位置
    imgCells.eq(indexfrom).animate({
        left: colto * cellWidth,
        top: rowto * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexfrom).css('z-index','10');
    });

    imgCells.eq(indexto).css('z-index','30').animate({
        left: colform * cellWidth,
        top: rowform * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexto).css('z-index','10');

        //交换存储的数据
        var temp = imgRandArr[indexfrom];
        imgRandArr[indexfrom] = imgRandArr[indexto];
        imgRandArr[indexto] = temp;

        $("#scroe").text("步数：" + (scroe+=1));

        //判断是否完成全部移动，可以结束游戏
        if (checkPass(imgOrigArr, imgRandArr)){
            passGame();
        }
    })
}

//判断是否完成全部移动，可以结束游戏
function checkPass(rightArr, puzzleArr) {
    if (rightArr.toString() == puzzleArr.toString()){
        return true;
    }
    return false;
}

//成功完成游戏之后的处理
function passGame() {
    if ($.inArray(presentImg, passImg) == -1){
        passImg.push(presentImg);

        $("#gameAnswer").text('Complete: ' + scroe);
        passKnowledge[presentImg] = 'Complete: ' + scroe;

        rebackGame();

        $("#game_result span").css('background', '#62baa0');
        $("#game_result span").click(function () {
            if (s == 0){
                showReward(presentImg);
            }else {
                showback();
            }
        });
    }else {
        $("#gameAnswer").text('Complete: ' + scroe);
        passKnowledge[presentImg] = 'Complete: ' + scroe;

        rebackGame();

        console.log("info:"+passKnowledge[presentImg]);
        showReward(presentImg);
    }
}

//展示游戏成功之后的界面
function showReward(img) {
    $("#imgArea").fadeOut();
    $("#game_reward").fadeIn();
    $("#btn").unbind();
    $("#level").unbind();
    $("#game_result span").text("back");
    $("#game_reward").css('background', 'url('+ img +')');
    s = 1;
}

//返回游戏界面
function showback() {
    $("#imgArea").fadeIn();
    $("#game_reward").fadeOut();
    bindbtn();
    bindlevel();
    $("#game_result span").text("show");
    s = 0;
}