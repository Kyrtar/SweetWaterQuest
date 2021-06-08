export class Map { 
    //Constructor
    constructor (name, type){
        this.name = name;
        this.type = type;
        this.map = null;
    }

    //Getters
    get name() {
        return this._name;
    }
    
    get type() {
        return this._type;
    }
    
    get map() {
        return this._map;
    }

    //Setters
    set name(new_name) {
        this._name = new_name;
    }
    
    set type(new_type) {
        this._type = new_type;
    }
    
    set map(new_map) {
        this._map = new_map;
    }

    create_map(){
        if(this._type == 0){
            map = [
                
            ]
        } else {
            return false;
        }
    }

    //Devuelvo los datos como cadena
    toString() {
        let resultado = "name: " + this._name + " - Género: " + this._genero;
        return(resultado);
    }
}