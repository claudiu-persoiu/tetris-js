
var pieceFactory = function (width, height, color, elements) {
    var elements = elements.getClone(),
        matrix = generateEmptyMatrix(width, height),
        currentFactory = arguments.callee;

    var set = function (x, y) {
        matrix[x][y] = color
    };
    var get = function (x, y) {
        return matrix[x][y]
    };

    elements.forEach(function (element) {
        set(element[0], element[1]);
    }.bind(this));

    var rotation = function () {
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

    var forEach = function (callback) {
        matrix.forEach(function (row, x) {
            row.forEach(function (color, y) {
                callback(color, x, y);
            })
        });
    };
    var getFirstRowInPiece = function () {
        return height - 1 - matrix.getClone().reverse().findIndex(function (row) {
                return row.filter(function (color) {
                        return color != 0;
                    }).length > 0;
            });
    };

    return {
        getFirstRowInPiece: function () {
            return getFirstRowInPiece();
        },
        forEach: function (callback) {
            forEach(callback);
        },
        getClone: function () {
            return currentFactory(width, height, color, elements);
        },
        getHeight: function () {
            return height;
        },
        getWidth: function () {
            return width;
        },
        get: function (x, y) {
            return get(x, y);
        },
        set: function (x, y) {
            return set(x, y);
        },
        preview: function (displayHandler) {
            displayHandler(this);
        },
        rotation: function () {
            rotation();
        }
    }
};