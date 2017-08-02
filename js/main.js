/*
JavaScript HitPlane
Code: https://github.com/sqmscm/hitplane
Demo: https://sqmscm.github.io/hitplane
*/
//main
var main = function() {
    var canvas = document.getElementById('viewer');
    var images = {
        bg: "img/bg.png",
        plane: "img/plane.png",
        bullet: "img/bullet.png",
        enemy1: "img/enemy1.png",
        enemy1die: "img/enemy1die.png",
        enemy2: "img/enemy2.png",
        enemy2die: "img/enemy2die.png",
        planedie: "img/planedie.png",
    }
    var game = Game(images, function() {
        game.setBackground(game.images["bg"]);
        var plane = CImage(game.images["plane"]);
        plane.width /= 2;
        plane.height /= 2;
        plane.x = canvas.width / 2 - plane.width / 2;
        plane.y = canvas.height - plane.height;
        window.score = 0;
        window.over = false;
        var bullets = [];
        var enemies = [];
        var bulletCounts = 0;
        var enemyCounts = 0;
        game.render = function() {
            game.draw(plane);
            //Fire 5 bullet per second
            if (bulletCounts++ == game.fps / 5 && plane.alive == true) {
                var bullet = Bullet(game.images["bullet"], plane.x + plane.width / 2, plane.y)
                bullet.x -= bullet.width / 2;
                bullet.y -= bullet.height;
                bullets.push(bullet);
                bulletCounts = 0;
            }
            //Enter two enemy per second
            if (enemyCounts++ == game.fps/2) {
                var enemy;
                var kind = Math.floor(Math.random() * 2);
                if (kind == 0) {
                    enemy = Enemy(game.images["enemy1"], game.images["enemy1die"]);
                    enemy.width /= 2;
                    enemy.height /= 2;
                    enemy.x = Math.floor(Math.random() * (canvas.width - enemy.width));
                    enemy.y = -enemy.height;
                } else if (kind == 1) {
                    enemy = Enemy(game.images["enemy2"], game.images["enemy2die"]);
                    enemy.width /= 2;
                    enemy.height /= 2;
                    enemy.x = canvas.width;
                    enemy.y = Math.floor(Math.random() * (canvas.height - enemy.height));
                    enemy.speedY = 0;
                    enemy.speedX = -10;
                }
                enemies.push(enemy);
                enemyCounts = 0;
            }
            //Collide Detect
            for (var i = 0; i < bullets.length; i++) {
                for (var j = 0; j < enemies.length; j++) {
                    if (enemies[j].alive) {
                        if (game.detCol(bullets[i], enemies[j])) {
                            bullets[i].alive = false;
                            enemies[j].showDieAnimation = game.fps / 2;
                            enemies[j].alive = false;
                            enemies[j].img = enemies[j].dieimg;
                            window.score += 100;
                        } else if (game.detCol(plane, enemies[j])) {
                            enemies[j].showDieAnimation = game.fps / 2;
                            enemies[j].alive = false;
                            enemies[j].img = enemies[j].dieimg;
                            plane.showDieAnimation = game.fps / 2;
                            plane.alive = false;
                            plane.img = game.images["planedie"];
                        }
                    }
                }
            }
            //rende bullets
            for (var i = 0; i < bullets.length; i++) {
                game.draw(bullets[i]);
                if (bullets[i].alive)
                    bullets[i].move();
                if (bullets[i].y < 0 || !bullets[i].alive) {
                    bullets.splice(i, 1);
                }
            }
            //rende enemies
            for (var i = 0; i < enemies.length; i++) {
                game.draw(enemies[i])
                if (enemies[i].alive)
                    enemies[i].move();
                if (enemies[i].x + enemies[i].width < 0 || enemies[i].x > canvas.width || enemies[i].y > canvas.height ||
                    (!enemies[i].alive && enemies[i].showDieAnimation-- == 0)) {
                    enemies.splice(i, 1);
                }
            }
            if (!plane.alive && plane.showDieAnimation-- === 0)
                window.over = true;
            game.updateScore();
        }
        game.enableDrag(plane, "plane");
        //Start running
        game.updateFPS();
        game.running();
    });
    //reg callbacks
    // game.registerCallback('a', paddle.moveLeft);
    // game.registerCallback('d', paddle.moveRight);
    // game.registerCallback('f', ball.fire);
}
main();
