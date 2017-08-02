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
        bulletdie: "img/bulletdie.png",
        enemy1: "img/enemy1.png",
        enemy1die: "img/enemy1die.png",
        enemy2: "img/enemy2.png",
        enemy2die: "img/enemy2die.png",
        planedie: "img/planedie.png",
        boss1: "img/boss1.png",
        boss2: "img/boss2.png",
        boss3: "img/boss3.png",
        boss4: "img/boss4.png",
        enemy3: "img/enemy3.png",
        enemy3die: "img/enemy3die.png",
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
        window.boss = false;
        var bullets = [];
        var enemies = [];
        var bulletCounts = 0;
        var enemyCounts = 0;
        var boss;
        game.render = function() {
            game.draw(plane);
            //Fire 5 bullet per second
            if (bulletCounts++ == game.fps / 5 && plane.alive == true) {
                var bullet = Bullet(game.images["bullet"], plane.x + plane.width / 2, plane.y)
                bullet.x -= bullet.width / 2;
                bullet.y -= bullet.height;
                bullet.dieimg = game.images["bulletdie"];
                bullets.push(bullet);
                bulletCounts = 0;
            }
            //Enter two enemy per second
            if (enemyCounts++ == game.fps / 2 && window.boss == false) {
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
            //Enter the boss
            if (!window.boss && window.score >= 1000) {
                boss = Boss(game.images["boss1"]);
                boss.stage2 = game.images["boss2"];
                boss.stage3 = game.images["boss3"];
                boss.dieimg = game.images["boss4"];
                boss.y = -boss.height;
                window.boss = true;
            }

            if (window.boss) {
                game.draw(boss);
                if (boss.alive) {
                    for (var i = 0; i < bullets.length; i++) {
                        if (bullets[i].alive)
                            if (game.detCol(bullets[i], boss)) {
                                boss.hit(game.fps);
                                bullets[i].hit(game.fps);
                                bullets[i].hitboss = true;
                            }
                    }
                    if (game.detCol(plane, boss)) {
                        plane.showDieAnimation = game.fps / 2;
                        plane.alive = false;
                        plane.img = game.images["planedie"];
                    }
                }
                boss.move();
                if (enemyCounts++ >= game.fps / 3) {
                    var enemy = Enemy(game.images["enemy3"], game.images["enemy3die"]);
                    enemy.width /= 2;
                    enemy.height /= 2;
                    enemy.x = Math.floor(Math.random() * (canvas.width - enemy.width));
                    enemy.y = boss.height / 2;
                    enemies.push(enemy);
                    enemyCounts = 0;
                }
            }
            //Collide Detect
            for (var i = 0; i < bullets.length; i++) {
                for (var j = 0; j < enemies.length; j++) {
                    if (enemies[j].alive && bullets[i].alive) {
                        if (game.detCol(bullets[i], enemies[j])) {
                            bullets[i].alive = false;
                            enemies[j].hit(game.fps);
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
                if (bullets[i].y < 0 || (!bullets[i].alive && !bullets[i].hitboss) ||
                    (!bullets[i].alive && bullets[i].hitboss && bullets[i].showDieAnimation-- == 0)) {
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
            if (!plane.alive && plane.showDieAnimation-- == 0)
                window.over = true;
            game.updateScore();
        }
        game.enableDrag(plane, "plane");
        //Start running
        game.updateFPS();
        game.running();
    });
    main.restLevel = function() {
        if (game.fps < 1)
            game.updateFPS(120);
        game.end();
        main();
    }
    //reg callbacks
    // game.registerCallback('a', paddle.moveLeft);
    // game.registerCallback('d', paddle.moveRight);
    // game.registerCallback('f', ball.fire);
}
main();
