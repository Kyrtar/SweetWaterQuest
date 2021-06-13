    import {sfx} from "./sfx_class.js";
    import {MeleeEnemy} from "./meleeEnemy.js";
    import {NPC} from "./npc.js";
    import {Item} from "./item.js"

    /*
    $('#save').click(function() {
        $.ajax({
          type: "POST",
          url: "some.php",
          data: { exp: player.exp,
                  level: player.level }
        }).done(function( msg ) {
          alert( "Data Saved: " + msg );
        });
    });
    */

    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 480;

    let fps = 60;

    let tileIMGres = 32;
    let height = 15,
        width = 20;

    var timer = null;

    
    //Creo el jugador
    var player = {
        pos: {x:20, y:90},
        class: 1,
        name: localStorage.getItem("charName"),
        level: parseInt(localStorage.getItem("charLevel")),
        exp: parseInt(localStorage.getItem("charExp")),
        MaxHp: 5,
        hp: 5,
        status: "idle",
        frame: 0,
        attacking: false,
        attackFrame: 0,
        dir: "right",
        attackAnim: false,
        attackRot: 0,
        potions: parseInt(localStorage.getItem("quantity")),
        potionCD: false,
        potionTimer: 3.0
    }
    var animate = true;
    
    const MOVE_SPEED = 0.75;

    var maps = [];
    var activeMap = null;
    var mapNumer = 1;

    var villageIMG = new Image();
    var dungeonIMG = new Image();
    var chatbox = new Image();

    
    var step = new sfx("step");


    let villageMap = {
        name: "village",
        npc: [
            new NPC(8,5, "They're taking the children to the cave! Save them!", "elder"),
            new NPC(8,15, "Go to the cave!", "dino"),
            new NPC(8,15, "Go to the cave!", "dino"),
            new NPC(3,10, "Use the arrow keys to move and Z to attack", "sign")
        ],
        hostile: false,
        enemies: [],
        map: [
            [101,101,101,101,101,101,101,101, 91, 92, 93,101,101,101,101,101,101,101,101,101],
            [100,100,100,100,100,100,100,100, 14, 15, 16,100,100,100,100,100,100,100,100,100],
            [ 43,  1,  1,  1,  1,  1,  1,  1,  5,  9,  6,  1,  1,  1,  1,  1,  1,  1,  1, 45],
            [ 43,  1,  1,  1,  1,  1,  1,  5,  9,  9,  9,  6,  1,  1,  1,  1,  1,  1,  1, 45],
            [ 42, 41, 41, 41, 41, 41, 41, 41,  3,  7,  4, 41, 41, 41, 41, 41, 41, 41, 41, 44],
            [114,  1, 31, 32, 33,  1,  1,  1, 50,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,121],
            [115,  1, 34, 35, 36,  1,  1,  1,  2,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,122],
            [116,  1, 37, 38, 39,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  1,123],
            [114,  1,  1,  2,  1,  1,  1,  1,  2,  2,  2,  1,  1,  1, 25, 27, 26, 61, 69, 69],
            [115,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1, 61, 69, 23, 28, 24, 66, 60, 60],
            [116,  1,  2, 51,  1,  1,  1,  1, 25, 27, 26,  1, 65, 63, 21, 20, 22, 68, 68, 68],
            [114,131,132,134,  1, 61, 69, 69, 23, 28, 24, 69, 66, 64,131,132,133,134,121,124],
            [115,135,136,138, 61, 66, 63, 68, 21, 20, 22, 68, 68, 62,135,136,137,138,122,125],
            [116,139,140,142, 65, 63, 62,  1,  2,  2,  2,  1,  1,  1,139,140,141,142,123,126],
            [127,128,127,128, 65, 64,127,128,  2,  2,  2,127,128,127,128,127,128,127,128,127]
        ],
        nextMap: [95,0],
        previousMap: null,
        startPoint: [95,35],
        items: []
    }

    maps.push(villageMap);

    let dungeonMap = {
        name: "dungeon",
        npc: [],
        hostile: true,
        enemies: [
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 50, 20),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 150, 50),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 150, 100),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 100, 100)
        ],
        map: [
        [102,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,101,103],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106],
        [105,101,101,101,101,101,101,101,  2,  2,  2,101,101,101,101,101,101,101,101,104]
        ],
        nextMap: null,
        previousMap: [95,140],
        startPoint: [95, 125],
        items: [new Item(1,"5, heal", "Potion", 0, "Consumable", 9, 8)]
    }

    maps.push(dungeonMap);

    function r() {
        let min = 1;
        let max = 4;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function load(){
        /// add the onload handler before setting src.¡
        villageIMG.src = "./img/village_bg.png";
        dungeonIMG.src = "./img/dungeon_b.png";
        chatbox.src = "./img/chatbox.png";
        document.getElementById("game").focus();
        dungeonIMG.onload = draw();
    }

    function addItem(map, id, x, y){
        switch(id){
            //Walkable
            case 1: map.items.push(new Item(1,"5, heal", "Potion", 0, "Consumable", x, y)); console.log("Added "+x+" "+y); break;
        }
        
    }

    function drawMap(map){
        if(map.hostile != true){
            for(let y = 0; y < map.map.length; y++){
                for(let x = 0; x < map.map[y].length; x++){

                    switch(map.map[y][x]){
                        //Walkable
                        case 0: ctx.drawImage(villageIMG, 7*tileIMGres, 1*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 1: ctx.drawImage(villageIMG, 0*tileIMGres, 0*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 2: ctx.drawImage(villageIMG, 10*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 3: ctx.drawImage(villageIMG, 2*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 7: ctx.drawImage(villageIMG, 3*tileIMGres-tileIMGres/2, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 4: ctx.drawImage(villageIMG, 3*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 5: ctx.drawImage(villageIMG, 0*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 6: ctx.drawImage(villageIMG, 2*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 9: ctx.drawImage(villageIMG, 1*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 8: ctx.drawImage(villageIMG, 2*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        
                        //Bridge
                        case 20: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 21: ctx.drawImage(villageIMG, 10*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 22: ctx.drawImage(villageIMG, 11*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 23: ctx.drawImage(villageIMG, 10*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 24: ctx.drawImage(villageIMG, 11*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 25: ctx.drawImage(villageIMG, 10*tileIMGres, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 26: ctx.drawImage(villageIMG, 11*tileIMGres, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 27: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 3*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 28: ctx.drawImage(villageIMG, 10*tileIMGres + tileIMGres/2, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                        //Red House
                        case 31: ctx.drawImage(villageIMG, 10*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 32: ctx.drawImage(villageIMG, 11*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 33: ctx.drawImage(villageIMG, 12*tileIMGres, 25*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 34: ctx.drawImage(villageIMG, 10*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 35: ctx.drawImage(villageIMG, 11*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 36: ctx.drawImage(villageIMG, 12*tileIMGres, 26*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 37: ctx.drawImage(villageIMG, 10*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 38: ctx.drawImage(villageIMG, 11*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 39: ctx.drawImage(villageIMG, 12*tileIMGres, 27*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                        //Rocks
                        case 41: ctx.drawImage(villageIMG, 1*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 42: ctx.drawImage(villageIMG, 0*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 43: ctx.drawImage(villageIMG, 0*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 44: ctx.drawImage(villageIMG, 5*tileIMGres, 10*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 45: ctx.drawImage(villageIMG, 5*tileIMGres, 9*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                                                
                        //activeMap.NPC
                        //On dirt
                        case 50: ctx.drawImage(villageIMG, 10*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        //On grass
                        case 51: ctx.drawImage(villageIMG, 0*tileIMGres, 0*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        
                        //Water
                        case 60: ctx.drawImage(villageIMG, 9*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 61: ctx.drawImage(villageIMG, 2*tileIMGres, 2*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 62: ctx.drawImage(villageIMG, 1*tileIMGres, 1*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 63: ctx.drawImage(villageIMG, 3*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 64: ctx.drawImage(villageIMG, 3*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 65: ctx.drawImage(villageIMG, 8*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 66: ctx.drawImage(villageIMG, 8*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 67: ctx.drawImage(villageIMG, 1*tileIMGres, 1*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 68: ctx.drawImage(villageIMG, 4*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 69: ctx.drawImage(villageIMG, 5*tileIMGres, 6*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                        //Cave
                        case 91: ctx.drawImage(villageIMG, 1*tileIMGres, 37*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 92: ctx.drawImage(villageIMG, 2*tileIMGres, 37*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 93: ctx.drawImage(villageIMG, 3*tileIMGres, 37*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 14: ctx.drawImage(villageIMG, 1*tileIMGres, 39*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 15: ctx.drawImage(villageIMG, 2*tileIMGres, 39*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 16: ctx.drawImage(villageIMG, 3*tileIMGres, 39*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 97: ctx.drawImage(villageIMG, 4*tileIMGres, 39*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                        //Enter cave
                        case 100:ctx.drawImage(villageIMG, 0*tileIMGres, 39*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 101: ctx.drawImage(villageIMG, 0*tileIMGres, 38*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        
                        //Trees
                        //For the left
                        case 111: ctx.drawImage(villageIMG, 12*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 112: ctx.drawImage(villageIMG, 12*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 113: ctx.drawImage(villageIMG, 12*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        //--
                        case 114: ctx.drawImage(villageIMG, 13*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 115: ctx.drawImage(villageIMG, 13*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 116: ctx.drawImage(villageIMG, 13*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        //--For the right
                        case 121: ctx.drawImage(villageIMG, 9*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 122: ctx.drawImage(villageIMG, 9*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 123: ctx.drawImage(villageIMG, 9*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        //--
                        case 124: ctx.drawImage(villageIMG, 10*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 125: ctx.drawImage(villageIMG, 10*tileIMGres, 19*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 126: ctx.drawImage(villageIMG, 10*tileIMGres, 20*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        //Down
                        case 127: ctx.drawImage(villageIMG, 10*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 128: ctx.drawImage(villageIMG, 11*tileIMGres, 18*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                        //Green House
                        case 131: ctx.drawImage(villageIMG, 5*tileIMGres, 33*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 132: ctx.drawImage(villageIMG, 6*tileIMGres, 33*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 133: ctx.drawImage(villageIMG, 8*tileIMGres, 33*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 134: ctx.drawImage(villageIMG, 9*tileIMGres, 33*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 135: ctx.drawImage(villageIMG, 5*tileIMGres, 34*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 136: ctx.drawImage(villageIMG, 6*tileIMGres, 34*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 137: ctx.drawImage(villageIMG, 8*tileIMGres, 34*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 138: ctx.drawImage(villageIMG, 9*tileIMGres, 34*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 139: ctx.drawImage(villageIMG, 5*tileIMGres, 35*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 140: ctx.drawImage(villageIMG, 6*tileIMGres, 35*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 141: ctx.drawImage(villageIMG, 8*tileIMGres, 35*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 142: ctx.drawImage(villageIMG, 9*tileIMGres, 35*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    
                    }
                }
            }
        } else {
            for(let y = 0; y < map.map.length; y++){
                for(let x = 0; x < map.map[y].length; x++){

                    switch(map.map[y][x]){
                        //Walkable
                        case 1: ctx.drawImage(dungeonIMG, 1*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 2: ctx.drawImage(dungeonIMG, 2*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 3: ctx.drawImage(dungeonIMG, 3*tileIMGres, 4*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 4: ctx.drawImage(dungeonIMG, 2*tileIMGres, 5*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                    
                        //Walls
                        case 100: ctx.drawImage(dungeonIMG, 2*tileIMGres, 8*tileIMGres+25, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 101: ctx.drawImage(dungeonIMG, 3*tileIMGres, 9*tileIMGres+25, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 102: ctx.drawImage(dungeonIMG, 5*tileIMGres, 9*tileIMGres-5, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 103: ctx.drawImage(dungeonIMG, 4*tileIMGres, 9*tileIMGres-5, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 104: ctx.drawImage(dungeonIMG, 3*tileIMGres, 10*tileIMGres-8, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 105: ctx.drawImage(dungeonIMG, 3*tileIMGres, 10*tileIMGres-8, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;
                        case 106: ctx.drawImage(dungeonIMG, 3*tileIMGres, 8*tileIMGres+25, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres); break;

                    }
                }
            }
        }
        
    }

    function drawItems(map){
        for(let i = 0; i < map.items.length; i++){
            //onsole.log(i);
            switch(map.items[i].id){
                //Walkable
                case 1: ctx.drawImage(dungeonIMG, 18*tileIMGres, 14*tileIMGres, tileIMGres, tileIMGres, map.items[i].x*tileIMGres, map.items[i].y*tileIMGres, tileIMGres, tileIMGres); break;
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
            case 1: if(activeMap.map[Math.floor(player.pos.y/10)][Math.round(player.pos.x/10)] > 30){
                        result = true;
                    }; break;
            case 2: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.floor(player.pos.x/10)+1] > 30){
                        result = true;
                    }; break;
            case 3: if(activeMap.map[Math.round(player.pos.y/10)+1][Math.round(player.pos.x/10)] > 30){
                        result = true;
                    }; break;
            case 4: if(activeMap.map[Math.ceil(player.pos.y/10)][Math.ceil(player.pos.x/10)-1] > 30){
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

        if(activeMap.nextMap != null){
          if(Math.abs(player.pos.x - activeMap.nextMap[0]) <= 15){
                if(Math.abs(player.pos.y - activeMap.nextMap[1]) <= 10){
                    mapNumer++;
                    activeMap = maps[mapNumer];
                    player.pos.x = activeMap.startPoint[0];
                    player.pos.y = activeMap.startPoint[1];
                }
            }
        }

        if(activeMap.previousMap != null){
            if(Math.abs(player.pos.x - activeMap.previousMap[0]) <= 15){
                  if(Math.abs(player.pos.y - activeMap.previousMap[1]) <= 10){
                      mapNumer--;
                      activeMap = maps[mapNumer];
                      player.pos.x = activeMap.startPoint[0];
                      player.pos.y = activeMap.startPoint[1];
                  }
              }
        }

        if(activeMap.items.length > 0){
            for(let i= 0; i < activeMap.items.length; i++){
                if(Math.abs(player.pos.x - activeMap.items[i].x*10) <= 10){
                    if(Math.abs(player.pos.y - activeMap.items[i].y*10) <= 10){
                        player.potions++;
                        document.getElementById("potions").value = player.potions;
                        activeMap.items.splice(i,1);
                    }
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

    function drawNPC(){
        for(let i = 0; i < activeMap.npc.length; i++){
            switch(activeMap.npc[i].sprite){
                case "elder": ctx.drawImage(dungeonIMG, 13*tileIMGres+1, 11*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres, tileIMGres+16); break;
                case "mKid":  ctx.drawImage(dungeonIMG, 10*tileIMGres+1, 3*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres, tileIMGres+16); break;
                case "fKid":  ctx.drawImage(dungeonIMG, 10*tileIMGres+1, 1*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres, tileIMGres+16); break;
                case "sign":  ctx.drawImage(villageIMG, 8*tileIMGres+1, 13*tileIMGres, tileIMGres, tileIMGres, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres, tileIMGres, tileIMGres); break;
                default: ctx.drawImage(dungeonIMG, 8*tileIMGres+1, 13*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres, tileIMGres, tileIMGres+16); break;
            }
            if(Math.abs(player.pos.x - activeMap.npc[i].x*10) < 22){
                if(Math.abs(player.pos.y - activeMap.npc[i].y*10) < 22){
                    ctx.drawImage(chatbox, 0, 0, 500, 280, 0, -50, 640, 280);
                    ctx.font = '22px futura';
                    ctx.fillText(activeMap.npc[i].msg, 40, 70);
                }
            }
        }
    }

    function drawEnemies(){
        for(let i=0; i<activeMap.enemies.length; i++){
            if(activeMap.enemies[i].hp>0){
                ctx.drawImage(dungeonIMG, (24+activeMap.enemies[i].animate())*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.enemies[i].x/10*tileIMGres, activeMap.enemies[i]._y/10*tileIMGres, tileIMGres, tileIMGres+12);
                if(Math.abs(activeMap.enemies[i].x - player.pos.x) < 40 && Math.abs(activeMap.enemies[i].y - player.pos.y) < 30){
                    activeMap.enemies[i].moveTowards(player.pos.x, player.pos.y, activeMap.map);
                }
                if(Math.abs(player.pos.x - activeMap.enemies[i].x) < 5){
                    if(Math.abs(player.pos.y - activeMap.enemies[i].y) < 5){
                        if(player.hp > 0){
                            player.hp--;
                        }

                        let moveX = (player.pos.x - activeMap.enemies[i].x)*1.5;
                        let moveY = (player.pos.y - activeMap.enemies[i].y);

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
                                activeMap.enemies[i].x -= moveX/3;
                            }
                        }

                        if(player.pos.y > 5 && player.pos.y / 10 < height-1){
                            if(!colY){
                                player.pos.y += moveY;
                                activeMap.enemies[i].y -= moveY/3;
                            }
                        }
                    }
                }
            } else if(activeMap.enemies[i]._deathFrames > 0) {
                ctx.setTransform(1, 0, 0, 1, activeMap.enemies[i].x/10*tileIMGres, activeMap.enemies[i]._y/10*tileIMGres);
                ctx.rotate(135 * Math.PI / 90);
                ctx.drawImage(dungeonIMG, (30)*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, -tileIMGres*1.5, -tileIMGres/2, tileIMGres, tileIMGres+12);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                activeMap.enemies[i]._deathFrames--;
            } else {
                addItem(activeMap, 1, activeMap.enemies[i].x/10, activeMap.enemies[i].y/10);
                activeMap.enemies.splice(i,1);
                player.exp += 100;
                document.getElementById("exp").value = player.exp;
                if(player.exp >= 300){
                    player.exp -= 300;
                    player.level++;
                    document.getElementById("level").value = player.level;
                }
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
            case "up":      upOffset = -20; downOffset = 0;
                            leftOffset = -5; rightOffset = 15;
                            for(let i=0; i<activeMap.enemies.length; i++){
                                if(activeMap.enemies[i]._hp > 0){
                                    if(activeMap.enemies[i].y <= player.pos.y + downOffset && activeMap.enemies[i].y >= player.pos.y + upOffset &&
                                       activeMap.enemies[i].x <= player.pos.x + rightOffset && activeMap.enemies[i].x >= player.pos.x + leftOffset){
                                        console.log("hit");
                                        activeMap.enemies[i].damage();
                                        activeMap.enemies[i].y -= 10;
                                    }
                                }
                            }
            break;

            case "down":    upOffset = 0;       downOffset = 15; 
                            leftOffset = -5; rightOffset = 15;
                            for(let i=0; i<activeMap.enemies.length; i++){
                                if(activeMap.enemies[i]._hp > 0){
                                    if(activeMap.enemies[i].y <= player.pos.y + downOffset && activeMap.enemies[i].y >= player.pos.y + upOffset &&
                                       activeMap.enemies[i].x <= player.pos.x + rightOffset && activeMap.enemies[i].x >= player.pos.x + leftOffset){
                                        console.log("hit");
                                        activeMap.enemies[i].damage();
                                        activeMap.enemies[i].y += 10;
                                    }
                                }
                            }
            break;

            case "left":    rightOffset = 0;    leftOffset = 20; 
                            upOffset = -5;       downOffset = 5;
                            for(let i=0; i<activeMap.enemies.length; i++){
                                if(activeMap.enemies[i]._hp > 0){
                                    if(activeMap.enemies[i].x <= player.pos.x + rightOffset && activeMap.enemies[i].x >= player.pos.x - leftOffset &&
                                        activeMap.enemies[i].y >= player.pos.y + upOffset && activeMap.enemies[i].y <= player.pos.y + downOffset){
                                        console.log("hit");
                                        activeMap.enemies[i].damage();
                                        activeMap.enemies[i].x -= 10;
                                    }
                                }
                            }
            break;

            case "right":   rightOffset = 20;   leftOffset = 0;  
                            upOffset = -5;       downOffset = 5;
                            for(let i=0; i<activeMap.enemies.length; i++){
                                if(activeMap.enemies[i]._hp > 0){
                                    if(activeMap.enemies[i].x <= player.pos.x + rightOffset && activeMap.enemies[i].x >= player.pos.x - leftOffset &&
                                        activeMap.enemies[i].y >= player.pos.y + upOffset && activeMap.enemies[i].y <= player.pos.y + downOffset){
                                        console.log("hit");
                                        activeMap.enemies[i].damage();
                                        activeMap.enemies[i].x += 10;
                                    }
                                }
                            }
            
            break;
        }
    }

    function usePotion(){
        if(player.potionCD == false && player.hp < player.MaxHp){
            player.potionCD = true;
            player.potions--;
            player.hp++;
            document.getElementById("potions").value = player.potions;
            setTimeout(function(){
                player.potionCD = false;
            }, 3000);
            timer = setInterval(function(){
                ctx.font = '22px futura';
                ctx.fillStyle = "rgb(255,255,255)";
                player.potionTimer -= 0.1;
            }, 100)
        }
    }

    function drawUI(){
        //Hearts
        ctx.globalAlpha = 0.8;
        for(let i = 1; i <= player.hp; i++){
            ctx.drawImage(dungeonIMG, 18*tileIMGres, 16*tileIMGres, tileIMGres, tileIMGres, 1*i*tileIMGres, 10, tileIMGres, tileIMGres);
        }
        for(let i = 1; i <= player.MaxHp - player.hp; i++){
            ctx.drawImage(dungeonIMG, 20*tileIMGres, 16*tileIMGres, tileIMGres, tileIMGres, 6*tileIMGres - i*tileIMGres, 10, tileIMGres, tileIMGres);
        }

        //Potions
        if(player.potions <= 0 || player.potionTimer != 3){
            ctx.globalAlpha = 0.33;
        }
        ctx.drawImage(dungeonIMG, 19*tileIMGres, 12*tileIMGres, tileIMGres*2, tileIMGres*2, 0.5*tileIMGres, 12.5*tileIMGres, tileIMGres*1.5, tileIMGres*1.5);
        ctx.font = '22px futura';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText("x "+player.potions, 2.5*tileIMGres, 13.5*tileIMGres);
        if(player.potionTimer != 3.0 && player.potions > 0){
            ctx.fillText(player.potionTimer.toFixed(1)+" s", 1*tileIMGres, 12*tileIMGres);
        }
        if(player.potionTimer <= 0){
            clearInterval(timer);
            player.potionTimer = 3.0;
            timer = null;
        }

        ctx.globalAlpha = 0.8;
        //Name, lvl, expctx.font = '22px futura';
        ctx.fillText(player.name, 8*tileIMGres, 1*tileIMGres);
        ctx.fillText("Level: "+player.level, 17 *tileIMGres, 1*tileIMGres);
        ctx.fillText("Experience: "+player.exp, 14.75 *tileIMGres, 2*tileIMGres);

        ctx.globalAlpha = 1;
    }

    function draw() {
        if (localStorage.getItem("logOut") !== null) {
            localStorage.removeItem("logOut");
            window.location.replace("./login.php");
        }
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
            if (keyState[KEY_X] && player.potions > 0) {
                usePotion();
            }
        }, 1000/fps);
        
        drawMap(activeMap);
        drawEnemies();
        drawNPC();
        drawItems(activeMap);
        drawPlayer();
        attack();
        drawUI();
    }

    // define keys and an array to keep key states
    // global key log;
    var keyState = [];
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_Z = 90;
    const KEY_X = 88;


    // create a logging function
    const keyEventLogger =  function (e) {  keyState[e.keyCode] = e.type == 'keydown';}
    window.addEventListener("keydown", keyEventLogger);
    window.addEventListener("keyup", keyEventLogger);

    setInterval(function(){ animate = true }, 150);


    activeMap = maps[mapNumer];
    console.log(player);
    load();