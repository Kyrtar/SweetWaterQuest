    import {sfx} from "./sfx_class.js";
    import {MeleeEnemy} from "./meleeEnemy.js";
    import {NPC} from "./npc.js";
    import {Item} from "./item.js"

    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 480;

    //Con esta variablo calculo el refresco del juego
    let fps = 60;

    //Variables sobre los sprites
    let tileIMGres = 32;
    let height = 15,
        width = 20;

    //Timers
    var timer = null;
    var dyingTimer = 0;
    
    //Creo el jugador
    var player = {
        pos: {x:20, y:90},
        class: 1,
        //Adquiero algunas propiedades desde el localstorage, ya que vienen del servidor
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
    var mapNumer = 0;

    var villageIMG = new Image();
    var dungeonIMG = new Image();
    var chatbox = new Image();

    //Creo los audios que usa el juego, uso mi clase SFX
    var audio = {
        villageMusic: new sfx("./audio/village.mp3", true),
        dungeonMusic: new sfx("./audio/dungeon.mp3", true),
        gameOverMusic: new sfx("./audio/game_over.wav"),
        hit: new sfx("./audio/hit.wav"),
        skeleton: new sfx("./audio/skeleton.wav"),
        potionSound: new sfx("./audio/potion.wav"),
        healSound: new sfx("./audio/heal.wav")
    }


    //Creo el primer mapa
    let villageMap = {
        name: "village",
        npc: [
            //Creo un array de npcs para que hablen con el jugador
            new NPC(8,5, "They're taking the children to the cave! Save them!", "elder"),
            new NPC(8,15, "Go to the cave!", "dino"),
            new NPC(8,15, "Go to the cave!", "dino"),
            new NPC(3,10, "Use the arrow keys to move and Z to attack", "sign")
        ],
        //Decido si es hostil o no
        hostile: false,
        //Le añado música
        music: audio.villageMusic,
        //Creo los enemigos
        enemies: [],
        //Creo el mapa de tiles
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
        //Añado las coordenadas para pasar al siguiente mapa
        nextMap: [95,0],
        //Añado las coordenadas para volver al mapa anterior
        previousMap: null,
        //Añado un punto de inicio para cuando el jugador cambia de zona
        startPoint: [95,35],
        //Añado los objetos que habrá de serie en el mapa
        items: []
    }

    //Añado el mapa creado al array de mapas
    maps.push(villageMap);

    let dungeonMap = {
        name: "dungeon",
        npc: [
            new NPC(18,4, "You saved me!", "mKid"),
            new NPC(3,13, "Thank you!", "fKid"),],
        hostile: true,
        music: audio.dungeonMusic,
        enemies: [
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 30, 20),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 150, 30),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 20, 100),
            new MeleeEnemy("skeleton", 3, 0.25, 1000, 110, 70)
        ],
        map: [
        [102,101,101,101,103,  0,  0,  0,  0,  0,  0,102,101,101,101,101,101,101,101,103],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),106,  0,  0,  0,  0,  0,  0,100,r(),r(),r(),r(),r(),r(),r(),106],
        [100,r(),r(),r(),105,101,101,101,101,101,101,104,r(),106,101,101,101,101,101,104],
        [100,r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),r(),106,  0,  0,  0,  0,  0,  0],
        [100,r(),r(),r(),102,101,101,101,101,101,101,101,r(),106,  0,  0,  0,  0,  0,  0],
        [100,r(),r(),r(),106,  0,100,r(),r(),r(),r(),r(),r(),106,  0,  0,  0,  0,  0,  0],
        [100,r(),r(),r(),106,  0,100,r(),r(),r(),r(),r(),r(),106,  0,  0,  0,  0,  0,  0],
        [100,r(),r(),r(),106,  0,100,r(),r(),r(),r(),r(),r(),106,  0,  0,  0,  0,  0,  0],
        [100,r(),r(),r(),106,  0,100,r(),r(),r(),r(),r(),r(),106,  0,  0,  0,  0,  0,  0],
        [105,101,101,101,104,  0,105,101,  2,  2,  2,101,101,101,  0,  0,  0,  0,  0,  0]
        ],
        nextMap: null,
        previousMap: [95,140],
        startPoint: [95, 125],
        items: [new Item(1,"5, heal", "Potion", 0, "Consumable", 9, 8)]
    }

    maps.push(dungeonMap);

    //Creo una función para conseguir un número aleatorio para el mapa de mazmorra
    function r() {
        let min = 1;
        let max = 4;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    //Cargo los assets
    function load(){
        /// add the onload handler before setting src.¡
        villageIMG.src = "./img/village_bg.png";
        dungeonIMG.src = "./img/dungeon_b.png";
        chatbox.src = "./img/chatbox.png";
        document.getElementById("game").focus();
        dungeonIMG.onload = draw();
    }

    //Función para añadir items
    function addItem(map, id, x, y){
        switch(id){
            //Poción
            case 1: map.items.push(new Item(1,"5, heal", "Potion", 0, "Consumable", x, y)); break;
        }
        
    }

    //Función para reiniciar cuando el jugador muere
    function die(){
        
        audio.gameOverMusic.play();
        window.removeEventListener("keydown", keyEventLogger);
        window.removeEventListener("keyup", keyEventLogger);

        setTimeout(function(){
            player.potions = 1;
            mapNumer = 0;
            activeMap.music.stop();
            activeMap = maps[mapNumer];
            activeMap.music.play();
            player.pos.x = 20
            player.pos.y = 90;
            player.exp = 0;
            player.level = 1;
            window.addEventListener("keydown", keyEventLogger);
            window.addEventListener("keyup", keyEventLogger);
            player.hp = player.MaxHp;
        }, 2000);
    }

    //Dibujo el mapa
    function drawMap(map){
        //Si es hostil uso el mapa de mazmorras, si no el de pueblo
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

    //Dibujo los objetos recolectables
    function drawItems(map){
        for(let i = 0; i < map.items.length; i++){
            //onsole.log(i);
            switch(map.items[i].id){
                //Walkable
                case 1: ctx.drawImage(dungeonIMG, 18*tileIMGres, 14*tileIMGres, tileIMGres, tileIMGres, map.items[i].x*tileIMGres, map.items[i].y*tileIMGres, tileIMGres, tileIMGres); break;
            }
        }
    }

    //Compruebo las colisiones
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

    //Escucho los controles de teclado y muevo al jugador
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

        //Si el jugador se acerca al punto de entrada del siguiente mapa, viaja
        if(activeMap.nextMap != null){
            if(Math.abs(player.pos.x - activeMap.nextMap[0]) <= 15){
                if(Math.abs(player.pos.y - activeMap.nextMap[1]) <= 10){
                    if(maps[mapNumer+1].hostile != maps[mapNumer.hostile]){
                        maps[mapNumer].music.stop();
                    }
                    mapNumer++;
                    activeMap = maps[mapNumer];
                    activeMap.music.play();
                    player.pos.x = activeMap.startPoint[0];
                    player.pos.y = activeMap.startPoint[1];
                }
            }
        }

        //Si el jugador se acerca al punto de entrada del mapa anterior, viaja
        if(activeMap.previousMap != null){
            if(Math.abs(player.pos.x - activeMap.previousMap[0]) <= 15){
                if(Math.abs(player.pos.y - activeMap.previousMap[1]) <= 10){
                    if(maps[mapNumer-1].hostile != maps[mapNumer.hostile]){
                        maps[mapNumer].music.stop();
                    }
                    mapNumer--;
                    activeMap = maps[mapNumer];
                    activeMap.music.play();
                    player.pos.x = activeMap.startPoint[0];
                    player.pos.y = activeMap.startPoint[1];
                }
            }
        }

        //Si el jugador se acerca a un objeto, los coge
        if(activeMap.items.length > 0){
            for(let i= 0; i < activeMap.items.length; i++){
                if(Math.abs(player.pos.x - activeMap.items[i].x*10) <= 10){
                    if(Math.abs(player.pos.y - activeMap.items[i].y*10) <= 10){
                        player.potions++;
                        audio.potionSound.play();
                        document.getElementById("potions").value = player.potions;
                        activeMap.items.splice(i,1);
                    }
                }
            }
        }
    }

    //Dibujo al jugador
    function drawPlayer(){
        //si el jugador está parado tiene un sprite fijo
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
            //Si el jugador se está moviendo, se crea una animación
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
        //Dibujo a los NPCs
        for(let i = 0; i < activeMap.npc.length; i++){
            switch(activeMap.npc[i].sprite){
                case "elder": ctx.drawImage(dungeonIMG, 13*tileIMGres+1, 11*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres, tileIMGres+16); break;
                case "mKid":  ctx.drawImage(dungeonIMG, 10*tileIMGres+1, 3*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres-4, tileIMGres); break;
                case "fKid":  ctx.drawImage(dungeonIMG, 10*tileIMGres+1, 1*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres-16, tileIMGres-4, tileIMGres); break;
                case "sign":  ctx.drawImage(villageIMG, 8*tileIMGres+1, 13*tileIMGres, tileIMGres, tileIMGres, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres, tileIMGres, tileIMGres); break;
                default: ctx.drawImage(dungeonIMG, 8*tileIMGres+1, 13*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.npc[i].x*tileIMGres, activeMap.npc[i].y*tileIMGres, tileIMGres, tileIMGres+16); break;
            }
            //Si el jugador se acerca aparecerá el mensaje del NPC
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
        //Dibujo a los enemigos
        for(let i=0; i<activeMap.enemies.length; i++){
            if(activeMap.enemies[i].hp>0){
                //Los enemigos siempre están animados
                ctx.drawImage(dungeonIMG, (24+activeMap.enemies[i].animate())*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, activeMap.enemies[i].x/10*tileIMGres, activeMap.enemies[i]._y/10*tileIMGres, tileIMGres, tileIMGres+12);
                if(Math.abs(activeMap.enemies[i].x - player.pos.x) < 40 && Math.abs(activeMap.enemies[i].y - player.pos.y) < 30){
                    //Si el jugador está cerca, muevo a los enemigos hacia él
                    activeMap.enemies[i].moveTowards(player.pos.x, player.pos.y, activeMap.map);
                }
                if(Math.abs(player.pos.x - activeMap.enemies[i].x) < 5){
                    if(Math.abs(player.pos.y - activeMap.enemies[i].y) < 5){
                        if(player.hp > 0){
                            //Si el jugador se acerca demasiado a un enemigo, pierde vida
                            player.hp--;
                            audio.hit.play();
                        }

                        let moveX = (player.pos.x - activeMap.enemies[i].x)*1.5;
                        let moveY = (player.pos.y - activeMap.enemies[i].y);

                        let colY = false, colX = false;

                        //Compruebo que el enemigo pueda moverse en la dirección del jugador
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
                                //Si el jugador recibe daño, tanto él como el enemigo se mueven en direcciones contrarias
                                player.pos.x += moveX;
                                activeMap.enemies[i].x -= moveX/3;
                            }
                        }

                        if(player.pos.y > 5 && player.pos.y / 10 < height-1){
                            if(!colY){
                                //Si el jugador recibe daño, tanto él como el enemigo se mueven en direcciones contrarias
                                player.pos.y += moveY;
                                activeMap.enemies[i].y -= moveY/3;
                            }
                        }
                    }
                }
            } else if(activeMap.enemies[i]._deathFrames > 0) {
                //Si el enemigo muere, cambia su sprite
                ctx.setTransform(1, 0, 0, 1, activeMap.enemies[i].x/10*tileIMGres, activeMap.enemies[i]._y/10*tileIMGres);
                ctx.rotate(135 * Math.PI / 90);
                ctx.drawImage(dungeonIMG, (30)*tileIMGres-1, 5*tileIMGres-12, tileIMGres, tileIMGres+12, -tileIMGres*1.5, -tileIMGres/2, tileIMGres, tileIMGres+12);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                activeMap.enemies[i]._deathFrames--;
            } else {
                //Pasado un tiempo el enemigo muere y puede dejar caer una poción
                if(Math.floor(Math.random() * (100 - 1 + 1) + 1) > 40){
                    addItem(activeMap, 1, activeMap.enemies[i].x/10, activeMap.enemies[i].y/10);
                }
                //Elimino al enemigo del mapa
                activeMap.enemies.splice(i,1);
                //El jugador gana experiencia
                player.exp += 100;
                document.getElementById("exp").value = player.exp;
                //Si el jugador gana suficiente experiencia, sube de nivel
                if(player.exp >= 300){
                    player.exp -= 300;
                    player.level++;
                    document.getElementById("level").value = player.level;
                }
            }
        }
    }

    function attack(){
        //Compruebo si el jugador está atacando
        if(player.attacking === true){
            //Roto el sprite de ataque dependiendo de la orientación
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
            //Genero la animación
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

        //Compruebo si hay algún enemigo en el rango de alcance del ataque, en la dirección usada
        switch(player.dir){
            case "up":      upOffset = -20; downOffset = 0;
                            leftOffset = -5; rightOffset = 15;
                            for(let i=0; i<activeMap.enemies.length; i++){
                                if(activeMap.enemies[i]._hp > 0){
                                    if(activeMap.enemies[i].y <= player.pos.y + downOffset && activeMap.enemies[i].y >= player.pos.y + upOffset &&
                                       activeMap.enemies[i].x <= player.pos.x + rightOffset && activeMap.enemies[i].x >= player.pos.x + leftOffset){
                                        activeMap.enemies[i].damage();
                                        audio.skeleton.play();
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
                                        activeMap.enemies[i].damage();
                                        audio.skeleton.play();
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
                                        activeMap.enemies[i].damage();
                                        audio.skeleton.play();
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
                                        activeMap.enemies[i].damage();
                                        audio.skeleton.play();
                                        activeMap.enemies[i].x += 10;
                                    }
                                }
                            }
            
            break;
        }
    }

    function usePotion(){
        //El jugador usa una poción, la elimina de su inventario y regenera vida
        if(player.potionCD == false && player.hp < player.MaxHp){
            audio.healSound.play();
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

    //Dibujo la interfaz de usuario
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

    //Bucle de juego, parte principal infinita que llama a todo lo demás
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
        if(player.hp <= 0){
            die();
            ctx.fillStyle = "rgba(0, 0, 0,"+dyingTimer+")";
            dyingTimer+=0.01;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        drawUI();
    }

    // defino las teclas que se pueden usar y un array para guardar las que están activas
    // Así puedo usar varias a la vez
    var keyState = [];
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_Z = 90;
    const KEY_X = 88;


    // Creo las escuchas y el evento que capturan las teclas
    const keyEventLogger =  function (e) {  keyState[e.keyCode] = e.type == 'keydown';}
    window.addEventListener("keydown", keyEventLogger);
    window.addEventListener("keyup", keyEventLogger);

    //activo las animaciones
    setInterval(function(){ animate = true }, 150);


    //Declaro el mapa de inicio
    activeMap = maps[mapNumer];
    //Pongo en marcha la música
    activeMap.music.play();
    //Cargo los assets
    load();