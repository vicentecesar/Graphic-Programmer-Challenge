/*
    Classe para representar vetores de 3 dimenções. Opicionalmente poderia-se usar uma classe Vector2,
    o equivalente a zerar a coordenada Z.

    A classe contem metodos basicos para aritimetica, comprimento e normalização
*/

class Vector3 {
    constructor(x, y, z) {
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        var len = this.length();
        return new Vector3(this.x/len, this.y/len, this.z/len);
    }

    multiplyScalar(s) {
        return new Vector3(this.x*s, this.y*s, this.z*s);
    }

    divideScalar(s) {
        return new Vector3(this.x/s, this.y/s, this.z/s);
    }

    addVector3(vector) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    subVector3(vector) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    getArray() {
        return [this.x, this.y, this.z];
    }

    /* Esse metodo permite que a traibução seja feita por copia, e não por referencia para vetores */
    copy () {
        return new Vector3(this.x, this.y, this.z);
    }

    toString(){
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
}