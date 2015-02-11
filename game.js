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

var timer = TIMER_START;
var timerInterval;

var bestScore = 350;

ctx.beginPath();

var refArray = [];

initRefArray();

drawGrid();
document.getElementById('htmlBestScore').value = bestScore;

document.addEventListener("mousemove",onMove, false);
document.addEventListener("keydown",keydownHandler, false);

function launchTutoGame()
{
    if(!onPlay)
    {
        onPlay = true;
        mode = MODE_TUTO;
        nbColor = 4;
        rectSize = RECT_SIZE_MODE_0;
        nbRect = NBRECT_MODE_0;
        initRefArray();
        drawGrid();
    }
}

function launchTimerGame()
{
    if(!onPlay)
    {
        onPlay = true;
        mode = MODE_TIMER;
        nbColor = 8;
        rectSize = RECT_SIZE_MODE_1;
        nbRect = NBRECT_MODE_1;
        initRefArray();
        drawGrid();
        timer = TIMER_START;
        timerInterval = setInterval(timerTic, 1000);
        document.getElementById('htmlTimer').value = timer;
    }
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
    
    switch(keyCode)
    {
        case KEYDOWN:
        case KEYDOWN_2:
            selectedCol = Math.floor(curX/rectSize);
            slideColBot();
            break;
        case KEYUP:
        case KEYUP_2:
            selectedCol = Math.floor(curX/rectSize);
            slideColTop();
            break;
        case KEYLEFT:
        case KEYLEFT_2:
            selectedLine = Math.floor(curY/rectSize);
            slideLineLeft();
            break;
        case KEYRIGHT:
        case KEYRIGHT_2:
            selectedLine = Math.floor(curY/rectSize);
            slideLineRight();
            break;
    }

    if(mode == MODE_TUTO)
    {
        checkGrid2x2();
    }
    else
    {
        checkGrid3x3();
    }

    document.getElementById('htmlScore').value = score;
    drawGrid()
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
                        score += SCORE_2X2;
                        
                        if(mode != MODE_TUTO)
                            timer += TIMER_2X2;

                        document.getElementById('htmlScore').value = score;
                        
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
                                            score += SCORE_3X3;
                                            timer += TIMER_3X3;
                                            document.getElementById('htmlScore').value = score;
                                            document.getElementById('htmlTimer').value = timer;
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