/*
JavaScript HitPlane
Code: https://github.com/sqmscm/hitplane
Demo: https://sqmscm.github.io/hitplane
*/
//a boss
var Boss = function(a) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        speedY: 10,
        speedX: 0,
        alive: true,
        showDieAnimation: -1,
        blood: 10000,
        stage: 1,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    o.move = function() {
        if (o.y < 0)
            o.y += o.speedY;
        o.x += o.speedX;
    }
    o.hit = function(fps) {
        o.blood -= 100;
        if (o.stage == 4 && o.showDieAnimation-- <= 0) {
            window.over = true;
        } else if (o.blood <= 0 && o.stage == 3) {
            o.showDieAnimation = fps / 3;
            o.alive == false;
            o.img = o.dieimg;
            o.stage = 4;
            window.score += 1000;
            window.win = true;
        } else if (o.blood <= 3333 && o.stage == 2) {
            o.img = o.stage3;
            o.stage = 3;
            window.score += 1000;
        } else if (o.blood <= 6666 && o.stage == 1) {
            o.img = o.stage2;
            o.stage = 2;
            window.score += 1000;
        }
    }
    return o;
}
//an enemy
var Enemy = function(a, b) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        speedY: 10,
        speedX: 0,
        alive: true,
        showDieAnimation: -1,
    }
    o.img = a;
    o.dieimg = b;
    o.width = o.img.width;
    o.height = o.img.height;
    o.move = function() {
        o.y += o.speedY;
        o.x += o.speedX;
    }
    o.hit = function(fps) {
        o.showDieAnimation = fps / 2;
        o.alive = false;
        o.img = o.dieimg;
        window.score += 100;
    }
    return o;
}
//A image
var CImage = function(a) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        alive: true,
        showDieAnimation: -1,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;

    return o;
}
var Bullet = function(a, setX, setY) {
    var o = {
        style: "rect",
        property: "image",
        x: setX,
        y: setY,
        width: 0,
        height: 0,
        speedY: 20,
        alive: true,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    o.move = function() {
        o.y -= o.speedY;
    }
    o.hit = function(fps) {
        o.y -= Math.floor(Math.random() * 180 + 20);
        o.alive = false;
        o.showDieAnimation = fps / 2;
        o.img = o.dieimg;
        o.width = o.dieimg.width / 2;
        o.height = o.dieimg.height / 2;
    }
    return o;
}
