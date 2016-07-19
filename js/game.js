var tetrisFactory = function (piecesCollection, canvas, displayHandler, scoreHandler) {
    var elementSize = displayHandler.getMainTableWidth() / canvas.getWidth();
    var currentPiece = null,
        currentPieceX, currentPieceY,
        speed = 1000,
        timer = false,
        status = false,
        pieceNext,
        playButton = document.getElementById("play");

    var reset = function () {
        currentPiece = null;
        scoreHandler.reset();
        speed = 1000;
        timer = false;
        status = false;
        canvas.reset();
        playButton.innerHTML = "Pause";
        playButton.addEventListener('click', function () {
            pause(true);
        }.bind(this), false);
    };

    var displayTable = function () {
        displayHandler.displayMainTable(
            canvas.displayPiece(currentPiece, currentPieceX, currentPieceY)
        );
    };

    var testGameOver = function () {
        if (currentPieceX < 0) {
            endGame();
            return true;
        }
    };

    var play = function () {
        if (currentPiece == null) {
            getNextPiece()
        }

        displayTable();

        if (testCurrentPiecePosition(1, 0)) {
            currentPieceX++
        } else if (!testGameOver()) {
            embedCurrentPiece();
            currentPiece = null;
            currentPieceX = 0;
            currentPieceY = 0
        }
    };

    var getWidthCenter = function () {
        return Math.ceil((canvas.getWidth() / 2) - (currentPiece.getHeight() / 2));
    };

    var getNextPiece = function () {
        if (!pieceNext) {
            pieceNext = piecesCollection.getRand();
        }

        currentPiece = pieceNext;
        pieceNext = piecesCollection.getRand();

        pieceNext.preview(displayHandler.previewPiece);

        currentPieceX = -currentPiece.getFirstRowInPiece();
        currentPieceY = getWidthCenter();
    };

    var testCurrentPiecePosition = function (x, y) {
        if (!currentPiece) {
            return false;
        }

        var pieceWidth = currentPiece.getWidth(),
            pieceHeight = currentPiece.getHeight(),
            celPositionX, celPositionY;

        for (var i = 0; i < pieceWidth; i++) {
            for (var j = 0; j < pieceHeight; j++) {
                celPositionX = i + currentPieceX + x;
                celPositionY = j + currentPieceY + y;
                if (currentPiece.get(i, j) != 0 && (
                        celPositionY < 0 ||
                        celPositionY >= canvas.getWidth() ||
                        celPositionX >= canvas.getHeight() ||
                        (celPositionX >= 0 && canvas.get(celPositionX, celPositionY) != 0)
                    )
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    var endGame = function () {
        clearInterval(timer);
        timer = false;
        status = true;
        alert("game over!");
        playButton.innerHTML = "Start!";
    };

    var embedCurrentPiece = function () {
        var width = currentPiece.getWidth();
        var height = currentPiece.getHeight();
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                if (currentPiece.get(i, j) != 0) {
                    canvas.set((i + currentPieceX), (j + currentPieceY), currentPiece.get(i, j));
                }
            }
        }
        var eliminatedRows = testRow();
        if (eliminatedRows) {
            scoreHandler.addRows(eliminatedRows);
        }
        scoreHandler.addElement();
    };

    var testRow = function () {
        var rowsToEliminate = [];
        var i, j;
        for (i = 0; i < canvas.getHeight(); i++) {
            var fullRow = true;
            for (j = 0; j < canvas.getWidth(); j++) {
                if (canvas.get(i, j) == 0) {
                    fullRow = false;
                    break
                }
            }
            if (fullRow == true) {
                rowsToEliminate.push(i)
            }

        }

        rowsToEliminate.forEach(function (row) {
            canvas.eliminateRow(row);
        });

        return rowsToEliminate.length;
    };

    var pause = function (playing) {
        if (timer) {
            clearInterval(timer);
            timer = false;
        } else if (playing) {
            if (status == true) {
                reset()
            }
            timer = setInterval(function () {
                play();
            }, speed);
        }

        playButton.innerHTML = timer ? "pause" : "play";
    };

    var actionRotate = function () {
        if (!currentPiece) {
            return;
        }
        currentPiece.rotation();
        if (!testCurrentPiecePosition(0, 0)) {
            currentPiece.rotation();
            currentPiece.rotation();
            currentPiece.rotation();
            return false;
        }

        return true;
    };

    var move = function (moveMatrix) {
        if (testCurrentPiecePosition(moveMatrix.x, moveMatrix.y)) {
            currentPieceX += moveMatrix.x;
            currentPieceY += moveMatrix.y;
            return true;
        }
    };

    return {
        reset: function () {
            return reset();
        },
        actionDown: function () {
            return move({x: 1, y: 0});
        },
        actionLeft: function () {
            return move({x: 0, y: -1});
        },
        actionRight: function () {
            return move({x: 0, y: 1});
        },
        actionRotate: function () {
            return actionRotate();
        },
        pause: function (play) {
            return pause(play);
        },
        displayTable: function () {
            displayTable();
        },
        getElementSize: function () {
            return elementSize;
        },
        playing: function () {
            return timer !== false;
        }
    }
};
