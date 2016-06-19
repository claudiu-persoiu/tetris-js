var generateEmptyMatrix = function (x, y) {
    var matrix = [], i, j;
    for (i = 0; i < x; i++) {
        matrix[i] = [];
        for (j = 0; j < y; j++) {
            matrix[i][j] = 0
        }
    }
    return matrix;
};

var classPiecesCollection = function () {
    var pieces = [];
    this.addFigure = function (c) {
        pieces.push(c);
    };
    this.getRand = function () {
        return pieces[Math.round(Math.random() * (pieces.length - 1))];
    };
};

var classPiece = function (width, height, color) {
    this.arr = generateEmptyMatrix(width, height);
    this.color = color;

    this.set = function (x, y) {
        this.arr[x][y] = this.color
    };
    this.get = function (x, y) {
        return this.arr[x][y]
    };
    this.rotation = function () {
        var k = this.arr.length;
        var h = this.arr[0].length;
        var e = new Array(h);
        for (var g = 0; g < h; g++) {
            e[g] = [];
        }
        for (var g = 0; g < k; g++) {
            for (var f = 0; f < h; f++) {
                e[f][(k - 1 - g)] = this.arr[g][f]
            }
        }
        this.arr = e
    };
    this.preview = function () {
        var k = this.arr.length;
        var h = this.arr[0].length;
        var g = "<table>";
        for (var f = 0; f < k; f++) {
            g += "<tr>";
            for (var e = 0; e < h; e++) {
                g += '<td  bgcolor="';
                if (this.arr[f][e] != 0) {
                    g += this.arr[f][e]
                }
                g += '">&nbsp;</td>'
            }
            g += "</tr>"
        }
        g += "</table>";
        return g
    };
    this.getWidth = function () {
        return this.arr.length
    };
    this.getHeight = function () {
        return this.arr[0].length;
    };
};
var piecesCollection = new classPiecesCollection();
var tempPiece = new classPiece(2, 3, "#FF0000");
tempPiece.set(0, 0);
tempPiece.set(0, 1);
tempPiece.set(1, 1);
tempPiece.set(1, 2);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(1, 4, "#00FF00");
tempPiece.set(0, 0);
tempPiece.set(0, 1);
tempPiece.set(0, 2);
tempPiece.set(0, 3);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(2, 3, "#2984D7");
tempPiece.set(0, 1);
tempPiece.set(1, 0);
tempPiece.set(1, 1);
tempPiece.set(0, 2);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(2, 3, "#CCCCCC");
tempPiece.set(0, 1);
tempPiece.set(1, 0);
tempPiece.set(1, 1);
tempPiece.set(1, 2);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(2, 2, "#DE397B");
tempPiece.set(0, 0);
tempPiece.set(0, 1);
tempPiece.set(1, 0);
tempPiece.set(1, 1);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(2, 3, "#259463");
tempPiece.set(0, 0);
tempPiece.set(0, 1);
tempPiece.set(0, 2);
tempPiece.set(1, 2);
piecesCollection.addFigure(tempPiece);
var tempPiece = new classPiece(2, 3, "#BD6B31");
tempPiece.set(1, 0);
tempPiece.set(1, 1);
tempPiece.set(1, 2);
tempPiece.set(0, 2);
piecesCollection.addFigure(tempPiece);
var classCanvas = function (x, y) {
    this.x = x;
    this.y = y;
    var matrix = [];

    var generateEmptyCanvas = function () {
        matrix = generateEmptyMatrix(x, y);
    };

    generateEmptyCanvas();

    this.get = function (x, y) {
        return matrix[x][y];
    };

    this.set = function (x, y, color) {
        matrix[x][y] = color;
    };

    this.reset = function () {
        generateEmptyCanvas();
    };
};
var canvas = new classCanvas(20, 15);
var classTetris = function (piecesCollection, canvas) {
    this.piecesCollection = piecesCollection;
    this.canvas = canvas;
    this.afisare = document.getElementById("canvas");
    this.reset = function () {
        this.pieceCurrent = null;
        this.pieceNext = this.piecesCollection.getRand();
        this.piesaCurentaX = 0;
        this.piesaCurentaY = 0;
        this.scor = 0;
        document.getElementById("score-board").innerHTML = this.scor;
        this.speed = 1000;
        this.timer = false;
        this.finis = false;
        this.canvas.reset();
        var playButton = document.getElementById("play");
        playButton.innerHTML = "Pause";
        playButton.onclick = function () {
            tetris.pause(true);
        }

    };
    this.displayTable = function () {
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        table.appendChild(tbody);

        for (var x = 0; x < this.canvas.x; x++) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (var y = 0; y < this.canvas.y; y++) {
                var td = document.createElement("td");
                td.setAttribute("id", "cellX" + x + "Y" + y);
                tr.appendChild(td);
                td.appendChild(document.createTextNode(" "));

                if (this.canvas.get(x, y) == 0) {
                    td.bgColor = ""
                } else {
                    td.bgColor = this.canvas.get(x, y)
                }
            }
        }
        this.afisare.innerHTML = "";
        this.afisare.appendChild(table)
    };
    this.play = function () {
        tetris.displayTable();
        if (tetris.pieceCurrent == null) {
            tetris.getNextPiece()
        }
        tetris.displayPiece();
        if (tetris.loadCurrentPiece(1, 0)) {
            tetris.piesaCurentaX++
        } else {
            tetris.embedCurrentPiece();
            tetris.pieceCurrent = null;
            tetris.piesaCurentaX = 0;
            tetris.piesaCurentaY = 0
        }
    };
    this.getNextPiece = function () {
        this.pieceCurrent = this.pieceNext;
        this.pieceNext = this.piecesCollection.getRand();
        var e = Math.round(Math.random() * 4);
        for (var d = 0; d < e; d++) {
            this.pieceNext.rotation()
        }
        document.getElementById("next").innerHTML = this.pieceNext.preview();
        this.piesaCurentaX = 0;
        var c = Math.ceil(this.pieceCurrent.getHeight() / 2);
        var f = Math.ceil(this.canvas.y / 2);
        this.piesaCurentaY = f - c
    };
    this.displayPiece = function () {
        var currentX = this.piesaCurentaX;
        var currentY = this.piesaCurentaY;
        var currentWidth = this.pieceCurrent.getWidth();
        var currentHeight = this.pieceCurrent.getHeight();
        for (var x = 0; x < currentWidth; x++) {
            for (var y = 0; y < currentHeight; y++) {
                if (this.pieceCurrent.get(x, y) != 0) {
                    document.getElementById("cellX" + (x + currentX) + "Y" + (y + currentY)).bgColor = this.pieceCurrent.get(x, y)
                }
            }
        }
    };
    this.loadCurrentPiece = function (n, m) {
        var l = this.piesaCurentaX + n;
        var k = this.piesaCurentaY + m;
        var e = this.pieceCurrent.getWidth();
        var c = this.pieceCurrent.getHeight();
        var f = true;
        var d = false;
        if (e + l >= this.canvas.x + 1 || c + k >= this.canvas.y + 1 || k <= -1) {
            f = false
        }
        if (f) {
            for (var h = 0; h < e; h++) {
                for (var g = 0; g < c; g++) {
                    if (this.pieceCurrent.get(h, g) != 0 && this.canvas.get((h + l), (g + k)) != 0) {
                        f = false;
                        d = true;
                        break
                    }
                }
                if (!f) {
                    break
                }
            }
        }
        if (d && l == 1) {
            clearInterval(this.timer);
            this.timer = false;
            this.finis = true;
            alert("game over!");
            document.getElementById("play").innerHTML = "Start!"
        }
        return f
    };
    this.embedCurrentPiece = function () {
        var g = this.pieceCurrent.getWidth();
        var f = this.pieceCurrent.getHeight();
        for (var d = 0; d < g; d++) {
            for (var c = 0; c < f; c++) {
                if (this.pieceCurrent.get(d, c) != 0) {
                    this.canvas.set((d + this.piesaCurentaX), (c + this.piesaCurentaY), this.pieceCurrent.get(d, c));
                    document.getElementById("cellX" + (d + this.piesaCurentaX) + "Y" + (c + this.piesaCurentaY)).innerHTML = " "
                }
            }
        }
        var e = this.testRand();
        if (e) {
            this.scor += (e * 100)
        }
        this.scor++;
        document.getElementById("score-board").innerHTML = this.scor
    };
    this.testRand = function () {
        var g = this.canvas.y - 1;
        var f = new Array();
        var i, j;
        for (i = 0; i < this.canvas.x; i++) {
            if (this.canvas.get(i, 0) != 0 && this.canvas.get(i, g) != 0) {
                var e = true;
                for (j = 0; j < this.canvas.y; j++) {
                    if (this.canvas.get(i, j) == 0) {
                        e = false;
                        break
                    }
                }
                if (e == true) {
                    for (j = 0; j < this.canvas.y; j++) {
                        document.getElementById("cellX" + i + "Y" + j).innerHTML = "<b>Y</b>"
                    }
                    f.push(i)
                }
            }
        }
        for (i = 0; i < f.length; i++) {
            this.redoCanvasWithout(f[i])
        }
        this.displayTable();
        return f.length;
    };
    this.redoCanvasWithout = function (c) {
        for (var f = c; f > 0; f--) {
            for (var e = 0; e < this.canvas.y; e++) {
                this.canvas.set(f, e, this.canvas.get(f - 1, e))
            }
        }
    };
    this.movePiece = function (event) {
        var keyCode = event.which || window.event.keyCode;

        var currentPiece = tetris.pieceCurrent;
        if (currentPiece == null) {
            return;
        }

        var changed = false;

        var KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_LEFT = 37,
            KEY_RIGHT = 39;

        switch (keyCode) {
            case KEY_UP:
                currentPiece.rotation();
                if (!tetris.loadCurrentPiece(0, 0)) {
                    currentPiece.rotation();
                    currentPiece.rotation();
                    currentPiece.rotation();
                }
                changed = true;
                break;
            case KEY_DOWN:
                if (tetris.loadCurrentPiece(1, 0)) {
                    tetris.piesaCurentaX++;
                    changed = true;
                }
                break;
            case KEY_LEFT:
                if (tetris.loadCurrentPiece(0, -1)) {
                    tetris.piesaCurentaY--;
                    changed = true;
                }
                break;
            case KEY_RIGHT:
                if (tetris.loadCurrentPiece(0, +1)) {
                    tetris.piesaCurentaY++;
                    changed = true;
                }
                break
        }

        if (changed) {
            tetris.displayTable();
            tetris.displayPiece();
        }

        return false;
    };
    this.pause = function (c) {
        if (tetris.timer) {
            clearInterval(tetris.timer);
            tetris.timer = false;
            document.getElementById("score-board").innerHTML += " Pause..."
        } else {
            if (c) {
                if (tetris.finis == true) {
                    tetris.reset()
                }
                tetris.timer = setInterval("tetris.play();", tetris.speed);
                document.getElementById("score-board").innerHTML = tetris.scor;
            }
        }
    };
};

var tetris = new classTetris(piecesCollection, canvas);
tetris.reset();

tetris.timer = setInterval(function () {
    tetris.play();
}, tetris.speed);

document.onkeydown = tetris.movePiece;
// 398