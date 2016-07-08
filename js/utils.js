if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function (needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

if (typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(this, [this[i], i, this]);
        }
    };
}

if (typeof  Array.prototype.findIndex !== 'function') {
    Array.prototype.findIndex = function (predicate, thisValue) {
        var arr = Object(this);
        if (typeof predicate !== 'function') {
            throw new TypeError();
        }
        for (var i = 0; i < arr.length; i++) {
            if (i in arr) {  // skip holes
                var elem = arr[i];
                if (predicate.call(thisValue, elem, i, arr)) {
                    return i;  // (1)
                }
            }
        }
        return -1;  // (2)
    }
}

Array.prototype.getClone = function () {
    var clone = JSON.parse(JSON.stringify(this));
    return clone;
};

var generateEmptyMatrix = function (x, y) {
    var matrix = [], i, j;
    for (i = 0; i < x; i++) {
        matrix[i] = [];
        for (j = 0; j < y; j++) {
            matrix[i][j] = 0
        }
    }
    return matrix;
};

var buildDOMTable = function (canvas) {

    var table = document.createElement("table"),
        tbody = document.createElement("tbody"),
        tr, td, color, i, j;
    table.appendChild(tbody);

    for (i = 0; i < canvas.getHeight(); i++) {
        tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (j = 0; j < canvas.getWidth(); j++) {
            td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode(" "));
            color = canvas.get(i, j);
            td.bgColor = color != 0 ? color : '';
        }
    }

    return table;
};