var pieceFactoryCollection = function () {
    var pieces = [];

    return {
        addPiece: function (c) {
            pieces.push(c);
            return this;
        },
        getRand: function () {
            var piece = pieces[Math.round(Math.random() * (pieces.length - 1))].getClone(),
                times = Math.round(Math.random() * 4);

            for (var i = 0; i < times; i++) {
                piece.rotation()
            }

            return piece;
        }
    }
};