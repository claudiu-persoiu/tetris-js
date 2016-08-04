var scoreHandler = function (element) {
    var score = 0;
    var publishScore = function () {
        element.innerHTML = score.toString();
    };

    return {
        reset: function () {
            score = 0;
            publishScore();
        },
        addRows: function (rows) {
            score += rows * 100;
            publishScore();
        },
        addElement: function () {
            score++;
            publishScore();
        },
        getState: function () {
            return score;
        },
        setState: function (newState) {
            score = newState;
            publishScore();
        }
    }
};