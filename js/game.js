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

var buildDOMTable = function (canvas) {

    var table = document.createElement("table"),
        tbody = document.createElement("tbody"),
        tr, td, color, i, j;
    table.appendChild(tbody);

    for (i = 0; i < canvas.getHeight(); i++) {
        tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (j = 0; j < canvas.getWidth(); j++) {
            td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode(" "));
            color = canvas.get(i, j);
            td.bgColor = color != 0 ? color : '';
        }
    }

    return table;
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
    var matrix = generateEmptyMatrix(width, height);

    this.set = function (x, y) {
        matrix[x][y] = color
    };

    for (var index in elements) {
        this.set(elements[index][0], elements[index][1]);
    }

    this.get = function (x, y) {
        return matrix[x][y]
    };
    this.rotation = function () {
        var rotated = [],
            i, j;

        for (i = 0; i < width; i++) {
            rotated[i] = [];
            for (j = 0; j < height; j++) {
                rotated[i][j] = matrix[width - j - 1][i];
            }
        }
        matrix = rotated;
    };
    this.preview = function () {
        var nextContainer = document.getElementById("next");
        nextContainer.innerHTML = '';
        nextContainer.appendChild(buildDOMTable(new classPiece(4, 4, color, elements)));
    };
    this.getWidth = function () {
        return width;
    };
    this.getHeight = function () {
        return height;
    };
};
var piecesCollection = new classPiecesCollection();
piecesCollection.addPiece(new classPiece(3, 3, "#FF0000", [[0, 0], [0, 1], [1, 1], [1, 2]]))
    .addPiece(new classPiece(4, 4, "#00FF00", [[1, 0], [1, 1], [1, 2], [1, 3]]))
    .addPiece(new classPiece(3, 3, "#2984D7", [[1, 1], [2, 0], [2, 1], [1, 2]]))
    .addPiece(new classPiece(3, 3, "#CCCCCC", [[1, 1], [2, 0], [2, 1], [2, 2]]))
    .addPiece(new classPiece(4, 4, "#DE397B", [[1, 1], [1, 2], [2, 1], [2, 2]]))
    .addPiece(new classPiece(3, 3, "#259463", [[1, 0], [1, 1], [1, 2], [2, 2]]))
    .addPiece(new classPiece(3, 3, "#BD6B31", [[2, 0], [2, 1], [2, 2], [1, 2]]));

var classCanvas = function (height, width) {
    var matrix = [];

    var generateEmptyCanvas = function () {
        matrix = generateEmptyMatrix(height, width);
    };

    generateEmptyCanvas();

    var displayPiece = function (piece, x, y) {
        var currentWidth = piece.getWidth(),
            currentHeight = piece.getHeight(),
            tempCanvas = new classCanvas(height, width);
        tempCanvas.setMatrix(matrix);

        for (var i = 0; i < currentWidth; i++) {
            for (var j = 0; j < currentHeight; j++) {
                if ((x + i) >= 0 && piece.get(i, j) != 0) {
                    tempCanvas.set((i + x), (j + y), piece.get(i, j));
                }
            }
        }

        return tempCanvas;
    };

    return {
        get: function (x, y) {
            return matrix[x][y];
        },
        set: function (x, y, color) {
            matrix[x][y] = color;
        },
        setMatrix: function (newMatrix) {
            matrix = JSON.parse(JSON.stringify(newMatrix));
        },
        reset: function () {
            generateEmptyCanvas();
        },
        getWidth: function () {
            return width;
        },
        getHeight: function () {
            return height;
        },
        displayPiece: function (piece, x, y) {
            return displayPiece(piece, x, y);
        }
    };
};

var canvas = new classCanvas(20, 15);

var classTetris = function (piecesCollection, canvas) {
    this.piecesCollection = piecesCollection;
    this.canvas = canvas;
    this.canvasElement = document.getElementById("canvas");
    this.elementSize = this.canvasElement.offsetWidth / this.canvas.getWidth();

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
        playButton.addEventListener('click', function () {
            tetris.pause(true);
        }, false);
    };

    this.displayTable = function () {

        this.canvasElement.innerHTML = "";
        this.canvasElement.appendChild(
            buildDOMTable(this.canvas.displayPiece(this.pieceCurrent, this.pieceCurrentX, this.pieceCurrentY))
        );
    };

    this.testGameOver = function () {
        if (this.pieceCurrentX < 0) {
            this.endGame();
            return true;
        }
    };

    this.play = function () {
        if (tetris.pieceCurrent == null) {
            tetris.getNextPiece()
        }

        tetris.displayTable();

        if (tetris.loadCurrentPiece(1, 0)) {
            tetris.pieceCurrentX++
        } else if (!tetris.testGameOver()) {
            tetris.embedCurrentPiece();
            tetris.pieceCurrent = null;
            tetris.pieceCurrentX = 0;
            tetris.pieceCurrentY = 0
        }
    };

    this.getWidthCenter = function () {
        return Math.ceil((this.canvas.getWidth() / 2) - (this.pieceCurrent.getHeight() / 2));
    };

    this.getFirstRowInPiece = function () {
        var height = this.pieceCurrent.getHeight(),
            width = this.pieceCurrent.getWidth(),
            i, j;

        for (i = height - 1; i > 0; i--) {
            for (j = 0; j < width; j++) {
                if (this.pieceCurrent.get(i, j) != 0) {
                    return -i;
                }
            }
        }
    };

    this.getNextPiece = function () {
        if (!this.pieceNext) {
            this.pieceNext = this.piecesCollection.getRand();
        }

        this.pieceCurrent = this.pieceNext;
        this.pieceNext = this.piecesCollection.getRand();

        this.pieceNext.preview();

        this.pieceCurrentX = this.getFirstRowInPiece();
        this.pieceCurrentY = this.getWidthCenter();
    };

    this.displayPiece = function () {
        var currentWidth = this.pieceCurrent.getWidth();
        var currentHeight = this.pieceCurrent.getHeight();
        var currentX = this.pieceCurrentX;
        var currentY = this.pieceCurrentY;

        for (var x = 0; x < currentWidth; x++) {
            for (var y = 0; y < currentHeight; y++) {
                if ((currentX + x) >= 0 && this.pieceCurrent.get(x, y) != 0) {
                    document.getElementById("cellX" + (x + currentX) + "Y" + (y + currentY)).bgColor = this.pieceCurrent.get(x, y);
                }
            }
        }
    };

    this.loadCurrentPiece = function (x, y) {
        var pieceWidth = this.pieceCurrent.getWidth(),
            pieceHeight = this.pieceCurrent.getHeight(),
            celPositionX, celPositionY;

        for (var i = 0; i < pieceWidth; i++) {
            for (var j = 0; j < pieceHeight; j++) {
                celPositionX = i + this.pieceCurrentX + x;
                celPositionY = j + this.pieceCurrentY + y;
                if (this.pieceCurrent.get(i, j) != 0 && (
                        celPositionY < 0 ||
                        celPositionY > this.canvas.getWidth() ||
                        celPositionX >= this.canvas.getHeight() ||
                        (celPositionX >= 0 && this.canvas.get(celPositionX, celPositionY) != 0)
                    )
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    this.endGame = function () {
        clearInterval(this.timer);
        this.timer = false;
        this.finished = true;
        alert("game over!");
        document.getElementById("play").innerHTML = "Start!";
    };

    this.embedCurrentPiece = function () {
        var width = this.pieceCurrent.getWidth();
        var height = this.pieceCurrent.getHeight();
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                if (this.pieceCurrent.get(i, j) != 0) {
                    this.canvas.set((i + this.pieceCurrentX), (j + this.pieceCurrentY), this.pieceCurrent.get(i, j));
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
            this.eliminateRows(rowsToEliminate[i])
        }
        return rowsToEliminate.length;
    };
    this.eliminateRows = function (rows) {
        var i, j;
        for (i = rows; i > 0; i--) {
            for (j = 0; j < this.canvas.getWidth(); j++) {
                this.canvas.set(i, j, this.canvas.get(i - 1, j))
            }
        }
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

    this.actionRotate = function () {
        this.pieceCurrent.rotation();
        if (!tetris.loadCurrentPiece(0, 0)) {
            this.pieceCurrent.rotation();
            this.pieceCurrent.rotation();
            this.pieceCurrent.rotation();
        }
    };

    this.actionDown = function (nrOfElements) {
        for (var i = 0; i < nrOfElements; i++) {
            if (this.loadCurrentPiece(1, 0)) {
                this.pieceCurrentX++;
            } else {
                break;
            }
        }
    };

    this.actionLeft = function (nrOfElements) {
        for (var i = 0; i < nrOfElements; i++) {
            if (this.loadCurrentPiece(0, -1)) {
                this.pieceCurrentY--;
            } else {
                break;
            }
        }
    };

    this.actionRight = function (nrOfElements) {
        for (var i = 0; i < nrOfElements; i++) {
            if (this.loadCurrentPiece(0, +1)) {
                this.pieceCurrentY++;
            } else {
                break;
            }
        }
    };

    this.movePiece = function (event) {
        if (tetris.pieceCurrent == null || !tetris.timer) {
            return false;
        }

        var KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_LEFT = 37,
            KEY_RIGHT = 39;

        var keyCode = event.which || window.event.keyCode;

        switch (keyCode) {
            case KEY_UP:
                tetris.actionRotate();
                break;
            case KEY_DOWN:
                tetris.actionDown(1);
                break;
            case KEY_LEFT:
                tetris.actionLeft(1);
                break;
            case KEY_RIGHT:
                tetris.actionRight(1);
                break;
            default:
                return false;
        }

        tetris.displayTable();
        return true;
    };
};

var tetris = new classTetris(piecesCollection, canvas);
tetris.reset();
tetris.pause(true);

document.addEventListener('keydown', function (event) {
    var moved = tetris.movePiece(event);
    if (moved) {
        event.preventDefault();
    }
}, false);

var touchHandler = function (element) {

    var startX, startY, posX, posY;

    var touchStart = function (event) {
        var object = event.changedTouches[0];
        startX = parseInt(object.clientX);
        startY = parseInt(object.clientY);
        event.preventDefault();
    };

    this.numberOfElements = function (size) {
        return Math.ceil(Math.abs(size) / tetris.elementSize);
    };

    var touchEnd = function (event) {
        console.log('bbbbbb');
        var object = event.changedTouches[0];
        posX = parseInt(object.clientX);
        posY = parseInt(object.clientY);

        switch (calculateDirection(posX, posY)) {
            case 'left':
                tetris.actionLeft(this.numberOfElements(posX - startX));
                break;
            case 'right':
                tetris.actionRight(this.numberOfElements(posX - startX));
                break;
            case 'down':
                tetris.actionDown(this.numberOfElements(posY - startY));
                break;
            case 'none':
                tetris.actionRotate();
                break;
        }
        event.preventDefault();
    };

    element.addEventListener('touchstart', touchStart.bind(this), false);
    element.addEventListener('touchmove', function (event) {
        console.log('move');
        event.preventDefault();
    }, false);
    element.addEventListener('touchend', touchEnd.bind(this), false);
    element.addEventListener('touchcancel', touchEnd.bind(this), false);

    var calculateDirection = function (posX, posY) {

        var diffX = posX - startX,
            diffY = posY - startY,
            absDiffX = Math.abs(diffX),
            absDiffY = Math.abs(diffY);

        if (absDiffX < tetris.elementSize && absDiffY < tetris.elementSize) {
            return 'none';
        }

        if (absDiffX > absDiffY) {
            return (diffX > 0) ? 'right' : 'left';
        } else {
            return (diffY > 0) ? 'down' : 'up';
        }
    };

};

touchHandler(document.getElementById("canvas-overlay"));
// 398