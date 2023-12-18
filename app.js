

///// Canvas 
const canvas = document.querySelector('#layer1');
const ctx = canvas.getContext('2d');

// Variables
let brushSize = 0;
let brushColor = '';
let paint = false;
let curr = {x: 0, y: 0};
let prev = {x: 0, y: 0};
let isDot = false;
let isErase = false;

let lineHistory = [];
let points = [];

window.addEventListener('load', () => {
    // init();

    brushSize = sizeSlider.value;

    window.onkeydown = e => {
        console.log(e);
        if (e.ctrlKey && e.key === 'z') {
            triggerUndo();
        }
    } 

    triggerResize();
    canvas.onmousedown = e => {
        paint = true;
        isDot = true;
        // drawOnCanvas();

        points = [];
        points.push({x: curr.x, y: curr.y, brushSize: brushSize, brushColor: brushColor});

        // console.log("YOU PUSH");
    }
    canvas.onmouseup = e => {
        // paint = false;

        if (isDot) {
            // points = [];
            points.push({x: curr.x, y: curr.y, brushSize: brushSize, brushColor: brushColor});
            drawOnCanvas();
            console.log("IT'S A DOT");
        }

        paint = false;
        lineHistory.push(points);
        console.log("last line: " + lineHistory[lineHistory.length-1].length);
        // console.log(lineHistory)
        
        // console.log("YOU LET GO");
    }
    canvas.onmousemove = e => {
        
        isDot = false;
        getCoords(e);
        drawOnCanvas();
        // saveLines();
        // points = [];
        

        if (paint) {
            points.push({x: curr.x, y: curr.y, brushSize: brushSize, brushColor: brushColor});
            console.log(points);
        }
        // console.log("YOU MOVE");
    }
    window.onresize = e => {
        console.log("RESIZE!");
        triggerResize();
    }
    
})

function triggerResize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight-50;
    
    lineHistory.forEach(path => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = brushSize;
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 0; i < path.length; i++) {
            // ctx.beginPath();
            ctx.lineTo(path[i].x, path[i].y);
            // ctx.stroke();
        }
        ctx.stroke();
        // ctx.closePath();
    });
}

// testDraw();

function testDraw() {
    ctx.beginPath();
    ctx.rect(20, 40, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function getCoords(e) {

    let rect = canvas.getBoundingClientRect()

    //Get coords
    prev.x = curr.x;
    prev.y = curr.y;
    curr.x = Math.round(e.clientX - rect.left);
    curr.y = Math.round(e.clientY - rect.top);
}

function drawOnCanvas(e) {
    if (!paint) return;
    // if (brushColor === )

    ctx.beginPath();

    //Brush setting
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;

    //Draw
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);

    ctx.stroke();
    ctx.closePath();
}

function triggerUndo() {
    console.log("deleted line: " + lineHistory[lineHistory.length-1])
    lineHistory.splice(-1, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lineHistory.forEach(path => {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = path[0].brushColor;
        ctx.lineWidth = path[0].brushSize;
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 0; i < path.length; i++) {
            // ctx.beginPath();
            ctx.lineTo(path[i].x, path[i].y);
            // ctx.stroke();
        }
        ctx.stroke();
        // ctx.closePath();
    });
}

function saveLines() {
    if (paint) { //Drawing lines
        console.log({x: curr.x, y: curr.y});
        points = [];
        points.push({x: curr.x, y: curr.y});
    } else {
        lineHistory.push(points);
        console.log(lineHistory)
    }
    points = [];
}

// Buttons
const clearBtn = document.querySelector('#clear');
clearBtn.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lineHistory = [];
}

const undoBtn = document.querySelector('#undo');
undoBtn.onclick = () => {
    // lineHistory.splice(-1, 1);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // lineHistory.forEach(path => {
    //     ctx.beginPath();
    //     ctx.lineCap = 'round';
    //     ctx.strokeStyle = 'black';
    //     ctx.lineWidth = brushSize;
    //     // ctx.moveTo(path[0].x, path[0].y);
    //     for (let i = 0; i < path.length; i++) {
    //         // ctx.beginPath();
    //         ctx.lineTo(path[i].x, path[i].y);
    //         // ctx.stroke();
    //     }
    //     ctx.stroke();
    //     // ctx.closePath();
    // });
    triggerUndo();
}

const sizeSlider = document.querySelector('#slider');
sizeSlider.oninput = function() {
    brushSize = this.value;
}

const eraserBtn = document.querySelector('#eraser');
eraserBtn.onclick = () => {
    isErase = !isErase;
    brushColor = (isErase) ? 'white' : 'black';
    console.log(brushColor);
}