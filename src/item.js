//Clase Item que facilitará crear y colocar objetos en el mapa
export class Item {
    constructor(id, desc, name, rarity, category, x, y) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.desc = desc;
        this.name = name;
        this.rarity = rarity;
        this.category = category;
    }

    //Getters
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
    get id(){
        return this._id;
    }
    get desc(){
        return this._desc;
    }
    get name(){
        return this._name;
    }
    get rarity(){
        return this._rarity;
    }
    get category(){
        return this._category;
    }

    //Setters
    set x(newX) {
        this._x = newX;
    }
    set y(newY) {
        this._y = newY;
    }
    set id(newId){
        this._id = newId;
    }
    set desc(newDesc){
        this._desc = newDesc;
    }
    set name(newName){
        this._name = newName;
    }
    set rarity(newRarity){
        this._rarity = newRarity;
    }
    set category(newCat){
        this._category = newCat;
    }
}