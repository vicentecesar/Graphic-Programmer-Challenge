/*
    Tranform: Classe respossavel por realizar tranformações geometricas em objetos em uma sena.
    A maior parte do calculo matricial ocorre aqui, exceto onde foir explicto no desafio que fossem
    usadas matrizes.

    A implementação da classe tranform é independentem de aplicações 3D ou 2D, sendo necessario apenas
    zerar a coordenada z ao usar uma aplicação 2D.

    Em caso de uso de instruções SIMD, usar vetores de 4 floats dariam um maior desempenho, mesmo para
    aplicações 2D
*/

class Transform {
    constructor () {
        /* Atributos basicos para realizar tranformações geomtricas */
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = new Vector3(0, 0, 0);

        /* Armazenamos um cache com a matriz de tranformação ja calculada */
        this.toWord = Matrix4.identity();
    }

    /* Atualiza a matriz de tranformação */
    update() {
        /* Gera matrizes de tranformação */
        var rx = Matrix4.rotateX(this.rotation.x * Transform.degToRad);
        var ry = Matrix4.rotateY(this.rotation.y * Transform.degToRad);
        var rz = Matrix4.rotateZ(this.rotation.z * Transform.degToRad);
        
        var t = Matrix4.translate(this.position);

        var s = Matrix4.scale(this.scale);

        /* Calcula world matrix */
        this.toWord = t.multiplyMatrix4(rx).multiplyMatrix4(ry).multiplyMatrix4(rz).multiplyMatrix4(s);
    }

    /* Retorna a matrix de tranformação */
    toMatrix() {
        this.update();
        return this.toWord;
    }
}

// TODO: Passar isso para a classe Math?
Transform.degToRad = Math.PI/180;