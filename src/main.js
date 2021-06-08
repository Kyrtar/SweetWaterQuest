    import {sfx} from "./sfx_class.js";
    import {MeleeEnemy} from "./meleeEnemy.js";

    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 480;

    let fps = 60;

    let tileIMGres = 32;
    let height = 15,
        width = 20;

    
    //Creo el jugador
    var player = {
        pos: {x:95, y:100},
        class: 1,
        status: "idle",
        frame: 0,
        attacking: false,
        attackFrame: 0,
        dir: "right"
    }
    var animate = true;
    
    const MOVE_SPEED = 0.75;

    var activeMap = 0;
    

    var villageIMG = new Image();
    var dungeonIMG = new Image();

    
    var step = new sfx("step");

    let villageMap = {
        name: "village",
        hostile: false,
        map: [
        [13,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,15],
        [13,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,15],
        [13,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,15],
        [13,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,15],
        [12,11,11,11,11,11,11,11,11,3,4,11,11,11,11,11,11,11,11,14],
        [1,21,22,23,1,1,1,1,1,5,6,1,1,1,1,1,1,1,1,1],
        [1,24,25,26,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1],
        [1,27,28,29,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,2,2,1,1,1,2,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1]
        ]
    }

    let enemies = [
        new MeleeEnemy("skeleton", 3, 0, 1000, 50, 20),
        new MeleeEnemy("skeleton", 3, 0, 1000, 150, 50),
        new MeleeEnemy("skeleton", 3, 0, 1000, 100, 100)
    ]

    function load(){
        /// add the onload handler before setting src.
        villageIMG.onload = draw();
        villageIMG.src = "./img/village_bg.png";

        dungeonIMG.onload = draw();
        dungeonIMG.src = "./img/dungeon_b.png";
    }

    function drawMap(map){

        for(let y = 0; y < map.length; y++){
            for(let x = 0; x < map[y].length; x++){

                switch(map[y][x]){
                    case 1: ctx.drawImage(villageIMG, 0*tileIMGres, 0*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 2: ctx.drawImage(villageIMG, 10*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 3: ctx.drawImage(villageIMG, 2*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 4: ctx.drawImage(villageIMG, 3*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 5: ctx.drawImage(villageIMG, 0*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 6: ctx.drawImage(villageIMG, 2*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    
                    case 11: ctx.drawImage(villageIMG, 1*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 12: ctx.drawImage(villageIMG, 0*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 13: ctx.drawImage(villageIMG, 0*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 14: ctx.drawImage(villageIMG, 5*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 15: ctx.drawImage(villageIMG, 5*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                    case 21: ctx.drawImage(villageIMG, 10*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 22: ctx.drawImage(villageIMG, 11*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 23: ctx.drawImage(villageIMG, 12*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 24: ctx.drawImage(villageIMG, 10*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 25: ctx.drawImage(villageIMG, 11*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 26: ctx.drawImage(villageIMG, 12*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 27: ctx.drawImage(villageIMG, 10*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 28: ctx.drawImage(villageIMG, 11*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 29: ctx.drawImage(villageIMG, 12*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                }
            }
        }
        
    }

    //1 = up, 2 = right, 3 = down, 4 = left
    function checkCol(dir){
        let result = false;
        switch(dir){
            case 1: if(activeMap.map[Math.floor(player.pos.y/10)][Math.round(player.pos.x/10)] > 10){
                        result = true;
                    }; break;
            case 2: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.floor(player.pos.x/10)+1] > 10){
                        result = true;
                    }; break;
            case 3: if(activeMap.map[Math.round(player.pos.y/10)+1][Math.round(player.pos.x/10)] > 10){
                        result = true;
                    }; break;
            case 4: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.ceil(player.pos.x/10)-1] > 10){
                        result = true;
                    }; break;
        }
        return result;
    }

    function movePlayer(){
        player.status = "idle";
        if (keyState[KEY_UP] && player.pos.y > 0 + MOVE_SPEED){
            if(checkCol(1) == false){
                player.pos.y -= MOVE_SPEED;
                player.status = "moving";
                if(player.dir!="up"){
                    player.dir = "up";
                }
            }
        } 
        if (keyState[KEY_DOWN] && Math.ceil(player.pos.y/10 + MOVE_SPEED) < height) {
            if(checkCol(3) == false){
                player.pos.y += MOVE_SPEED;
                player.status = "moving";
                if(player.dir!="down"){
                    player.dir = "down";
                }
            }
        }
        if (keyState[KEY_LEFT] && player.pos.x - MOVE_SPEED > 0) {
            if(checkCol(4) == false){
                player.pos.x -= MOVE_SPEED;
                player.status = "moving";
                if(player.dir!="left"){
                    player.dir = "left";
                }
            }
        }
        if (keyState[KEY_RIGHT] && player.pos.x/10 < width-1) {
            if(checkCol(2) == false){
                player.pos.x += MOVE_SPEED;
                player.status = "moving";
                if(player.dir!="right"){
                    player.dir = "right";
                }
            }
        }
    }

    function drawPlayer(){
        if(player.status==="idle"){
            switch(player.class){
                case 1: if (player.dir=="up" || player.dir=="right") {
                    ctx.drawImage(dungeonIMG, 9*tileIMGres-1, 7*tileIMGres-12, tileIMGres, tileIMGres+12, player.pos.x/10*tileIMGres, player.pos.y/10*tileIMGres, tileIMGres, tileIMGres+12); break;
                        } else {
                            ctx.save();
                            ctx.scale(-1, 1);
                            ctx.drawImage(dungeonIMG, 9*tileIMGres-1, 7*tileIMGres-12, tileIMGres, tileIMGres+12, (player.pos.x/10*tileIMGres)*-1-tileIMGres, player.pos.y/10*tileIMGres, tileIMGres, tileIMGres+12);
                            ctx.restore(); break;
                        }
            }   
        } else {
            switch(player.class){
                case 1: if (player.dir=="down" || player.dir=="left") {
                            ctx.save();
                            ctx.scale(-1, 1);
                            ctx.drawImage(dungeonIMG, (9+player.frame)*tileIMGres-1, 7*tileIMGres-12, tileIMGres, tileIMGres+12, (player.pos.x/10*tileIMGres)*-1-tileIMGres, player.pos.y/10*tileIMGres, tileIMGres, tileIMGres+12);
                            ctx.restore(); break;
                        } else{
                            ctx.drawImage(dungeonIMG, (9+player.frame)*tileIMGres-1, 7*tileIMGres-12, tileIMGres, tileIMGres+12, player.pos.x/10*tileIMGres, player.pos.y/10*tileIMGres, tileIMGres, tileIMGres+12);
                            break;
                        }
            }
            if(animate === true){
                player.frame++;
                animate = false;
            }
            if(player.frame >= 3){
                player.frame = 0;
            }
        }

    }

    function drawEnemies(){
        for(let i=0; i<enemies.length; i++){
            if(enemies[i]._hp>0){
                ctx.drawImage(dungeonIMG, (24+player.frame)*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, enemies[i].x/10*tileIMGres, enemies[i]._y/10*tileIMGres, tileIMGres, tileIMGres+12);
            } else if(enemies[i]._deathFrames > 0) {
                ctx.setTransform(1, 0, 0, 1, enemies[i].x/10*tileIMGres, enemies[i]._y/10*tileIMGres);
                ctx.rotate(135 * Math.PI / 90);
                ctx.drawImage(dungeonIMG, (30)*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, -tileIMGres*1.5, -tileIMGres/2, tileIMGres, tileIMGres+12);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                enemies[i]._deathFrames--;
            }
        }
    }

    function attack(){
        if(player.attacking === true){
            ctx.setTransform(1, 0, 0, 1, player.pos.x/10*tileIMGres, player.pos.y/10*tileIMGres);
            ctx.rotate(player.attackFrame/2 * Math.PI / 90);
            ctx.drawImage(dungeonIMG, 18*tileIMGres-1, 1*tileIMGres-12, tileIMGres, tileIMGres+12, tileIMGres, -tileIMGres/2, tileIMGres, tileIMGres+12);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            player.attackFrame++;
            if(player.attackFrame>=30){
                player.attackFrame = 0;
                player.attacking = false;
            }
        }
    }

    function checkAttack(){
        for(let i=0; i<enemies.length; i++){
            if(enemies[i]._hp > 0){
                if(enemies[i].x >= player.pos.x && enemies[i].x <= player.pos.x  + (tileIMGres/3)){ //
                    if(enemies[i].y >= player.pos.y - (tileIMGres/3) && enemies[i].y <= player.pos.y + (tileIMGres/3)){  //
                        enemies[i].damage();
                        console.log(enemies[i]._x - player.pos.x);
                        console.log(enemies[i]._x - player.pos.x + tileIMGres);
                    }
                }
            }
        }
    }

    function draw() {
        setTimeout(function(){
            //Limpio el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            ctx.fillStyle = "rgb(20,20,20)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            movePlayer();
            if (keyState[KEY_Z]) {
                if(!player.attacking){
                    player.attacking = true;
                    checkAttack();
                }   
            }

        }, 1000/fps);
        
        drawMap(activeMap.map);
        drawPlayer();
        drawEnemies();
        attack();
    }

    // define keys and an array to keep key states
    // global key log;
    var keyState = [];
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_Z = 90;


    // create a logging function
    const keyEventLogger =  function (e) {  keyState[e.keyCode] = e.type == 'keydown';}
    window.addEventListener("keydown", keyEventLogger);
    window.addEventListener("keyup", keyEventLogger);

    setInterval(function(){ animate = true }, 150);


    activeMap = villageMap;
    load();