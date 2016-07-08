var classPiecesCollection = function () {
    var pieces = [];

    this.addPiece = function (c) {
        pieces.push(c);
        return this;
    };

    this.getRand = function () {
        var piece = pieces[Math.round(Math.random() * (pieces.length - 1))].getClone(),
            times = Math.round(Math.random() * 4),
            i;

        for (i = 0; i < times; i++) {
            piece.rotation()
        }

        return piece;
    };
};

var classPiece = function (width, height, color, elements) {
    var elements = elements.getClone();
    var matrix = generateEmptyMatrix(width, height);
    var nextContainer = document.getElementById("next");

    this.set = function (x, y) {
        matrix[x][y] = color
    };

    elements.forEach(function (element) {
        this.set(element[0], element[1]);
    }.bind(this));

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
        nextContainer.innerHTML = '';
        nextContainer.appendChild(buildDOMTable(this));
    };
    this.getWidth = function () {
        return width;
    };
    this.getHeight = function () {
        return height;
    };
    this.getClone = function () {
        return new this.constructor(width, height, color, elements);
    };
    this.forEach = function (callback) {
        matrix.forEach(function (row, x) {
            row.forEach(function (color, y) {
                callback(color, x, y);
            })
        });
    };
    this.getFirstRowInPiece = function () {

        return height - 1 - matrix.getClone().reverse().findIndex(function (row, index) {
                return row.filter(function (color) {
                        return color != 0;
                    }).length > 0;
            });
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
    var matrix = [], that = this;

    var generateEmptyCanvas = function () {
        matrix = generateEmptyMatrix(height, width);
    };

    generateEmptyCanvas();

    var displayPiece = function (piece, x, y) {
        var tempCanvas = new that.constructor(height, width);
        tempCanvas.setMatrix(matrix);

        piece.forEach(function (color, i, j) {
            if ((i + x) >= 0 && color != 0) {
                tempCanvas.set((i + x), (j + y), color);
            }
        });

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
            matrix = newMatrix.getClone();
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

var canvas = new classCanvas(20, 10);

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
            this.pause(true);
        }.bind(this), false);
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
        if (this.pieceCurrent == null) {
            this.getNextPiece()
        }

        this.displayTable();

        if (this.testCurrentPiecePosition(1, 0)) {
            this.pieceCurrentX++
        } else if (!this.testGameOver()) {
            this.embedCurrentPiece();
            this.pieceCurrent = null;
            this.pieceCurrentX = 0;
            this.pieceCurrentY = 0
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

        this.pieceNext.preview();

        this.pieceCurrentX = -this.pieceCurrent.getFirstRowInPiece();
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

    this.testCurrentPiecePosition = function (x, y) {
        if (!this.pieceCurrent) {
            return false;
        }

        var pieceWidth = this.pieceCurrent.getWidth(),
            pieceHeight = this.pieceCurrent.getHeight(),
            celPositionX, celPositionY;

        for (var i = 0; i < pieceWidth; i++) {
            for (var j = 0; j < pieceHeight; j++) {
                celPositionX = i + this.pieceCurrentX + x;
                celPositionY = j + this.pieceCurrentY + y;
                if (this.pieceCurrent.get(i, j) != 0 && (
                        celPositionY < 0 ||
                        celPositionY >= this.canvas.getWidth() ||
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

        rowsToEliminate.forEach(function (row) {
            eliminateRow(row);
        });

        return rowsToEliminate.length;
    };
    var eliminateRow = function (rowPosition) {
        var i, j;
        for (i = rowPosition; i > 0; i--) {
            for (j = 0; j < this.canvas.getWidth(); j++) {
                this.canvas.set(i, j, this.canvas.get(i - 1, j))
            }
        }
    };

    this.pause = function (play) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = false;
        } else if (play) {
            if (this.finished == true) {
                this.reset()
            }
            this.timer = setInterval(function () {
                this.play();
            }.bind(this), this.speed);
        }

        document.getElementById("paused").style.display = this.timer ? 'none' : 'block';
    };

    this.actionRotate = function () {
        if (!this.pieceCurrent) {
            return;
        }
        this.pieceCurrent.rotation();
        if (!this.testCurrentPiecePosition(0, 0)) {
            this.pieceCurrent.rotation();
            this.pieceCurrent.rotation();
            this.pieceCurrent.rotation();
            return false;
        }

        return true;
    };

    this.actionDown = function () {
        if (this.testCurrentPiecePosition(1, 0)) {
            this.pieceCurrentX++;
            return true;
        }
    };

    this.actionLeft = function () {
        if (this.testCurrentPiecePosition(0, -1)) {
            this.pieceCurrentY--;
            return true;
        }
    };

    this.actionRight = function () {
        if (this.testCurrentPiecePosition(0, +1)) {
            this.pieceCurrentY++;
            return true;
        }
    };
};

window.onload = function () {
    var tetris = new classTetris(piecesCollection, canvas);
    tetris.reset();
    tetris.pause(true);

    keyHandler(tetris);

    touchHandler(tetris, document.getElementById("canvas-overlay"));
};
// 398