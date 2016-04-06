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
    function scrollTo(scrollTargetY, speed, easing) {
        if (scrollTargetY === void 0) { scrollTargetY = 0; }
        if (speed === void 0) { speed = 2000; }
        if (easing === void 0) { easing = 'easeOutSine'; }
        var scrollY = window.scrollY, currentTime = 0;
        var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
        var PI_D2 = Math.PI / 2, easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };
        function tick() {
            currentTime += 1 / 60;
            var p = currentTime / time;
            var t = easingEquations[easing](p);
            if (p < 1) {
                requestAnimationFrame(tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            }
            else {
                window.scrollTo(0, scrollTargetY);
            }
        }
        tick();
    }
    var nav = document.getElementsByTagName('nav')[0];
    var titles = document.querySelectorAll('h1.title, h2.title');
    var _loop_1 = function(i) {
        var title = titles[i];
        var child = document.createElement('div');
        child.setAttribute('data-nbr', i.toString());
        child.id = 'nbr' + i;
        child.classList.add('circle');
        child.classList.add(title.tagName == 'H1' ? 'big' : 'small');
        child.onclick = function () {
            var o = parseInt(document.querySelector('.circle.selected').getAttribute('data-nbr'));
            if (o + 1 == i) {
                var os_1 = window.onscroll;
                window.onscroll = null;
                nav.getElementsByClassName('circle')[o].classList.remove('selected');
                nav.getElementsByClassName('circle')[i].classList.add('selected');
                setTimeout(function () {
                    window.onscroll = os_1;
                }, 400);
            }
            else if (o == i + 1) {
                var os_2 = window.onscroll;
                window.onscroll = null;
                nav.getElementsByClassName('circle')[o].classList.remove('selected');
                nav.getElementsByClassName('circle')[i].classList.add('selected');
                setTimeout(function () {
                    window.onscroll = os_2;
                }, 400);
            }
            scrollTo(title['offsetTop']);
        };
        child.appendChild(document.createElement('div'));
        if (i == 0)
            child.classList.add('selected');
        nav.appendChild(child);
        nav.appendChild(document.createElement('br'));
    };
    for (var i = 0; i < titles.length; i++) {
        _loop_1(i);
    }
    ;
    var currentlySelected = 0;
    window.onscroll = function () {
        for (var i = titles.length - 1; i > -1; i--) {
            var title = titles[i];
            if (title.getBoundingClientRect().top <= 1) {
                if (i == currentlySelected)
                    break;
                document.getElementById('nbr' + currentlySelected).classList.remove('selected');
                document.getElementById('nbr' + i).classList.add('selected');
                currentlySelected = i;
                break;
            }
        }
    };
    var designSection = document.querySelector('.design');
    var codingSection = document.querySelector('.coding');
    document.querySelector('.design .exbtn').addEventListener("click", function (e) {
        designSection.classList.add('expanded');
        e.preventDefault();
        return false;
    });
    document.querySelector('.coding .exbtn').addEventListener("click", function (e) {
        codingSection.classList.add('expanded');
        e.preventDefault();
        return false;
    });
    document.querySelector('.design .shbtn').addEventListener("click", function (e) {
        designSection.classList.remove('expanded');
        e.preventDefault();
        return false;
    });
    document.querySelector('.coding .shbtn').addEventListener("click", function (e) {
        codingSection.classList.remove('expanded');
        e.preventDefault();
        return false;
    });
};
