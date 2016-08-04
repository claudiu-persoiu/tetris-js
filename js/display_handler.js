var displayHandler = function () {

    var nextElement = document.getElementById("next"),
        canvasElement = document.getElementById("canvas"),
        overlay = document.getElementById("canvas-overlay");


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
        },
        pause: function () {
            overlay.className = "translucent";
            overlay.innerHTML = "paused...";
        },
        play: function () {
            overlay.className = "";
            overlay.innerHTML = "";
        },
        finished: function () {
            overlay.className = "translucent";
            overlay.innerHTML = "game over...";
        }
    }
};
