//Creo una clase para los sonidos, así les doy más funcionalidad
export class sfx {
    //En el constructor paso el nombre del elemento en el html y si debe repetirse el audio al terminar
    constructor(src, autoPlay = false) {
        this.sound = document.getElementById(src);
        //Creo una función para poder parar el audio cuando quiera
        this.stop = function () {
            this.sound.pause();
        };
        //Creo una función para poder reproducir el audio cuando quiera
        this.play = function () {
            this.sound.currentTime = 0;
            this.sound.play();
        };
        //Creo una función para cambiar el volumen del audio
        this.volume = function(vol) {
            this.sound.volume = vol;
        }
    }
}