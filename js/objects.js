/*
JavaScript HitPlane
Code: https://github.com/sqmscm/hitplane
Demo: https://sqmscm.github.io/hitplane
*/
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
    return o;
}
