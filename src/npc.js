//Creo una clase para los sonidos, así les doy más funcionalidad
export class NPC {
    //En el constructor paso el nombre del elemento en el html y si debe repetirse el audio al terminar
    constructor(x, y, msg, sprite) {
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.sprite = sprite;
    }

    //Getters
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get msg(){
        return this._msg;
    }
    get sprite(){
        return this._sprite;
    }

    //Setters
    set x(newX) {
        this._x = newX;
    }
    set y(newY) {
        this._y = newY;
    }
    set msg(newMsg){
        this._msg = newMsg;
    }
    set sprite(newSprite){
        this._sprite = newSprite;
    }

    getPos(){
        let pos = {npc_x: this._x, npc_y: this._y };
        return pos;
    }
}