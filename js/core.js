/*
JavaScript HitPlane
Code: https://github.com/sqmscm/hitplane
Demo: https://sqmscm.github.io/hitplane
*/
//Core functions
var log = console.log.bind(console); //used to debug
var Game = function(images, runner) {
    var o = {
        keys: {},
        callbacks: {},
        fps: 0,
        collision: 0,
        images: {},
        mouseControl: true,
        keyboardControl: true,
    }
    var canvas = document.getElementById('viewer');
    var context = canvas.getContext('2d');
    //异步加载图片，全部加载完后才会运行！
    var loads = [];
    var names = Object.keys(images);
    for (var i = 0; i < names.length; i++) {
        let name = names[i];
        var path = images[name];
        let img = new Image();
        img.src = path;
        img.onload = function() {
            o.images[name] = img;
            loads.push(1);
            if (loads.length == names.length) {
                runner();
            }
        }
    }
    //Loading Scene
    canvas.height = canvas.height;
    context.font = "30px Courier";
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = "#0000ff";
    context.fillText("Loading...", canvas.width / 2, canvas.height / 2 - 15);
    context.fillText("Please Wait" + window.score, canvas.width / 2, canvas.height / 2 + 15);
    //set background
    o.setBackground = function(image) {
        o.bg = SImage(image);
        o.bg.y = canvas.height - o.bg.img.height / 2;
        o.bg.width = canvas.width;
        o.bg.height = o.bg.img.height / 2;
    }
    //draw items
    o.draw = function(item) {
        if (item.rotate) {
            context.save(); //保存画布状态
            context.translate(item.x + item.width / 2, item.y + item.height / 2); //以图像中心为原点
            context.rotate(item.rotate * Math.PI / 180); //旋转
            context.translate(-item.x - item.width / 2, -item.y - item.height / 2); //恢复原坐标系原点
        }
        if (item.property == "image") {
            context.drawImage(item.img, item.x, item.y, item.width, item.height);
        } else {
            context.fillStyle = item.color;
            if (item.style == "rect") {
                if (item.stroke) {
                    context.strokeStyle = item.stroke;
                    context.strokeRect(item.x, item.y, item.width, item.height);
                }
                context.fillRect(item.x, item.y, item.width, item.height);
            } else if (item.style == "circle") {
                context.beginPath();
                context.arc(item.x, item.y, item.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fill();
            }
        }
        if (item.rotate) {
            context.restore(); //恢复画布状态
        }
    }
    //events
    o.registerCallback = function(key, callback) {
        window.addEventListener('keydown', function(event) {
            if (event.key == key)
                o.keys[event.key] = true;
        })
        window.addEventListener('keyup', function(event) {
            if (event.key == key)
                o.keys[event.key] = false;
        })
        o.callbacks[key] = callback;
    }
    //Detect collision
    o.detCol = function(bullet, enemy) {
        if (bullet.y <= enemy.y + enemy.height && bullet.y + bullet.height >= enemy.y) {
            if (bullet.x + bullet.width >= enemy.x && bullet.x <= enemy.x + enemy.width) {
                return true;
            }
        }
        return false;
    }
    //Update score
    o.updateScore = function() {
        if (window.over) {
            o.end();
            var string = "Game Over~";
            if (window.win)
                string = "You Win!";
            canvas.height = canvas.height;
            context.font = "30px Courier";
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = "#0000ff";
            context.fillText(string, canvas.width / 2, canvas.height / 2 - 15);
            context.fillText("Score: " + window.score, canvas.width / 2, canvas.height / 2 + 15);
            return;
        }
        context.strokeStyle = "#0000ff";
        context.font = "10px Courier";
        context.strokeText("Score: " + window.score, 5, canvas.height - 5);
    }
    //Enable drug
    o.enableDrag = function(element, mode) {
        var ofx, ofy;
        canvas.addEventListener('mousedown', function(event) {
            if (!o.mouseControl)
                return;
            if (o.isInside(element, event.offsetX, event.offsetY)) {
                ofx = event.offsetX - element.x;
                ofy = event.offsetY - element.y;
                element.selected = true;
            } else element.selected = false;
        });
        canvas.addEventListener('mousemove', function(event) {
            if (!o.mouseControl)
                return;
            if (element.style == "circle") {
                element.width = element.radius;
                element.height = element.radius;
            }
            if (element.selected) {
                if ((mode == "horizon" || mode == "plane") &&
                    event.offsetX - ofx <= canvas.width - element.width &&
                    event.offsetX - ofx >= 0)
                    element.x = event.offsetX - ofx;
                if ((mode == "vertical" || mode == "plane") &&
                    event.offsetY - ofy <= canvas.height - element.height &&
                    event.offsetY - ofy >= 0)
                    element.y = event.offsetY - ofy;
                if (o.fps < 1) {
                    canvas.height = canvas.height;
                    o.render();
                }
            }
        });
        canvas.addEventListener('mouseup', function(event) {
            if (!o.mouseControl)
                return;
            element.selected = false;
        });
    }
    //Enable click
    o.enableClick = function(element, movement) {
        canvas.addEventListener('click', function(event) {
            if (o.isInside(element, event.offsetX, event.offsetY))
                movement();
        });
    }
    //Check if a point is inside an element
    o.isInside = function(element, offsetX, offsetY) {
        if (element.style == "rect" && offsetX >= element.x &&
            offsetX <= element.x + element.width && offsetY >= element.y &&
            offsetY <= element.y + element.height)
            return true;
        if (element.style == "circle") {
            var tempX = offsetX - element.x;
            var tempY = offsetY - element.y;
            if (Math.sqrt(tempX * tempX + tempY * tempY) <= element.radius)
                return true;
        }
        return false;
    }
    //Control fps
    o.updateFPS = function(fps) {
        var data;
        if (fps) {
            data = fps;
        } else {
            data = 30;
        }
        o.fps = data;
    }
    //Running loop
    o.running = function() {
        if (o.fps >= 1) {
            var keys = Object.keys(o.keys);
            for (var i = 0; i < keys.length; i++) {
                if (o.keys[keys[i]] && o.keyboardControl)
                    o.callbacks[keys[i]]();
            }
            canvas.height = canvas.height; //clear canvas
            if (o.bg) {
                o.draw(o.bg); //draw background
                o.bg.y++;
                if (o.bg.y > 0)
                    o.bg.y = canvas.height - o.bg.img.height / 2;
            }
            o.render();
            o.collision = 0; //clear the times.
        }
        setTimeout(function() {
            o.running();
        }, 1000 / o.fps)
    }
    //Termination
    o.end = function() {
        o.running = function() {}
    }

    return o;
}
