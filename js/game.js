var classTetris = function (piecesCollection, canvas, displayHandler) {
    this.piecesCollection = piecesCollection;
    this.canvas = canvas;
    this.displayHandler = displayHandler;
    this.elementSize = this.displayHandler.getMainTableWidth() / this.canvas.getWidth();

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
        this.displayHandler.displayMainTable(
            this.canvas.displayPiece(this.pieceCurrent, this.pieceCurrentX, this.pieceCurrentY)
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

        this.pieceNext.preview(this.displayHandler.previewPiece);

        this.pieceCurrentX = -this.pieceCurrent.getFirstRowInPiece();
        this.pieceCurrentY = this.getWidthCenter();
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

        var that = this;
        rowsToEliminate.forEach(function (row) {
            that.canvas.eliminateRow(row);
        });

        return rowsToEliminate.length;
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
        return this.move({x: 1, y: 0});
    };

    this.actionLeft = function () {
        return this.move({x: 0, y: -1});
    };

    this.actionRight = function () {
        return this.move({x: 0, y: 1});
    };

    this.move = function (moveMatrix) {
        if (this.testCurrentPiecePosition(moveMatrix.x, moveMatrix.y)) {
            this.pieceCurrentX += moveMatrix.x;
            this.pieceCurrentY += moveMatrix.y;
            return true;
        }
    };
};

window.onload = function () {

    var piecesCollection = pieceFactoryCollection();
    piecesCollection.addPiece(pieceFactory(3, 3, "#FF0000", [[0, 0], [0, 1], [1, 1], [1, 2]]))
        .addPiece(pieceFactory(4, 4, "#00FF00", [[1, 0], [1, 1], [1, 2], [1, 3]]))
        .addPiece(pieceFactory(3, 3, "#2984D7", [[1, 1], [2, 0], [2, 1], [1, 2]]))
        .addPiece(pieceFactory(3, 3, "#CCCCCC", [[1, 1], [2, 0], [2, 1], [2, 2]]))
        .addPiece(pieceFactory(4, 4, "#DE397B", [[1, 1], [1, 2], [2, 1], [2, 2]]))
        .addPiece(pieceFactory(3, 3, "#259463", [[1, 0], [1, 1], [1, 2], [2, 2]]))
        .addPiece(pieceFactory(3, 3, "#BD6B31", [[2, 0], [2, 1], [2, 2], [1, 2]]));

    var tetris = new classTetris(piecesCollection, canvasFactory(20, 10), displayHandler());
    tetris.reset();
    tetris.pause(true);

    keyHandler(tetris);

    touchHandler(tetris, document.getElementById("canvas-overlay"));
};
// 398