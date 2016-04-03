window.onload = () => {

    // miscillaneous
    function getByClassName(str: string) : Element {
        return document.getElementsByClassName(str)[0];
    }

    function anyOf<T>(...possibilities: T[]) : T {
        let nbr = Math.floor(Math.random() * possibilities.length);
        return possibilities[nbr];
    }

    function choose<T>(...possibilities: [number, T][]) : T {
        let arr = new Array<number>();

        for (let i = 0; i < possibilities.length; i++) {
            for (let o = 0; o < Math.ceil(possibilities[i][0] * 100); o++) {
                arr.push(i);
            }
        }

        return possibilities[arr[Math.floor(Math.random() * arr.length)]][1];
    }

    function between(min, max: number) : number {
        return min + Math.floor(max * Math.random());
    }

    function scrollTo(scrollTargetY: number = 0, speed: number = 2000, easing: string = 'easeOutSine') : void {
        let scrollY = window.scrollY,
            currentTime = 0;

        // min time .1, max time .8 seconds
        let time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        let PI_D2 = Math.PI / 2,
            easingEquations = {
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

        // add animation loop
        function tick() {
            currentTime += 1 / 60;

            let p = currentTime / time;
            let t = easingEquations[easing](p);

            if (p < 1) {
                requestAnimationFrame(tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
            }
        }

        // call it once to get started
        tick();
    }

    // consts
    const nav = document.getElementsByTagName('nav')[0];
    const titles = document.querySelectorAll('h1.title, h2.title');

    // making navbar
    for (let i = 0; i < titles.length; i++) {
        let title = titles[i];
        let child = document.createElement('div');

        child.setAttribute('data-nbr', i.toString());
        child.id = 'nbr' + i;
        child.classList.add('circle');
        child.classList.add(title.tagName == 'H1' ? 'big' : 'small');
        child.onclick = () => {
            let o = parseInt(document.querySelector('.circle.selected').getAttribute('data-nbr'));

            if (o + 1 == i) { // next
                let os = window.onscroll;
                window.onscroll = null;
                nav.getElementsByClassName('circle')[o].classList.remove('selected');
                nav.getElementsByClassName('circle')[i].classList.add('selected');

                setTimeout(() => {
                    window.onscroll = os;
                }, 400);
            } else if (o == i + 1) { // previous
                let os = window.onscroll;
                window.onscroll = null;
                nav.getElementsByClassName('circle')[o].classList.remove('selected');
                nav.getElementsByClassName('circle')[i].classList.add('selected');

                setTimeout(() => {
                    window.onscroll = os;
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

    // watch scroll
    let currentlySelected = 0;
    window.onscroll = () => {
        for (let i = titles.length - 1; i > -1; i--) {
            let title = titles[i];

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
};
