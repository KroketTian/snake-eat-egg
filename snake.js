/**
 * Created by bin on 2016/5/15.
 */

/**获取html元素*/
    var gamePlay = null;
var gameBSO = null;//上层提示框
var gameB = null;//上层提示框中的开始提示框
var degreeSelectUl = null;//难度选择
var doubleDiv = null;//双人模式
var gameSO = null;//上层提示框中的暂停与结束提示框
var gameSOTopTipOne = null;//上层提示框中暂停与结束框第一个TIP
var gameSOTopTipTwo = null;//上层提示框中暂停与结束框第二个TIP
var gameSTABt = null;//开始游戏按钮
var gameSOSTABt = null;//重新开始按钮
var gameSOBBt = null;//结束游戏按钮
var gameBB = null;//蓝色提醒字
var author = null;//作者提示框

var scoreText = null;
var scoreDiv = null;
//var testDiv = null;

/**全局变量*/
var width = 25;//游戏中每格的长度
var screenCol = null;//行数
var screenVol = null;//列数
var bodyColor = "rgb(188,166,099)";//蛇身颜色
var headColor = "rgb(126,144,013)";//蛇头颜色
var eggColor = "yellow";//蛋颜色
var state = "B";//游戏状态，默认为B
var snakes = new Array;
var eggs = new Array;
var paintId;//打印的IntervalId
var degree;//选择等级
var double = 1;//是否开启双人模式，1为单人，2为双人模式
var scoreGetText = "";  //分数信息

window.onload = function(){
    gamePlay = document.getElementById("gamePlay"); //游戏区域
    gameBSO = document.getElementById("gameBSO");//上层提示框
    gameB = document.getElementById("gameB");//上层提示框中的开始提示框
    degreeSelectUl = document.getElementById("degreeSelectUl");//难度选择
    doubleDiv = document.getElementById("double"); //双人模式选择
    gameSO = document.getElementById("gameSO");//上层提示框中的暂停与结束提示框
    gameSOTopTipOne = document.getElementById("gameSOTopTipOne");//上层提示框中暂停与结束框第一个TIP
    gameSOTopTipTwo = document.getElementById("gameSOTopTipTwo");//上层提示框中暂停与结束框第二个TIP

    gameSTABt = document.getElementById("gameSTABt");//三个按钮
    gameSOSTABt = document.getElementById("gameSOSTABt");
    gameSOBBt = document.getElementById("gameSOBBt");

    gameBB = document.getElementById("gameBB");//蓝色提醒字
    author = document.getElementById("author");//作者提示框

    scoreText = document.getElementById("scoreText");
    scoreDiv = document.getElementById("scoreDiv");
    //testDiv = document.getElementById("testDiv");

    //初始状态为B
    stateToFun("B");
    //设置行数
    screenCol = gamePlay.offsetHeight/width;
    screenVol = gamePlay.offsetWidth/width;

    //难度选择
    degreeSelectUl.onclick = degreeSelect;
    /*给按钮添加事件*/
    gameSTABt.onclick = gameSBtClickFun;
    gameSOSTABt.onclick = gameSOSTABtClickFun;
    gameSOBBt.onclick = gameSOBBtClickFun;
    // 监听键盘事件
    document.onkeydown = function(event){
        event = event ? event : window.event;
        if(event.keyCode == 32){   //空格键
            stopOrAgainFun(state);
        }else if(event.keyCode == 37 || event.keyCode == 38 //上下左右
            || event.keyCode == 39 || event.keyCode == 40
            ||event.keyCode == 87 || event.keyCode == 65  // w a s d
            ||event.keyCode == 83 || event.keyCode == 68){
            fangFun(state,event.keyCode);
        }
    };
};

/**
 按钮事件的方法
 一共三个按钮
 */
//开始游戏按钮
function gameSBtClickFun(){
    stateToFun("STA");
}
//重新开始按钮
function gameSOSTABtClickFun(){
    stateToFun("STA");
}
//结束游戏按钮
function gameSOBBtClickFun(){
    stateToFun("I");
    setTimeout(function(){
        stateToFun("B");
    },700);
}
/**
 * 键盘事件的方法
 * */
//空格键
function stopOrAgainFun(statea){
    if(statea == "STO"){
        stateToFun("I");
    } else if(statea == "I"){
        stateToFun("STO");
    }
}
//方向键
function fangFun(statea,keyNum){
    if(snakes.length > 0){
        if(double == 2){
            if(keyNum == 38){
                    snakes[0].setDir("U");
            }else if(keyNum == 40){
                    snakes[0].setDir("D");
            }else if(keyNum == 39){
                    snakes[0].setDir("R");
            }else if(keyNum == 37){
                    snakes[0].setDir("L");
            }else if(keyNum == 87){
                snakes[1].setDir("U");
            }else if(keyNum == 65){
                snakes[1].setDir("L");
            }else if(keyNum == 83){
                snakes[1].setDir("D");
            }else if(keyNum == 68){
                snakes[1].setDir("R");
            }
        }else{
            if(keyNum == 38){
                snakes[0].setDir("U");
            }else if(keyNum == 40){
                snakes[0].setDir("D");
            }else if(keyNum == 39){
                snakes[0].setDir("R");
            }else if(keyNum == 37){
                snakes[0].setDir("L");
            }
        }
    }
    if(statea == "STA"){          //若为准备状态，则运行游戏
        gameBB.style.display = "none";
        stateToFun("I");
    }
}

/**
 * 难度选择： degreeSelectDiv的点击效果事件
 * */
function degreeSelect(event){
    var endLightIntervalId = null;
    var degreeLi = event.target ? event.target : window.event.srcElement;
    if(degreeLi.classList.contains("select")){    //如果点击的li已经点亮
        var degreeLiNext = degreeLi.nextElementSibling;
        endLightIntervalId = setInterval(function(){
            if(degreeLiNext == null || !degreeLiNext.classList.contains("select")){
                clearInterval(endLightIntervalId);
                endLightIntervalId = null;
            }else{
                degreeLiNext.classList.remove("select");
                degreeLiNext = degreeLiNext.nextElementSibling;
            }
        },50);
    }else{   //如果点击的li还没点亮
        degreeLi.classList.add("select");
        var degreeLiLast = degreeLi.previousElementSibling;
        endLightIntervalId = setInterval(function(){
            if(degreeLiLast == null || degreeLiLast.classList.contains("select")){
                clearInterval(endLightIntervalId);
                endLightIntervalId = null;
            }else{
                degreeLiLast.classList.add("select");
                degreeLiLast = degreeLiLast.previousElementSibling;
            }
        },50);
    }
}
/**
 * 获取难度大小： 返回难度大小
 * */
function getDegree(){
    var degreelis = document.getElementsByClassName("select");
    for(var i = 0 ; i < degreelis.length ; i++){
    }
    return i;
}
/**获取是否选择双人模式：若是则double = 2,否则double = 1
 * */
function getDouble(){
    if(doubleDiv.checked){
        double = 2;
    }else{
        double = 1;
    }
}

/*模块滑上*/
function blockSlideUp(box,slideTo,time,fun){
    var boxTop = box.offsetTop;
    var slideMove = (boxTop-slideTo)/time;
    var blockSlideIntervalId = null;
    blockSlideIntervalId = setInterval(function(){
        boxTop = box.offsetTop;
        if(boxTop <= slideTo){
            clearInterval(blockSlideIntervalId);
            blockSlideIntervalId = null;
            if(fun && typeof fun == "function"){
                fun();
            }
        }else{
            box.style.top = (box.offsetTop-slideMove)+"px";
        }
    },time);
}
/*模块滑下*/
function blockSlideDown(box,slideTo,time,fun){
    var boxTop = box.offsetTop;
    var slideMove = (boxTop-slideTo)/time;
    var blockSlideDIntervalId = null;
    blockSlideDIntervalId = setInterval(function(){
        boxTop = box.offsetTop;
        if(boxTop >= slideTo){
            clearInterval(blockSlideDIntervalId);
            blockSlideDIntervalId = null;
            if(fun && typeof fun == "function"){
                fun();
            }
        }else{
            box.style.top = (boxTop-slideMove)+"px";
        }
    },time);
}
/**
 * 制定gameBSOFun类： 根据参数对应状态gameBSO模块(除游戏模块)响应情况
* state表示状态:B：准备
*               STA：准备开始（有蓝字）
*               I：游戏中
*               STO：暂停
*               O：gameOver
* */
function gameBSOFun(state){
    if(state == "B"){
        gameB.style.display = "block";
        gameSO.style.display = "none";
        blockSlideDown(gameBSO,-5,20,null);
        blockSlideUp(author,450,20,null);
    }else if(state == "STA"){
        blockSlideUp(gameBSO,-350,20,null);
        blockSlideDown(author,500,20,null);
    }else if(state == "I"){
        blockSlideUp(gameBSO,-350,20,null);
        blockSlideDown(author,500,20,null);
    }else if(state == "STO"){
        gameB.style.display = "none";
        gameSOTopTipOne.innerHTML = "暂停中……";
        gameSOTopTipTwo.innerHTML = "按【空格键】重新开始";
        gameSO.style.display = "block";
        blockSlideDown(gameBSO,-5,20,null);
        blockSlideUp(author,450,20,null);
    }else if(state == "O"){
        gameB.style.display = "none";
        gameSOTopTipOne.innerHTML = "总得分：" + scoreGetText;
        gameSOTopTipTwo.innerHTML = "gameOver";
        gameSO.style.display = "block";
        blockSlideDown(gameBSO,-5,20,null);
        blockSlideUp(author,450,20,null);
    }
}

/**
 * 根据参数对应状态全部模块响应情况
* 各状态：B：准备
 *         STA：准备开始（有蓝字）
 *         I：游戏中
 *         STO：暂停
 *         O：gameOver
* */
function stateToFun(statea){
    if(statea == "B"){
        gameBSOFun("B");
        gameBB.style.display = "none";
        scoreDiv.style.display = "none";

        snakes = [];  //清空蛇与蛋
        eggs = [];
        stopRun();    //停止游戏
        paint();     //打印一次（更新清空蛇与蛋后的画面）
        state = "B";
    }else if(statea == "STA"){
        gameBSOFun("STA");
        gameBB.style.display = "block";
        scoreDiv.style.display = "block";

        snakes = [];  //初始化蛇与蛋
        eggs = [];
        degree = getDegree();  //获取等级
        getDouble();  //获取是否双人模式
        if(double == 2){       //初始化蛇与蛋
            initSnakesAndEggs(2,1);
        }else{
            initSnakesAndEggs(1,1);
        }
        stopRun();
        paintId = setInterval(function(){    //这里开始打印（让初始化的蛇与蛋看的见）
            paint();
            if(double == 2){
                scoreGetText = "playerA-" + snakes[0].score + " playerB-" + snakes[1].score;
            }else{
                scoreGetText = "player-" + snakes[0].score;
            }
            scoreText.innerHTML = scoreGetText;
        },2);
        score = 0;   //清空分数
        state = "STA";
    }else if(statea == "I"){
        gameBSOFun("I");
        gameBB.style.display = "none";
        scoreDiv.style.display = "block";

        gameRun();
        state = "I";
    }else if(statea == "STO"){
        gameBSOFun("STO");
        gameBB.style.display = "none";
        scoreDiv.style.display = "block";

        stopRun();
        state = "STO";
    }else if(statea == "O"){
        stopRun();
        clearTimeout(paintId);   //停止打印
        gameBSOFun("O");
        gameBB.style.display = "none";
        scoreDiv.style.display = "block";
        state = "O";
    }
}
/**
*蛇节点类
* */
function snakeNode(x,y,dir,color){
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.color = color;
}
snakeNode.prototype = {
    constructor : snakeNode,
    move : function(){
        switch (this.dir) {
            case "U":
                this.y -= width;
                break;
            case "D":
                this.y += width;
                break;
            case "L":
                this.x -= width;
                break;
            case "R":
                this.x += width;
                break;
        }
    }
};
/**蛇类
* 属性：snakeDir 蛇头移动方向
*       snakeNodes 蛇的节点数组
 *       score 蛇的得分
* 方法：setDir(dir) 设置蛇的方向
 *      grow()   //长长一个节点
*       growhead()   长出一个头
*       move()   整条蛇移动一格
*       hitWall()  监测是否撞到墙,当撞到墙是返回1,否则返回0
 *      hitegg() 监测是否迟到蛋,当碰到蛋时，体长加一
 *      hitself() 检测是否撞到自己，若撞到自己返回2，否则返回1
* */
function snakeFun(hx,hy,hdir,long){
    this.snakeDir = hdir;
    this.snakeNodes = new Array();
    this.score = 0;
    this.growhead(hx,hy,hdir);
    for(var i = 0 ; i < long ; i++){
        this.grow();
    }
}
snakeFun.prototype = {
    constructor : snakeFun,
    setDir : function(dir){     //设置dir
        if(this.snakeDir != "R" && dir == "L"){
            this.snakeDir = dir;
        }else if(this.snakeDir != "L" && dir == "R"){
            this.snakeDir = dir;
        }else if(this.snakeDir != "D" && dir == "U"){
            this.snakeDir = dir;
        }else if(this.snakeDir != "U" && dir == "D"){
            this.snakeDir = dir;
        }
    },
    grow : function(){            //长长一节
            var lastNode = this.snakeNodes[this.snakeNodes.length-1];
            var lastNodeDir = (lastNode.dir == null) ? "R":lastNode.dir;
            var x;
            var y;
            switch (lastNodeDir){
                case "U":
                    x = lastNode.x;
                    y = lastNode.y + width;
                    break;
                case "D":
                    x = lastNode.x;
                    y = lastNode.y - width;
                    break;
                case "L":
                    x = lastNode.x + width;
                    y = lastNode.y;
                    break;
                case "R":
                    x = lastNode.x - width;
                    y = lastNode.y;
                    break;
            }
            var newNode = new snakeNode(x,y,lastNodeDir,bodyColor);
            this.snakeNodes.push(newNode);
    },
    growhead : function(x,y,dir){
        var newNode = new snakeNode(x,y,dir,headColor);
        this.snakeNodes.push(newNode);
    },
    move : function(){     //整条蛇移动一格
            var i;
            if(this.snakeDir){
                this.snakeNodes[0].dir = this.snakeDir;
            }
            for(i = this.snakeNodes.length-1 ; i > 0 ; i--){
                this.snakeNodes[i].move();
                this.snakeNodes[i].dir = this.snakeNodes[i-1].dir;
            };
            this.snakeNodes[0].move();
    },
    hitWall : function(){     //当撞到墙是返回1,否则返回0
        var re = 0;
        var head = this.snakeNodes[0];
        var gamePlayTop = 0;
        var gamePlayLeft = 0;
        var gamePlayRight = (screenVol-1) * width;
        var gamePlayBottom = (screenCol-1) * width;
        if((head.x < gamePlayLeft) || (head.x > gamePlayRight)
            || (head.y < gamePlayTop) || (head.y > gamePlayBottom)){
            re = 1;
        }
        return re;
    },
    hitegg : function(){   //当碰到蛋时，体长加一，分数加15
        for(var eggI = 0 ; eggI < eggs.length ; eggI++){
            if(eggs[eggI].isInSnake() == 1){
                this.grow();
                this.score += 18;
            }
        }
    },
    hitSelf : function(){     //监测是否碰到蛇，若碰到返回2，否则返回1
        var re = 0;
        var head = this.snakeNodes[0];
        for(var j = 0 ; j < snakes.length ; j++){
            for(var i = 0 ; i < snakes[j].snakeNodes.length ; i++){
                if(head.x == snakes[j].snakeNodes[i].x && head.y == snakes[j].snakeNodes[i].y){
                    re++;
                }
            }
        }
        return re;
    }
};
/**蛋类
 *属性：x
 *      y
 *      color
 *      flag  若为1，则蛋被吃了，若为0，则没被吃
 * 方法：isInSnake  检测蛋是否被蛇吃了，若吃了则返回1，没被吃则返回0
 *       createNewEgg  如果被吃了，则更新x y
 * */
function eggFun(color){
    this.color = color;
    this.x = (Math.random() * (screenVol - 1)).toFixed(0) * width;
    this.y = (Math.random() * (screenCol - 1)).toFixed(0) * width;
    this.flag = 0;
}
eggFun.prototype = {
    constructor : eggFun,
    isInSnake : function(){     //监测蛋是否被蛇吃了，若吃了则返回1，没被吃则返回0
        if(snakes != null && snakes.length > 0){
            for(var i = 0 ; i < snakes.length ; i++){
                for(var j = 0 ; j < snakes[i].snakeNodes.length ; j++){
                    if(snakes[i].snakeNodes[j].x == this.x && snakes[i].snakeNodes[j].y == this.y){
                        this.flag = 1;
                        break;
                    }
                }
                if(this.flag == 1){
                    break;
                }
            }
        }
        return this.flag;
    },
    createNewEgg : function(){    //如果被吃了，则更新x y
        if(this.isInSnake() == 1){
            this.x = (Math.random() * (screenVol - 1)).toFixed(0) * width;
            this.y = (Math.random() * (screenCol - 1)).toFixed(0) * width;
            this.flag = 0;
        }
    }
};
//新建蛇与蛋
function initSnakesAndEggs(snakeNum,eggNum){
    for(var i = 0 ; i < snakeNum ; i++){
        var snake = new snakeFun(100*(i+1),100*(i+1),"R",2);
        snakes.push(snake);
    }
    for(var j = 0 ; j < eggNum ; j++ ){
        var egg1 = new eggFun(eggColor);
        eggs.push(egg1);
    }

}
//开始游戏
var runInterval;
function gameRun(){
    if(runInterval){
        clearInterval(runInterval);
    }
    runInterval = setInterval(function(){
        for(var snakeI=0; snakeI<snakes.length; snakeI++){

            snakes[snakeI].move();
            //snakes[snakeI].hitWall();
            snakes[snakeI].hitegg();
            if(snakes[snakeI].hitWall() == 1 || snakes[snakeI].hitSelf() == 2){
                stateToFun("O");
            }
            for(var eggI=0; eggI<eggs.length; eggI++){
                eggs[eggI].createNewEgg();
            }
        }
    },(210-40*degree));
}
//停止游戏
function stopRun(){
    if(runInterval){
        clearInterval(runInterval);
    }
}
/**打印*/
function paint() {
    var innerCnt = "";
    // 打印蛋
    for(var eggI = 0;eggI < eggs.length;eggI++){
        var eggP = eggs[eggI];
        var newEggDiv = "<div class='egg' " + "style='" + "width:" + width
            + "px;height:" + width + "px;left:" + eggP.x + "px;top:" + eggP.y
            + "px;background:" + eggP.color + ";'></div>";
        innerCnt += newEggDiv;
    }
    // 打印蛇
    for(var snakesI = 0;snakesI < snakes.length ; snakesI++){
        for (var i = 0; i < snakes[snakesI].snakeNodes.length; i++) {
            var node = snakes[snakesI].snakeNodes[i];

            var newSnakeNodeDiv = "<div class='snakenode' " + "style='" + "width:"
                + width + "px;height:" + width + "px;left:" + node.x
                + "px;top:" + node.y + "px;background:" + node.color
                + ";'></div>";
            innerCnt += newSnakeNodeDiv;
        }
    }
    //全部添加到gamePlay
    gamePlay.innerHTML = innerCnt;
}