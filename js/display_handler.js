var displayHandler = function () {

    var nextElement = document.getElementById("next"),
        canvasElement = document.getElementById("canvas");


    var displayMatrix = function (element, matrix) {
        element.innerHTML = "";
        element.appendChild(
            buildDOMTable(matrix)
        );
    };

    return {
        displayMainTable: function (matrixToDisplay) {
            displayMatrix(canvasElement, matrixToDisplay);
        },
        previewPiece: function (matrixToDisplay) {
            displayMatrix(nextElement, matrixToDisplay);
        },
        getMainTableWidth: function () {
            return canvasElement.offsetWidth;
        }
    }
};
