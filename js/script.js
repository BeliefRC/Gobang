//棋盘，棋盘的canvas对象，logo图，棋盘数组，赢法数组(3维),赢法的统计数组(玩家和ai)
const chess = document.getElementById('chess'),
    context = chess.getContext('2d'),
    logo = new Image(),
    chessBoard = [],
    wins = [],
    myWin = [],
    computerWin = [];

//黑白棋标志,赢法种类索引,棋局是否结束
let me = true, count = 0, over = false;

//  初始化棋盘
for (let i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (let j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
}

//初始化赢法数组
for (let i = 0; i < 15; i++) {
    wins[i] = [];
    for (let j = 0; j < 15; j++) {
        wins[i][j] = [];
    }
}

//竖线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i][j + k][count] = true
        }
        count++;
    }
}

//横线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[j + k][i][count] = true
        }
        count++;
    }
}

//斜线赢法
for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true
        }
        count++;
    }
}

//反竖线赢法
for (let i = 0; i < 11; i++) {
    for (let j = 14; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true
        }
        count++;
    }
}

for (let i = 0; i < count; i++) {
    myWin[i] = computerWin[i] = 0;
}


context.strokeStyle = '#bfbfbf';

logo.src = 'images/logo.png';
logo.onload = () => {
    context.drawImage(logo, 25, 25, 400, 400);
    drawChessBoard();
};

//左右留白15，间隔30
const drawChessBoard = () => {
    for (let i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
        context.moveTo(15, 15 + i * 30);
        context.lineTo(435, 15 + i * 30);
        context.stroke();
    }
};
const onStep = (i, j, me) => {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    //参数为两个圆（坐标，半径）,亮点偏移在右上角X+2，y-2
    const gradient = context.createRadialGradient(17 + i * 30, 13 + j * 30, 13, 17 + i * 30, 13 + j * 30, 0);
    if (me) {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#636766');
    } else {
        gradient.addColorStop(0, '#d1d1d1');
        gradient.addColorStop(1, '#f9f9f9');
    }

    context.fillStyle = gradient;
    context.fill();
};

chess.onclick = (e) => {
    //游戏结束后或不是自己下棋，点击无效
    if (over) {
        return
    }
    if (!me){
        return
    }

    //相对于canvas左上角的坐标
    let x = e.offsetX;
    let y = e.offsetY;
    let i = Math.floor(x / 30);
    let j = Math.floor(y / 30);
    if (chessBoard[i][j] === 0) {
        onStep(i, j, me);
        chessBoard[i][j] = 1;
        for (let k = 0; k < count; k++) {
            //i,j位置的第k种赢法
            if (wins[i][j][k]) {
                //玩家在此位置赢的可能性加1
                myWin[k]++;
                //ai在此位置的赢法不可能赢了
                computerWin[k] = 6;
                if (myWin[k] === 5) {
                    window.alert('你赢了');
                    over = true;
                }
            }
        }
        if (!over) {
            me = !me;
            computerAI();
        }
    }
};
const computerAI = () => {
    //自己和计算机的得分数组,最高分数,点的坐标
    let myScore = [], computerScore = [], max = 0, u = 0, v = 0;
    for (let i = 0; i < 15; i++) {
        myScore[i] = [];
        computerScore[i] = [];
        for (let j = 0; j < 15; j++) {
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            //空余的点
            if (chessBoard[i][j] === 0) {
                //遍历所有的赢法
                for (let k = 0; k < count; k++) {
                    //该点赢法为true，则该点是有价值的
                    if (wins[i][j][k]) {
                        //玩家已实现一颗子(以此类推)
                        if (myWin[k] === 1) {
                            //在该点下子则可以有效的拦截
                            myScore[i][j] += 200;
                        } else if (myWin[k] === 2) {
                            myScore[i][j] += 400;
                        }
                        else if (myWin[k] === 3) {
                            myScore[i][j] += 2000;
                        }
                        else if (myWin[k] === 4) {
                            myScore[i][j] += 10000;
                        }
                        //计算机在此已连上一颗子
                        if (computerWin[k] === 1) {
                            computerScore[i][j] += 220;
                        } else if (computerWin[k] === 2) {
                            computerScore[i][j] += 420;
                        }
                        else if (computerWin[k] === 3) {
                            computerScore[i][j] += 2100;
                        }
                        else if (computerWin[k] === 4) {
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if (myScore[i][j] > max) {
                    //记录max和点坐标
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if (myScore[i][j === max]) {
                    //如果myScore分数相等就判断computerScore
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
                if (computerScore[i][j] > max) {
                    //记录max和点坐标
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if (computerScore[i][j === max]) {
                    //如果myScore分数相等就判断computerScore
                    if (myScore[i][j] > computerScore[u][v]) {
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    //计算机落子
    onStep(u, v, false);
    chessBoard[u][v] = 2;

    for (let k = 0; k < count; k++) {
        //u,v位置的第k种赢法
        if (wins[u][v][k]) {
            //计算机在此位置赢的可能性加1
            computerWin[k]++;
            //玩家在此位置的赢法不可能赢了
            myWin[k] = 6;
            if (computerWin[k] === 5) {
                window.alert('ai赢了');
                over = true;
            }
        }
    }
    if (!over) {
        me = !me;
    }
};