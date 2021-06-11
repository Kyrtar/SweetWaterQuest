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
        pos: {x:20, y:80},
        class: 1,
        hp: 5,
        status: "idle",
        frame: 0,
        attacking: false,
        attackFrame: 0,
        dir: "right",
        attackAnim: false,
        attackRot: 0
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
        [ 33,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1, 35],
        [ 33,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1, 35],
        [ 33,  1,  1,  1,  1,  1,  1,  1,  5,  9,  6,  1,  1,  1,  1,  1,  1,  1,  1, 35],
        [ 33,  1,  1,  1,  1,  1,  1,  5,  9,  9,  9,  6,  1,  1,  1,  1,  1,  1,  1, 35],
        [ 32, 31, 31, 31, 31, 31, 31, 31,  3,  7,  4, 31, 31, 31, 31, 31, 31, 31, 31, 34],
        [111,114, 21, 22, 23,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,121,124],
        [112,115, 24, 25, 26,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,122,125],
        [113,116, 27, 28, 29,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,123,126],
        [111,114,  1,  2,  1,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1, 51, 59, 59, 59],
        [112,115,  1,  2,  2,  2,  2,  2,  2,  2,  2,  1,  1,  1,  1,  1, 55, 50, 50, 50],
        [113,116,  1,  1,  1,  1,  1,  1, 15, 17, 16,  1, 51, 59, 59, 59, 56, 53, 58, 58],
        [111,114,  1,  1,  1, 51, 59, 59, 13, 18, 14, 59, 56, 58, 58, 58, 58, 52,121,124],
        [112,115,  1,  1, 51, 56, 53, 58, 11, 10, 12, 58, 52,  1,  1,  1,  1,  1,122,125],
        [113,116,  1,  1, 55, 53, 52,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,123,126],
        [127,128,127,128, 55, 54,127,128,  2,  2,  2,127,128,127,128,127,128,127,128,127]
        ]
    }

    let enemies = [
        new MeleeEnemy("skeleton", 3, 0.25, 1000, 50, 20),
        new MeleeEnemy("skeleton", 3, 0.25, 1000, 150, 50),
        new MeleeEnemy("skeleton", 3, 0.25, 1000, 150, 100),
        new MeleeEnemy("skeleton", 3, 0.25, 1000, 100, 100)
    ]

    function load(){
        /// add the onload handler before setting src.¡
        villageIMG.src = "./img/village_bg.png";
        dungeonIMG.src = "./img/dungeon_b.png";
        document.getElementById("game").focus();
        dungeonIMG.onload = draw();
    }

    function drawMap(map){

        for(let y = 0; y < map.length; y++){
            for(let x = 0; x < map[y].length; x++){

                switch(map[y][x]){
                    case 1: ctx.drawImage(villageIMG, 0*tileIMGres, 0*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 2: ctx.drawImage(villageIMG, 10*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 3: ctx.drawImage(villageIMG, 2*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 7: ctx.drawImage(villageIMG, 3*tileIMGres-tileIMGres/2, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 4: ctx.drawImage(villageIMG, 3*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 5: ctx.drawImage(villageIMG, 0*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 6: ctx.drawImage(villageIMG, 2*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 9: ctx.drawImage(villageIMG, 1*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 8: ctx.drawImage(villageIMG, 2*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    
                    case 31: ctx.drawImage(villageIMG, 1*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 32: ctx.drawImage(villageIMG, 0*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 33: ctx.drawImage(villageIMG, 0*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 34: ctx.drawImage(villageIMG, 5*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 35: ctx.drawImage(villageIMG, 5*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    //Árboles
                    //Izquierda
                    case 111: ctx.drawImage(villageIMG, 12*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 112: ctx.drawImage(villageIMG, 12*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 113: ctx.drawImage(villageIMG, 12*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    //--
                    case 114: ctx.drawImage(villageIMG, 13*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 115: ctx.drawImage(villageIMG, 13*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 116: ctx.drawImage(villageIMG, 13*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    //--Derecha
                    case 121: ctx.drawImage(villageIMG, 9*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 122: ctx.drawImage(villageIMG, 9*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 123: ctx.drawImage(villageIMG, 9*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    //--
                    case 124: ctx.drawImage(villageIMG, 10*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 125: ctx.drawImage(villageIMG, 10*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 126: ctx.drawImage(villageIMG, 10*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    //abajo
                    case 127: ctx.drawImage(villageIMG, 10*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 128: ctx.drawImage(villageIMG, 11*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                    //Agua
                    case 50: ctx.drawImage(villageIMG, 9*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 51: ctx.drawImage(villageIMG, 2*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 52: ctx.drawImage(villageIMG, 1*tileIMGres, 1*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 53: ctx.drawImage(villageIMG, 3*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 54: ctx.drawImage(villageIMG, 3*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 55: ctx.drawImage(villageIMG, 8*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 56: ctx.drawImage(villageIMG, 8*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 57: ctx.drawImage(villageIMG, 1*tileIMGres, 1*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 58: ctx.drawImage(villageIMG, 4*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 59: ctx.drawImage(villageIMG, 5*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                    //Puente
                    case 10: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 11: ctx.drawImage(villageIMG, 10*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 12: ctx.drawImage(villageIMG, 11*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 13: ctx.drawImage(villageIMG, 10*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 14: ctx.drawImage(villageIMG, 11*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 15: ctx.drawImage(villageIMG, 10*tileIMGres, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 16: ctx.drawImage(villageIMG, 11*tileIMGres, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 17: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    case 18: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

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

    /*
    //Draw map con zoom, siguiendo al jugador
    //No funciona, no se usa.
    function drawMap(map){

        let startTileX = 0;
        let startTileY = 0;

        let endTileX = map[0].length;
        let endTileY = map.length;

        if(!map.hostile){
            startTileX = Math.floor(player.pos.x/10) - 5;
            startTileY = Math.floor(player.pos.y/10) - 2;
            
            if(startTileX < 0){
                startTileX = 0;
            }
            if(startTileY < 0){
                startTileY = 0;
            }
            endTileX = startTileX + 11;
            endTileY = startTileY + 7;
        }
        

        let drawX = 0;
        let drawY = 0;


        for(let y = startTileY; y < endTileY; y++){
            for(let x = startTileX; x < endTileX; x++){

                switch(map[y][x]){
                    case 1: ctx.drawImage(villageIMG, 0*tileIMGres, 0*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 2: ctx.drawImage(villageIMG, 10*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 3: ctx.drawImage(villageIMG, 2*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 4: ctx.drawImage(villageIMG, 3*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 5: ctx.drawImage(villageIMG, 0*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 6: ctx.drawImage(villageIMG, 2*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    
                    case 11: ctx.drawImage(villageIMG, 1*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 12: ctx.drawImage(villageIMG, 0*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 13: ctx.drawImage(villageIMG, 0*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 14: ctx.drawImage(villageIMG, 5*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 15: ctx.drawImage(villageIMG, 5*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;

                    case 21: ctx.drawImage(villageIMG, 10*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 22: ctx.drawImage(villageIMG, 11*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 23: ctx.drawImage(villageIMG, 12*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 24: ctx.drawImage(villageIMG, 10*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 25: ctx.drawImage(villageIMG, 11*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 26: ctx.drawImage(villageIMG, 12*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 27: ctx.drawImage(villageIMG, 10*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 28: ctx.drawImage(villageIMG, 11*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                    case 29: ctx.drawImage(villageIMG, 12*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, drawX*tileIMGres*2, drawY*tileIMGres*2, tileIMGres*2, tileIMGres*2); break;
                }
                drawX++;
            }
            drawX=0;
            drawY++;
        }
        
    }*/

    //1 = up, 2 = right, 3 = down, 4 = left
    function checkCol(dir){
        let result = false;
        switch(dir){
            case 1: if(activeMap.map[Math.floor(player.pos.y/10)][Math.round(player.pos.x/10)] > 20){
                        result = true;
                    }; break;
            case 2: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.floor(player.pos.x/10)+1] > 20){
                        result = true;
                    }; break;
            case 3: if(activeMap.map[Math.round(player.pos.y/10)+1][Math.round(player.pos.x/10)] > 20){
                        result = true;
                    }; break;
            case 4: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.ceil(player.pos.x/10)-1] > 20){
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
            if(enemies[i].hp>0){
                ctx.drawImage(dungeonIMG, (24+enemies[i].animate())*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, enemies[i].x/10*tileIMGres, enemies[i]._y/10*tileIMGres, tileIMGres, tileIMGres+12);
                if(Math.abs(enemies[i].x - player.pos.x) < 40 && Math.abs(enemies[i].y - player.pos.y) < 30){
                    enemies[i].moveTowards(player.pos.x, player.pos.y, activeMap.map);
                }
                if(Math.abs(player.pos.x - enemies[i].x) < 5){
                    if(Math.abs(player.pos.y - enemies[i].y) < 5){
                        console.log("ouch!");

                        let moveX = (player.pos.x - enemies[i].x)*1.5;
                        let moveY = (player.pos.y - enemies[i].y);

                        let colY = false, colX = false;

                        //1 = up, 2 = right, 3 = down, 4 = left
                        if(moveX > 0){
                            colX = checkCol(2);
                        } else {
                            colX = checkCol(4);
                        }

                        if(moveY > 0){
                            colY = checkCol(3);
                        } else {
                            colY = checkCol(1);
                        }

                        if(player.pos.x > 5 && player.pos.x / 10 < width-1.5){

                            if(!colX){
                                player.pos.x += moveX;
                                enemies[i].x -= moveX/3;
                            }
                        }

                        if(player.pos.y > 5 && player.pos.y / 10 < height-1){
                            if(!colY){
                                player.pos.y += moveY;
                                enemies[i].y -= moveY/3;
                            }
                        }
                    }
                }
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
            if(!player.attackAnim){
                switch(player.dir){
                    case "right":   player.attackRot = -0.3; break;
                    case "left":    player.attackRot = 2.2; break;
                    case "up":      player.attackRot = -90; break;
                    case "down":    player.attackRot = 45; break;
                }
            }
            ctx.setTransform(1, 0, 0, 1, (player.pos.x+5)/10*tileIMGres, (player.pos.y+5)/10*tileIMGres);
            ctx.rotate(player.attackRot + player.attackFrame/2 * Math.PI / 90);
            ctx.drawImage(dungeonIMG, 18*tileIMGres-1, 1*tileIMGres-12, tileIMGres, tileIMGres+12, tileIMGres-6, -tileIMGres/2, tileIMGres, tileIMGres+12);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            player.attackFrame++;
            player.attackAnim = true;
            if(player.attackFrame>=30){
                player.attackFrame = 0;
                player.attacking = false;
                player.attackAnim = false;
            }
        }
    }

    function checkAttack(){
        let rightOffset = 0;
        let leftOffset = 0;
        let upOffset = 0;
        let downOffset = 0;

        switch(player.dir){
            case "up":      upOffset = -17; downOffset = 0;
                            leftOffset = -5; rightOffset = 15;
                            for(let i=0; i<enemies.length; i++){
                                if(enemies[i]._hp > 0){
                                    if(enemies[i].y <= player.pos.y + downOffset && enemies[i].y >= player.pos.y + upOffset &&
                                       enemies[i].x <= player.pos.x + rightOffset && enemies[i].x >= player.pos.x + leftOffset){
                                        console.log("hit");
                                        enemies[i].damage();
                                        enemies[i].y -= 10;
                                    }
                                }
                            }
            break;

            case "down":    upOffset = 0;       downOffset = 15; 
                            leftOffset = -5; rightOffset = 15;
                            for(let i=0; i<enemies.length; i++){
                                if(enemies[i]._hp > 0){
                                    if(enemies[i].y <= player.pos.y + downOffset && enemies[i].y >= player.pos.y + upOffset &&
                                       enemies[i].x <= player.pos.x + rightOffset && enemies[i].x >= player.pos.x + leftOffset){
                                        console.log("hit");
                                        enemies[i].damage();
                                        enemies[i].y += 10;
                                    }
                                }
                            }
            break;

            case "left":    rightOffset = 0;    leftOffset = 20; 
                            upOffset = -5;       downOffset = 5;
                            for(let i=0; i<enemies.length; i++){
                                if(enemies[i]._hp > 0){
                                    if(enemies[i].x <= player.pos.x + rightOffset && enemies[i].x >= player.pos.x - leftOffset &&
                                        enemies[i].y >= player.pos.y + upOffset && enemies[i].y <= player.pos.y + downOffset){
                                        console.log("hit");
                                        enemies[i].damage();
                                        enemies[i].x -= 10;
                                    }
                                }
                            }
            break;

            case "right":   rightOffset = 20;   leftOffset = 0;  
                            upOffset = -5;       downOffset = 5;
                            for(let i=0; i<enemies.length; i++){
                                if(enemies[i]._hp > 0){
                                    if(enemies[i].x <= player.pos.x + rightOffset && enemies[i].x >= player.pos.x - leftOffset &&
                                        enemies[i].y >= player.pos.y + upOffset && enemies[i].y <= player.pos.y + downOffset){
                                        console.log("hit");
                                        enemies[i].damage();
                                        enemies[i].x += 10;
                                    }
                                }
                            }
            
            break;
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