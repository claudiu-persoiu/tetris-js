var classPiecesCollection = function () {
    var a = [];
    this.addFigure = function (c) {
        a.push(c);
    };
    this.getRand = function () {
        var b = Math.round(Math.random() * (a.length - 1));
        return a[b]
    }
};
classPiecesCollection.prototype.length = function () {
    return arr.length;
};
var classPiece = function (a, d, b) {
    this.arr = c(a, d);
    this.culoare = b;
    function c(e, k) {
        var h = new Array(e);
        for (var g = 0; g < e; g++) {
            h[g] = new Array(k);
            for (var f = 0; f < k; f++) {
                h[g][f] = 0
            }
        }
        return h
    }

    this.set = function (e, f) {
        this.arr[e][f] = this.culoare
    };
    this.get = function (e, f) {
        return this.arr[e][f]
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
        return this.arr[0].length
    }
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

    var generateEmptyCanvas = function () {

        var matrix = [], i, j;
        for (i = 0; i < x; i++) {
            matrix[i] = [];
            for (j = 0; j < y; j++) {
                matrix[i][j] = 0
            }
        }

        this.arr = matrix;
    };

    generateEmptyCanvas();

    this.get = function (x, y) {
        return this.arr[x][y];
    };

    this.set = function (x, y, color) {
        this.arr[x][y] = color;
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
        this.viteza = 1000;
        this.timer;
        this.finis = false;
        this.canvas.reset();
        var playButton = document.getElementById("play");
        playButton.innerHTML = "Pause";
        playButton.onclick = function () {
            tetris.pause(true);
        }

    };
    this.displayTable = function () {
        var h = document.createElement("table");
        var e = document.createElement("tbody");
        h.appendChild(e);
        var g = document.createDocumentFragment();
        for (var f = 0; f < this.canvas.x; f++) {
            var k = document.createElement("tr");
            e.appendChild(k);
            for (var d = 0; d < this.canvas.y; d++) {
                var l = document.createElement("td");
                l.setAttribute("id", "cellX" + f + "Y" + d);
                k.appendChild(l);
                var c = document.createTextNode(" ");
                l.appendChild(c);
                if (this.canvas.get(f, d) == 0) {
                    l.bgColor = ""
                } else {
                    l.bgColor = this.canvas.get(f, d)
                }
            }
        }
        this.afisare.innerHTML = "";
        this.afisare.appendChild(h)
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
        var c = this.piesaCurentaX;
        var h = this.piesaCurentaY;
        var g = this.pieceCurrent.getWidth();
        var f = this.pieceCurrent.getHeight();
        for (var e = 0; e < g; e++) {
            for (var d = 0; d < f; d++) {
                if (this.pieceCurrent.get(e, d) != 0) {
                    document.getElementById("cellX" + (e + c) + "Y" + (d + h)).bgColor = this.pieceCurrent.get(e, d)
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
        for (var d = 0; d < this.canvas.x; d++) {
            if (this.canvas.get(d, 0) != 0 && this.canvas.get(d, g) != 0) {
                var e = true;
                for (var c = 0; c < this.canvas.y; c++) {
                    if (this.canvas.get(d, c) == 0) {
                        e = false;
                        break
                    }
                }
                if (e == true) {
                    for (var c = 0; c < this.canvas.y; c++) {
                        document.getElementById("cellX" + d + "Y" + c).innerHTML = "<b>Y</b>"
                    }
                    f.push(d)
                }
            }
        }
        for (var d = 0; d < f.length; d++) {
            this.redoCanvasWithout(f[d])
        }
        this.displayTable();
        return f.length
    };
    this.redoCanvasWithout = function (c) {
        var d = this.canvas.x - 1;
        for (var f = c; f > 0; f--) {
            for (var e = 0; e < this.canvas.y; e++) {
                this.canvas.set(f, e, this.canvas.get(f - 1, e))
            }
        }
    };
    this.movePiece = function (f) {
        var keyCode;
        if (window.event) {
            keyCode = window.event.keyCode
        } else {
            if (f) {
                keyCode = f.which
            }
        }
        var currentPiece = tetris.pieceCurrent;
        if (currentPiece == null) {
            return
        }

        var changed = false;

        switch (keyCode) {
            case 38:
                currentPiece.rotation();
                if (tetris.loadCurrentPiece(0, 0)) {
                    changed = true;
                } else {
                    currentPiece.rotation();
                    currentPiece.rotation();
                    currentPiece.rotation();
                    changed = true;
                }
                break;
            case 40:
                if (tetris.loadCurrentPiece(1, 0)) {
                    tetris.piesaCurentaX++;
                    changed = true;
                }
                break;
            case 37:
                if (tetris.loadCurrentPiece(0, -1)) {
                    tetris.piesaCurentaY--;
                    changed = true;
                }
                break;
            case 39:
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

        return false
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
                tetris.timer = setInterval("tetris.play();", tetris.viteza);
                document.getElementById("score-board").innerHTML = tetris.scor;
            }
        }
    }
};

var tetris = new classTetris(piecesCollection, canvas);
tetris.reset();

tetris.timer = setInterval(function () {
    tetris.play();
}, tetris.viteza);

document.onkeydown = tetris.movePiece;
// 398