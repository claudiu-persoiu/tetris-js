var tetrisFactory = function (piecesCollection, canvas, displayHandler, scoreHandler, stateHandler) {
    var elementSize = displayHandler.getMainTableWidth() / canvas.getWidth(),
        STATUS_PLAYING = 1,
        STATUS_FINISHED = 2,
        STATUS_PAUSED = 3,
        currentPiece = null,
        currentPieceX, currentPieceY,
        speed = 1000,
        timer,
        status = STATUS_FINISHED,
        nextPiece,
        playButton = document.getElementById("play");

    playButton.addEventListener('click', function () {
        pause();
    }.bind(this), false);

    var reset = function () {
        currentPiece = null;
        scoreHandler.reset();
        speed = 1000;
        canvas.reset();
        playButton.innerHTML = "pause";
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
        saveState();

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
        if (!nextPiece) {
            nextPiece = piecesCollection.getRand();
        }

        currentPiece = nextPiece;
        nextPiece = piecesCollection.getRand();

        nextPiece.preview(displayHandler.previewPiece);

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
        status = STATUS_FINISHED;
        displayHandler.finished();
        stateHandler.clearState();
        playButton.innerHTML = "play";
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

    var pause = function () {
        if (status == STATUS_PLAYING) {
            clearInterval(timer);
            displayHandler.pause();
            status = STATUS_PAUSED;
        } else {
            if (status == STATUS_FINISHED) {
                reset()
            }
            displayHandler.play();
            status = STATUS_PLAYING;
            timer = setInterval(function () {
                play();
            }, speed);
        }

        playButton.innerHTML = status == STATUS_PLAYING ? "pause" : "play";
    };

    var actionRotate = function () {
        if (!currentPiece || status != STATUS_PLAYING) {
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
        if (testCurrentPiecePosition(moveMatrix.x, moveMatrix.y) && status == STATUS_PLAYING) {
            currentPieceX += moveMatrix.x;
            currentPieceY += moveMatrix.y;
            return true;
        }
    };

    var saveState = function () {
        var state = {
            canvas: canvas.getMatrix(),
            currentPiece: currentPiece.getState(),
            currentPieceX: currentPieceX,
            currentPieceY: currentPieceY,
            nextPiece: nextPiece ? nextPiece.getState() : false,
            score: scoreHandler.getState()
        };

        stateHandler.saveState(state);
    };

    var restoreState = function (state) {
        canvas.setMatrix(state.canvas);
        var currentPieceState = state.currentPiece,
            nextPieceState = state.nextPiece;

        currentPieceX = state.currentPieceX;
        currentPieceY = state.currentPieceY;
        currentPiece = pieceFactory(currentPieceState.width, currentPieceState.height, currentPieceState.color, currentPieceState.elements);
        scoreHandler.setState(state.score);
        status = STATUS_PLAYING;
        displayTable();
        if (nextPieceState) {
            nextPiece = pieceFactory(nextPieceState.width, nextPieceState.height, nextPieceState.color, nextPieceState.elements);
            nextPiece.preview(displayHandler.previewPiece);
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
        pause: function () {
            return pause();
        },
        displayTable: function () {
            displayTable();
        },
        getElementSize: function () {
            return elementSize;
        },
        playing: function () {
            return status == STATUS_PLAYING;
        },
        restoreFromState: function () {
            var state = stateHandler.getState();

            if (!state) {
                return;
            }

            restoreState(state);
        }
    }
};
