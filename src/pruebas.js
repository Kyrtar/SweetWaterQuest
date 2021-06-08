/*
(function() {
    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 480;

    let fps = 2;

    let tileIMGres = 32;
    

    var villageIMG = new Image();

    let grass = [0, 5];
    let dirt = [2,10];

    let villageMap = [
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, dirt,  grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,dirt , grass],
        [grass, dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass]
        //[20,21,22]
    ];

    let redHouse = [
        [21,0,21,1,21,2],
        [22,0,22,1,22,2],
        [23,0,23,1,23,2],
        [24,0,24,1,24,2]
    ]

    let deco = [
        [redHouse]
    ]

    function load(){
        /// add the onload handler before setting src.
        villageIMG.onload = draw();
        villageIMG.src = "./img/village.png";
    }

    function drawTerrain(map){
        for(let y = 0; y < map.length; y++){
            for(let x = 0; x < map[y].length; x++){
                    ctx.drawImage(villageIMG, map[y][x][1]*tileIMGres, map[y][x][0]*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres);
            }
        }
    }

    function drawDeco(map){
        for(let d = 0; d < deco.length; d++){
            for(let y = 0; y < deco[d].length; y++){
                for(let x = 0; x < deco[d][y].length; x++){
                    for(let t = 0; t < deco[d][y][x].length; t+=2){
                        //console.log(deco[d][y][x][t]);
                        ctx.drawImage(villageIMG, deco[d][y][x][t+1]*tileIMGres, deco[d][y][x][t]*tileIMGres, tileIMGres, tileIMGres, t*tileIMGres/2, x*tileIMGres, tileIMGres, tileIMGres);
                    }
                }
            }
        }
    }

    function drawMap(map){

        drawTerrain(map);
        drawDeco(map);
        
    }

    function draw() {
        setTimeout(function(){
            //Limpio el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            ctx.fillStyle = "rgb(20,20,20)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 1000/fps);
        
        drawMap(villageMap);
    }

    load();
})();

*/

(function() {
    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');

    canvas.width = 640;
    canvas.height = 480;

    let fps = 2;

    let tileIMGres = 32;
    

    var villageIMG = new Image();

    let grass = [0, 5];
    let dirt = [2,10];
    let redHouse11 = [21,0], redHouse12 = [21,1], redHouse13 = [21,2],
        redHouse21 = [22,0], redHouse22 = [22,1], redHouse23 = [22,2],
        redHouse31 = [23,0], redHouse32 = [23,1], redHouse33 = [23,2],
        redHouse41 = [24,0], redHouse42 = [24,1], redHouse43 = [24,2];


    let villageMap = [
        [redHouse11, redHouse12, redHouse13, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [redHouse21, redHouse22, redHouse23, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [redHouse31, redHouse32, redHouse33, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [redHouse41, redHouse42,  redHouse43, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,dirt , grass],
        [grass, dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  dirt,  grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass],
        [grass, grass, grass, grass, grass, grass, grass, grass ,grass ,dirt,  grass, grass, grass, grass, grass, grass, grass, grass ,grass ,grass]
        //[20,21,22]
    ];

    let redHouse = [
        [21,0,21,1,21,2],
        [22,0,22,1,22,2],
        [23,0,23,1,23,2],
        [24,0,24,1,24,2]
    ]

    let greenHouse = [
        [29,0,29,1,29,2],
        [30,0,30,1,30,2],
        [31,0,31,1,31,2],
        [32,0,32,1,32,2]
    ]

    let deco = [
        [redHouse],
        [greenHouse]
    ]

    let decoPos = [
        [0, 0],
        [17, 0]
    ]

    function load(){
        /// add the onload handler before setting src.
        villageIMG.onload = draw();
        villageIMG.src = "./img/village_bg.png";
    }

    function drawTerrain(map){
        for(let y = 0; y < map.length; y++){
            for(let x = 0; x < map[y].length; x++){
                    ctx.drawImage(villageIMG, map[y][x][1]*tileIMGres, map[y][x][0]*tileIMGres, tileIMGres, tileIMGres, x*tileIMGres, y*tileIMGres, tileIMGres, tileIMGres);
            }
        }
    }

    function drawDeco(map){
        for(let d = 0; d < deco.length; d++){
            for(let y = 0; y < deco[d].length; y++){
                for(let x = 0; x < deco[d][y].length; x++){
                    for(let t = 0; t < deco[d][y][x].length; t+=2){
                        console.log(deco[d][y][x][t]);
                        //ctx.drawImage(villageIMG, deco[d][y][x][t+1]*tileIMGres, deco[d][y][x][t]*tileIMGres, tileIMGres, tileIMGres, (decoPos[d][0]+y)*tileIMGres, (decoPos[d][1]+x)*tileIMGres, tileIMGres, tileIMGres);
                    }
                }
            }
        }
    }

    function drawMap(map){

        drawTerrain(map);
        drawDeco(map);
        
    }

    function draw() {
        setTimeout(function(){
            //Limpio el canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            ctx.fillStyle = "rgb(20,20,20)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }, 1000/fps);
        
        drawMap(villageMap);
    }

    load();
})();