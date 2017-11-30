const chess = document.getElementById('chess'),
    context = chess.getContext('2d'),
    logo = new Image(),
    chessBoard = [];
//黑白棋标志
let isBlack = true;

for (let i = 0; i < 15; i++) {
    chessBoard[i] = [];
    for (let j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
    }
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
const onStep = (i, j, isBlack) => {
    context.beginPath();
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    context.closePath();
    //参数为两个圆（坐标，半径）,亮点偏移在右上角X+2，y-2
    const gradient = context.createRadialGradient(17 + i * 30, 13 + j * 30, 13, 17 + i * 30, 13 + j * 30, 0);
    if (isBlack) {
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
    //相对于canvas左上角的坐标
    let x = e.offsetX;
    let y = e.offsetY;
    let i = Math.floor(x / 30);
    let j = Math.floor(y / 30);
    if (chessBoard[i][j] === 0) {
        onStep(i, j, isBlack);
        isBlack ? chessBoard[i][j] = 1 : chessBoard[i][j] = 2;
        isBlack = !isBlack;
    }

};