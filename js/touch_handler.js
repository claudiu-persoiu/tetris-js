var touchHandler = function (game, element) {
    var originalX, originalY, interX, interY, posX, posY,
        threshold = (game.getElementSize() / 2);

    var touchStart = function (event) {
        [originalX, originalY] = [interX, interY] = [posX, posY] = getCoordsAndPreventDefault(event);
    };

    var touchMoved = function (event) {

        [posX, posY] = getCoordsAndPreventDefault(event);

        var actionPerformed = false;

        switch (calculateDirection(interX, interY, posX, posY)) {
            case 'left':
                actionPerformed = game.actionLeft();
                break;
            case 'right':
                actionPerformed = game.actionRight();
                break;
            case 'down':
                actionPerformed = game.actionDown();
                break;
        }

        if (actionPerformed) {
            interX = posX;
            interY = posY;
            game.displayTable();
        }
    };

    var touchEnd = function (event) {
        [posX, posY] = getCoordsAndPreventDefault(event);

        if (calculateDirection(originalX, originalY, posX, posY) == 'none') {
            game.actionRotate();
            game.displayTable();
            return;
        }

        touchMoved(event);
    };

    element.addEventListener('touchstart', touchStart.bind(this), false);
    element.addEventListener('touchmove', touchMoved.bind(this), false);
    element.addEventListener('touchend', touchEnd.bind(this), false);
    element.addEventListener('touchcancel', touchEnd.bind(this), false);

    var calculateDirection = function (oldX, oldY, posX, posY) {

        var diffX = posX - oldX,
            diffY = posY - oldY,
            absDiffX = Math.abs(diffX),
            absDiffY = Math.abs(diffY);

        if (absDiffX < threshold && absDiffY < threshold) {
            return 'none';
        }

        if (absDiffX > absDiffY) {
            return (diffX > 0) ? 'right' : 'left';
        } else {
            return (diffY > 0) ? 'down' : 'up';
        }
    };

    var getCoordsAndPreventDefault = function (event) {
        event.preventDefault();
        var object = event.changedTouches[0];
        return [
            parseInt(object.clientX),
            parseInt(object.clientY)
        ];
    };
};