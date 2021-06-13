//Clase enemigo que perseguirá y atacará al jugador
export class MeleeEnemy {
    constructor(type, hp, speed, cdAttack, x, y) {
        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.cdAttack = cdAttack;
        this.x = x;
        this.y = y;
        this.deathFrames = 120;
        this.animFrame = 0;
    }

    //Getters
    get hp() {
        return this._hp;
    }
    get speed() {
        return this._speed;
    }
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get deathFrames(){
        return this._deathFrames;
    }
    get animFrame(){
        return this._animFrame;
    }

    //Setters
    set speed(newSpeed){
        this._speed = newSpeed;
    }
    set hp(newHp) {
        this._hp = newHp;
    }
    set x(newX) {
        this._x = newX;
    }
    set y(newY) {
        this._y = newY;
    }
    set deathFrames(newDeathFrames){
        this._deathFrames = newDeathFrames;
    }
    set animFrame(newAnimFrame){
        this._animFrame = newAnimFrame;
    }

    //Animación
    animate(){
        if(this._animFrame >= 59){
            this._animFrame = 0;
        } else {
            this._animFrame++;
        }
        return Math.floor(this._animFrame/20);
    }

    //Devuelve la posición como un objeto
    getPos(){
        let pos = {enemy_x: this._x, enemy_y: this._y };
        return pos;
    }

    //Recibe daño
    damage(){
        this.hp -= 1;
    }

    //Comprueba si puede moverse en una dirección
    //1 = up, 2 = right, 3 = down, 4 = left
    checkCol(dir, activeMap){
        let result = false;
        switch(dir){
            case 1: if(activeMap[Math.floor(this.y/10)][Math.round(this.x/10)] > 20){
                        result = true;
                    }; break;
            case 2: if(activeMap[Math.ceil(this.y/10)][Math.floor(this.x/10)+1] > 20){
                        result = true;
                    }; break;
            case 3: if(activeMap[Math.round(this.y/10)+1][Math.round(this.x/10)] > 20){
                        result = true;
                    }; break;
            case 4: if(activeMap[Math.ceil(this.y/10)][Math.ceil(this.x/10)-1] > 20){
                        result = true;
                    }; break;
        }
        return result;
    }

    //Se mueve hacia el jugador
    moveTowards(playerX, playerY, map){
        if(this.x > 1 && this.x < map[0].length*10){
            if(this.x > playerX && !this.checkCol(4, map)){
                this.x-=this.speed;
            }
            if(this.x < playerX && !this.checkCol(2, map)){
                this.x+=this.speed;
            }
        }
        if(this.y> 0 && this.y < map.length*10){
            if(this.y > playerY && !this.checkCol(1, map)){
                this.y-=this.speed;
            }
            if(this.y < playerY && !this.checkCol(3, map)){
                this.y+=this.speed;
            }
        }

    }
}