// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var RECT_SIZE_MODE_0 = 160;
var RECT_SIZE_MODE_1 = 80;
var RECT_SIZE_MODE_2 = 57;
var RECT_SIZE_MODE_3 = 40;

var NBRECT_MODE_0 = 5;
var NBRECT_MODE_1 = 10;
var NBRECT_MODE_2 = 14;
var NBRECT_MODE_3 = 20;

var rectSize = RECT_SIZE_MODE_0;
var nbRect = NBRECT_MODE_0;

var CANVAS_WIDTH = rectSize*nbRect;
var CANVAS_HEIGHT = rectSize*nbRect;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

document.getElementById("gameDiv").appendChild(canvas);

var curX;
var curY;

var nbColor = 9;

var selectedLine;
var selectedCol;

var checkGridCounter = 0;
var score = 0;

var KEYLEFT = 37;
var KEYUP = 38;
var KEYRIGHT = 39;
var KEYDOWN = 40;

var KEYLEFT_2 = 81;
var KEYUP_2 = 90;
var KEYRIGHT_2 = 68;
var KEYDOWN_2 = 83;

var SCORE_2X2 = 4;
var TIMER_2X2 = 15;
var SCORE_3X3 = 10;
var TIMER_3X3 = 0;

var MODE_TUTO = 0;
var MODE_TIMER = 1;

var MENU_PAGE = 0;
var TUTORIAL_PAGE = 1;
var ADVENTURE_PAGE = 2;
var TIMER_PAGE = 3;
var COOK_PAGE = 4;

var TIMER_START = 120;

var mode;
var onPlay = false;
var currentPage = MENU_PAGE;
var found;

var timer = TIMER_START;
var timerInterval;

var scoreByBlocks = 0;
var bestScore = 350;

var startCounter;

var counterBeforeStart;

var firstMoveMade = false;
var firstSquareMade = false;
ctx.beginPath();

var refArray = [];

initRefArray();

drawGrid();
document.getElementById('htmlBestScore').value = bestScore;

document.addEventListener("mousemove",onMove, false);


function launchTutoGame()
{
    stopPlaying();
    document.addEventListener("keydown",keydownHandler, false);

    mode = MODE_TUTO;
    rectSize = RECT_SIZE_MODE_0;
    nbRect = NBRECT_MODE_0;
    
    //Init array
    onPlay = true;
    nbColor = 4;
    initRefArray();        

    //Just to be sure to start without a pre-made block
    scoreByBlocks = 0;
    checkGrid3x3();
    checkGrid2x2();
    drawGrid();
    
    //init game score
    score = 0;
    scoreByBlocks = 0;

    firstMoveMade = false;
    firstSquareMade = false;

    document.getElementById('htmlTimer').value = '';
    document.getElementById('htmlScore').value = '';
    writeMsgOnGrid("Put the mouse cursor into a square then try to press z, q, s, d");
}

function prepareToLaunch()
{
    startCounter = 3;
    counterBeforeStart = setInterval(startMessageHandler,1000);
    startMessageHandler();
}

function startMessageHandler()
{
    writeTimeBeforeStart(startCounter)

    if(startCounter == 0)
    {
        drawGrid();
        launch();
    }

    startCounter--;
}

function launchTimerGame()
{
    stopPlaying();


    mode = MODE_TIMER;
    rectSize = RECT_SIZE_MODE_1;
    nbRect = NBRECT_MODE_1;
    
    //Init array
    onPlay = true;
    nbColor = 8;
    initRefArray();
    
    //Just to be sure to start without a pre-made block
    scoreByBlocks = 0;
    checkGrid3x3();
    checkGrid2x2();
    drawGrid();

    //init game timer
    timer = TIMER_START;
    
    //init game score
    score = 0;
    scoreByBlocks = SCORE_3X3;
    
    document.getElementById('htmlTimer').value = timer;
    document.getElementById('htmlScore').value = score;

    prepareToLaunch();
}

function launch()
{
    clearInterval(counterBeforeStart);

    document.addEventListener("keydown",keydownHandler, false);
    timerInterval = setInterval(timerTic, 1000);
}

function stopPlaying()
{
    onPlay = false;
    clearInterval(timerInterval);
    initRefArray();
    drawGrid();
    document.getElementById('htmlTimer').value = '';
}

function timerTic()
{
    timer -= 1;
    document.getElementById('htmlTimer').value = timer;
    
    if(timer == 0)
    {
        stopPlaying();
        
        if(bestScore < score)
        {
            bestScore = score;
            document.getElementById('htmlBestScore').value = bestScore;
        }
    }
}

function keydownHandler(event)
{
    if(!onPlay)
        return;

    var keyCode = event.keyCode;
    var dir;
    found = false;

    switch(keyCode)
    {
        case KEYDOWN:
        case KEYDOWN_2:
            selectedCol = Math.floor(curX/rectSize);
            slideColBot();
            dir = "down" ;
            break;
        case KEYUP:
        case KEYUP_2:
            selectedCol = Math.floor(curX/rectSize);
            slideColTop();
            dir = "up";
            break;
        case KEYLEFT:
        case KEYLEFT_2:
            selectedLine = Math.floor(curY/rectSize);
            slideLineLeft();
            dir = "left";
            break;
        case KEYRIGHT:
        case KEYRIGHT_2:
            selectedLine = Math.floor(curY/rectSize);
            slideLineRight();
            dir = "right";
            break;
    }

    if(mode == MODE_TUTO)
    {
        checkGrid2x2();
        
        if(!firstMoveMade)
        {
            firstMoveMade = true;
            drawGrid();
            writeMsgOnGrid("Did you get it ? You move it "+dir+". Now try to make a 2x2 square");
        }
        else if((!firstSquareMade) && found)
        {
            firstSquareMade = true;
            drawGrid();
            writeMsgOnGrid("Nice move, you can now play in normal mode or continue training.");
        }
        else
        {
            drawGrid();
        }
    }
    else
    {
        checkGrid3x3();
        document.getElementById('htmlScore').value = score;
        drawGrid();
    }
}

function onMove(event)
{
    curX = event.x - canvas.offsetLeft;
    curY = event.y - canvas.offsetTop;
}

function checkGrid2x2()
{
    for(var i = 0 ; i < refArray.length-1; ++i) 
    {
        for(var j = 0; j < refArray[i].length-1; ++j)
        {
            if(refArray[i][j] == refArray[i+1][j])
            {
                if(refArray[i][j] == refArray[i][j+1])
                {
                    if(refArray[i][j] == refArray[i+1][j+1])
                    {
                        score += scoreByBlocks;
                        
                        if(mode != MODE_TUTO)
                        {
                            timer += TIMER_2X2;
                            document.getElementById('htmlScore').value = score;
                        }
                        
                        found = true;
                        repopulateArray(i, j, 2);
                    }
                }
            }
        }
    }
}

function checkGrid3x3()
{
    for(var i = 0 ; i < refArray.length-2; ++i) 
    {
        for(var j = 0; j < refArray[i].length-2; ++j)
        {
            if(refArray[i][j] == refArray[i+1][j])
            {
                if(refArray[i][j] == refArray[i][j+1])
                {
                    if(refArray[i][j] == refArray[i+1][j+1])
                    {
                        if(refArray[i][j] == refArray[i+2][j])
                        {
                            if(refArray[i][j] == refArray[i][j+2])
                            {
                                if(refArray[i][j] == refArray[i+1][j+2])
                                {
                                    if(refArray[i][j] == refArray[i+2][j+1])
                                    {
                                        if(refArray[i][j] == refArray[i+2][j+2])
                                        {
                                            score += scoreByBlocks;

                                            document.getElementById('htmlScore').value = score;
                                            document.getElementById('htmlTimer').value = timer;

                                            found = true;
                                            repopulateArray(i, j, 3);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


function repopulateArray(i, j, size)
{
    refArray[i][j] = getRandomStringColor();

    for(var k = 1; k <= size-1 ; ++k)
    {
        refArray[i+k][j] = getRandomStringColor();
        refArray[i][j+k] = getRandomStringColor();
        refArray[i+(k-1)][j+k] = getRandomStringColor();
        refArray[i+k][j+(k-1)] = getRandomStringColor();
        refArray[i+k][j+k] = getRandomStringColor();
    }
}

function slideLineLeft()
{
    var tmp = refArray[0][selectedLine];

    for(var i = 0; i <= refArray.length-2 ; ++i)
    {
        refArray[i][selectedLine] = refArray[i+1][selectedLine];
    }
    refArray[refArray.length-1][selectedLine] = tmp;
}

function slideLineRight()
{
    var tmp = refArray[refArray.length-1][selectedLine];

    for(var i = refArray.length-1; i != 0 ; --i)
    {
        refArray[i][selectedLine] = refArray[i-1][selectedLine];
    }
    refArray[0][selectedLine] = tmp;
}

function slideColTop()
{
    var tmp = refArray[selectedCol][0];

    for(var i = 0; i <= refArray.length-2 ; ++i)
    {
        refArray[selectedCol][i] = refArray[selectedCol][i+1];
    }
    refArray[selectedCol][refArray.length-1] = tmp;
}

function slideColBot()
{
    var tmp = refArray[selectedCol][refArray.length-1];

    for(var i = refArray.length-1; i != 0 ; --i)
    {
        refArray[selectedCol][i] = refArray[selectedCol][i-1];
    }
    refArray[selectedCol][0] = tmp;
}

function initRefArray()
{
    for(var i = 0 ; i < nbRect ; ++i)
    {
        refArray[i] = new Array();

        for(var j = 0; j < nbRect ; ++j)
        {
            refArray[i].push(getRandomStringColor());
        }   
    }
}

function writeMsgOnGrid(msg)
{
    ctx.fillStyle="black";
    ctx.globalAlpha=0.8;
    ctx.fillRect(0,205, 800, 80);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(msg, 100, 250);
    ctx.globalAlpha=1;
}

function writeTimeBeforeStart(msg)
{
    drawGrid();
    ctx.fillStyle="black";
    ctx.globalAlpha=0.8;
    ctx.fillRect(0,205, 800, 80);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(msg, 398, 250);
    ctx.globalAlpha=1;
}

function drawGrid()
{
    for(var i = 0 ; i < refArray.length; ++i)
    {
        for(var j = 0; j < refArray[i].length ; ++j)
        {
            ctx.fillStyle = refArray[i][j];

            ctx.fillRect(i*rectSize, j*rectSize, rectSize, rectSize);       
            ctx.strokeStyle="black";    
            ctx.strokeRect(i*rectSize, j*rectSize, rectSize, rectSize);   
        }        
    }
}

function getRandomStringColor()
{
    if(!onPlay)
        return "white";

    var random = getRandomInt(0,nbColor);

    switch(random)
    {
        case 0:
            return "#fecd6c";
            break;
        case 1:
            return "#77c298";
            break;
        case 2:
            return "#718dbf";
            break;
        case 3:
            return "#a4547d";
            break;
        case 4:
            return "#e84d60";
            break;
        case 5:
            return "#ffeead";
            break;
        case 6:
            return "pink";
            break;
        case 7:
            return "blue";
            break;
        case 8:
            return "green";
            break;
        case 9:
            return "cyan";
            break;
        case 10:
            return "pink";
            break;
    }
}

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}