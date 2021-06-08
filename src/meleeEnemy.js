//Creo una clase para los sonidos, así les doy más funcionalidad
export class MeleeEnemy {
    //En el constructor paso el nombre del elemento en el html y si debe repetirse el audio al terminar
    constructor(type, hp, speed, cdAttack, x, y) {
        this.type = type;
        this.hp = hp;
        this.speed = speed;
        this.cdAttack = cdAttack;
        this.x = x;
        this.y = y;
        this.deathFrames = 120;
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

    getPos(){
        let pos = {enemy_x: this._x, enemy_y: this._y };
        return pos;
    }

    damage(){
        this.hp -= 1;
    }
}