
var canvasFactory = function (height, width) {
    var matrix = [],
        currentFactory = arguments.callee;

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
            var tempCanvas = currentFactory(height, width);
            tempCanvas.setMatrix(matrix);

            piece.forEach(function (color, i, j) {
                if ((i + x) >= 0 && color != 0) {
                    tempCanvas.set((i + x), (j + y), color);
                }
            });

            return tempCanvas;
        },
        eliminateRow: function (row) {
            var i, j;
            for (i = row; i > 0; i--) {
                for (j = 0; j < width; j++) {
                    this.set(i, j, this.get(i - 1, j))
                }
            }
        }
    };
};