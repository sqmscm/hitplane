/*
JavaScript HitPlane
Code: https://github.com/sqmscm/hitplane
Demo: https://sqmscm.github.io/hitplane
*/
//A tool
var Tool = function(a, b) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        speedY: 2,
        speedX: 2,
        alive: true,
        rotate: 0,
        rotateSpeed: -1,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    o.move = function(canvas) {
        if ((o.speedX > 0 && o.x <= canvas.width - o.speedX - o.width) ||
            (o.speedX < 0 && o.x + o.speedX >= 0))
            o.x += o.speedX;
        else {
            o.speedX = -o.speedX;
            o.x += o.speedX;
        }
        o.y += o.speedY;
        o.rotate += o.rotateSpeed;
        if (o.rotate <= -20 || o.rotate >= 20)
            o.rotateSpeed = -o.rotateSpeed;
    }
    o.hit = function() {
        o.alive = false;
    }
    return o;
}
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
        showDieAnimation: 0,
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
    o.hit = function() {
        o.blood -= 100;
        if (o.blood <= 0 && o.stage == 4) {
            o.showDieAnimation = 5;
            o.img = o.dieimg;
            o.alive = false;
            o.stage = 5;
            window.score += 500;
        } else if (o.blood <= 500 && o.stage == 3) {
            o.img = o.stage4;
            o.stage = 4;
            window.score += 500;
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
//A plane
var Plane = function(a) {
    var canvas = document.getElementById('viewer');
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        alive: true,
        showDieAnimation: -1,
        speed: 10,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    o.moveLeft = function() {
        if (o.x >= o.speed)
            o.x -= o.speed;
    }
    o.moveRight = function() {
        if (o.x <= canvas.width - o.speed - o.width)
            o.x += o.speed;
    }
    o.moveUp = function() {
        if (o.y >= o.speed)
            o.y -= o.speed;
    }
    o.moveDown = function() {
        if (o.y <= canvas.height - o.speed - o.height)
            o.y += o.speed;
    }
    o.die = function(game) {
        o.showDieAnimation = game.fps / 2;
        o.alive = false;
        o.img = game.images["planedie"];
        game.mouseControl = false;
        game.keyboardControl = false;
    }
    return o;
}
//a bullet
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
//A Simple Image
var SImage = function(a) {
    var o = {
        style: "rect",
        property: "image",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }
    o.img = a;
    o.width = o.img.width;
    o.height = o.img.height;
    return o;
}
