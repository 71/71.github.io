window.onload = function () {
    function getByClassName(str) {
        return document.getElementsByClassName(str)[0];
    }
    function anyOf() {
        var possibilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            possibilities[_i - 0] = arguments[_i];
        }
        var nbr = Math.floor(Math.random() * possibilities.length);
        return possibilities[nbr];
    }
    function choose() {
        var possibilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            possibilities[_i - 0] = arguments[_i];
        }
        var arr = new Array();
        for (var i = 0; i < possibilities.length; i++) {
            for (var o = 0; o < Math.ceil(possibilities[i][0] * 100); o++) {
                arr.push(i);
            }
        }
        return possibilities[arr[Math.floor(Math.random() * arr.length)]][1];
    }
    function between(min, max) {
        return min + Math.floor(max * Math.random());
    }
    var header = document.getElementsByClassName('header')[0];
    var circles = document.getElementsByClassName('stroke');
    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var length_1 = parseFloat(circle.getAttribute('data-length'));
        var strokelength = between(0, length_1);
    }
    ;
};
