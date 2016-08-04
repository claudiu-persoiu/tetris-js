var stateHandler = function () {

    var STATE_KEY = "game_state";

    return {
        saveState: function (state) {
            localStorage.setItem(STATE_KEY, JSON.stringify(state));
        },
        getState: function () {
            var state = localStorage.getItem(STATE_KEY);
            if (state) {
                return JSON.parse(state);
            }

            return false;
        },
        clearState: function () {
            localStorage.removeItem(STATE_KEY);
        }
    }
};