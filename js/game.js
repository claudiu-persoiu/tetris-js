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
    
    this.addPiece = function (c) {
        pieces.push(c);
        return this;
    };

    this.getRand = function () {
        var piece = pieces[Math.round(Math.random() * (pieces.length - 1))],
            times = Math.round(Math.random() * 4),
            i;

        for (i = 0; i < times; i++) {
            piece.rotation()
        }

        return piece;
    };
};

var classPiece = function (width, height, color, elements) {
    this.arr = generateEmptyMatrix(width, height);
    this.color = color;

    this.set = function (x, y) {
        this.arr[x][y] = this.color
    };

    for (var index in elements) {
        this.set(elements[index][0], elements[index][1]);
    }

    this.get = function (x, y) {
        return this.arr[x][y]
    };
    this.rotation = function () {
        var width = this.arr.length,
            height = this.arr[0].length,
            rotated = [],
            i, j;

        for (i = 0; i < height; i++) {
            rotated[i] = [];
        }
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                rotated[j][(width - 1 - i)] = this.arr[i][j]
            }
        }
        this.arr = rotated;
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
piecesCollection.addPiece(new classPiece(2, 3, "#FF0000", [[0, 0], [0, 1], [1, 1], [1, 2]]))
    .addPiece(new classPiece(1, 4, "#00FF00", [[0, 0], [0, 1], [0, 2], [0, 3]]))
    .addPiece(new classPiece(2, 3, "#2984D7", [[0, 1], [1, 0], [1, 1], [0, 2]]))
    .addPiece(new classPiece(2, 3, "#CCCCCC", [[0, 1], [1, 0], [1, 1], [1, 2]]))
    .addPiece(new classPiece(2, 2, "#DE397B", [[0, 0], [0, 1], [1, 0], [1, 1]]))
    .addPiece(new classPiece(2, 3, "#259463", [[0, 0], [0, 1], [0, 2], [1, 2]]))
    .addPiece(new classPiece(2, 3, "#BD6B31", [[1, 0], [1, 1], [1, 2], [0, 2]]));

var classCanvas = function (height, width) {
    var matrix = [];

    var generateEmptyCanvas = function () {
        matrix = generateEmptyMatrix(height, width);
    };

    generateEmptyCanvas();

    return {
        get: function (x, y) {
            return matrix[x][y];
        },
        set: function (x, y, color) {
            matrix[x][y] = color;
        },
        reset: function () {
            generateEmptyCanvas();
        },
        getWidth: function () {
            return width;
        },
        getHeight: function () {
            return height;
        }
    };
};

var canvas = new classCanvas(20, 15);

var classTetris = function (piecesCollection, canvas) {
    this.piecesCollection = piecesCollection;
    this.canvas = canvas;
    this.afisare = document.getElementById("canvas");
    this.reset = function () {
        this.pieceCurrent = null;
        this.score = 0;
        document.getElementById("score-board").innerHTML = this.score;
        this.speed = 1000;
        this.timer = false;
        this.finished = false;
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

        for (var x = 0; x < this.canvas.getHeight(); x++) {
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (var y = 0; y < this.canvas.getWidth(); y++) {
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
            tetris.pieceCurrentX++
        } else {
            tetris.embedCurrentPiece();
            tetris.pieceCurrent = null;
            tetris.pieceCurrentX = 0;
            tetris.pieceCurrentY = 0
        }
    };

    this.getWidthCenter = function () {
        return Math.ceil((this.canvas.getWidth() / 2) - (this.pieceCurrent.getHeight() / 2));
    };

    this.getNextPiece = function () {
        if (!this.pieceNext) {
            this.pieceNext = this.piecesCollection.getRand();
        }

        this.pieceCurrent = this.pieceNext;
        this.pieceNext = this.piecesCollection.getRand();

        document.getElementById("next").innerHTML = this.pieceNext.preview();
        this.pieceCurrentX = 0;
        this.pieceCurrentY = this.getWidthCenter();
    };

    this.displayPiece = function () {
        var currentWidth = this.pieceCurrent.getWidth();
        var currentHeight = this.pieceCurrent.getHeight();
        var currentX = this.pieceCurrentX;
        var currentY = this.pieceCurrentY; // - Math.floor(currentHeight / 2);

        for (var x = 0; x < currentWidth; x++) {
            for (var y = 0; y < currentHeight; y++) {
                if (this.pieceCurrent.get(x, y) != 0) {
                    document.getElementById("cellX" + (x + currentX) + "Y" + (y + currentY)).bgColor = this.pieceCurrent.get(x, y)
                }
            }
        }
    };
    this.loadCurrentPiece = function (x, y) {
        var pieceWidth = this.pieceCurrent.getWidth();
        var pieceHeight = this.pieceCurrent.getHeight();
        var positionX = this.pieceCurrentX + x;
        var positionY = this.pieceCurrentY + y;

        var result = true;
        var finished = false;

        if (pieceWidth + positionX >= this.canvas.getHeight() + 1 || pieceHeight + positionY >= this.canvas.getWidth() + 1 || positionY <= -1) {
            result = false
        }
        if (result) {
            for (var i = 0; i < pieceWidth; i++) {
                for (var j = 0; j < pieceHeight; j++) {
                    if (this.pieceCurrent.get(i, j) != 0 && this.canvas.get((i + positionX), (j + positionY)) != 0) {
                        result = false;
                        finished = true;
                        break
                    }
                }
                if (!result) {
                    break
                }
            }
        }
        if (finished && positionX == 1) {
            clearInterval(this.timer);
            this.timer = false;
            this.finished = true;
            alert("game over!");
            document.getElementById("play").innerHTML = "Start!"
        }
        return result;
    };
    this.embedCurrentPiece = function () {
        var width = this.pieceCurrent.getWidth();
        var height = this.pieceCurrent.getHeight();
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                if (this.pieceCurrent.get(i, j) != 0) {
                    this.canvas.set((i + this.pieceCurrentX), (j + this.pieceCurrentY), this.pieceCurrent.get(i, j));
                    document.getElementById("cellX" + (i + this.pieceCurrentX) + "Y" + (j + this.pieceCurrentY)).innerHTML = " "
                }
            }
        }
        var eliminatedRows = this.testRow();
        if (eliminatedRows) {
            this.score += (eliminatedRows * 100)
        }
        this.score++;
        document.getElementById("score-board").innerHTML = this.score
    };
    this.testRow = function () {
        var rowsToEliminate = [];
        var i, j;
        for (i = 0; i < this.canvas.getHeight(); i++) {
                var fullRow = true;
                for (j = 0; j < this.canvas.getWidth(); j++) {
                    if (this.canvas.get(i, j) == 0) {
                        fullRow = false;
                        break
                    }
                }
                if (fullRow == true) {
                    rowsToEliminate.push(i)
                }

        }
        for (i = 0; i < rowsToEliminate.length; i++) {
            this.redoCanvasWithout(rowsToEliminate[i])
        }
        this.displayTable();
        return rowsToEliminate.length;
    };
    this.redoCanvasWithout = function (c) {
        for (var f = c; f > 0; f--) {
            for (var e = 0; e < this.canvas.getWidth(); e++) {
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
                var currentY = tetris.pieceCurrentY;
                tetris.pieceCurrentY -= Math.floor(currentPiece.getHeight() / 2) - 1;
                if (!tetris.loadCurrentPiece(0, 0)) {
                    currentPiece.rotation();
                    currentPiece.rotation();
                    currentPiece.rotation();
                    tetris.pieceCurrentY = currentY;
                } else {
                    changed = true;
                }

                break;
            case KEY_DOWN:
                if (tetris.loadCurrentPiece(1, 0)) {
                    tetris.pieceCurrentX++;
                    changed = true;
                }
                break;
            case KEY_LEFT:
                if (tetris.loadCurrentPiece(0, -1)) {
                    tetris.pieceCurrentY--;
                    changed = true;
                }
                break;
            case KEY_RIGHT:
                if (tetris.loadCurrentPiece(0, +1)) {
                    tetris.pieceCurrentY++;
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
    this.pause = function (play) {
        if (tetris.timer) {
            clearInterval(tetris.timer);
            tetris.timer = false;
        } else if (play) {
            if (tetris.finished == true) {
                tetris.reset()
            }
            tetris.timer = setInterval(function () {
                tetris.play();
            }, tetris.speed);
        }

        document.getElementById("paused").style.display = tetris.timer ? 'none' : 'block';
    };
};

var tetris = new classTetris(piecesCollection, canvas);
tetris.reset();
tetris.pause(true);

document.onkeydown = tetris.movePiece;
// 398