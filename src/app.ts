/// <reference path="./typings/svg-morpheus.d.ts" />

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

    // consts
    const header = document.getElementsByClassName('header')[0];
    const circles = document.getElementsByClassName('stroke');
};
