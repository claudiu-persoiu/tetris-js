var keyHandler = function (game) {

    var movePiece = function (event) {
        if (game.pieceCurrent == null || !game.timer) {
            return false;
        }

        var KEY_UP = 38,
            KEY_DOWN = 40,
            KEY_LEFT = 37,
            KEY_RIGHT = 39,
            keyCode = event.which || window.event.keyCode,
            actionPerformed = false;

        switch (keyCode) {
            case KEY_UP:
                actionPerformed = game.actionRotate();
                break;
            case KEY_DOWN:
                actionPerformed = game.actionDown();
                break;
            case KEY_LEFT:
                actionPerformed = game.actionLeft();
                break;
            case KEY_RIGHT:
                actionPerformed = game.actionRight();
                break;
            default:
                return false;
        }

        if (actionPerformed) {
            game.displayTable();
        }

        return true;
    };

    document.addEventListener('keydown', function (event) {
        if (movePiece(event)) {
            event.preventDefault();
        }
    }, false);
};