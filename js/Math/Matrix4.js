/*
	Usado para representar matrizes de tranformação homogena 4x4. Opicionamente poderiamos usar uma matriz
	homogenea 3x3 para abragir apenas 2D, porem matrizes 4x4 permitem melhores otimizações usando SIMD.

	Alem de matrizes de tranformação, essa classe possui tambem o necessario para realizar aritimetica com
	matrizes.
*/

class Matrix4 {
    constructor (array) {
        if(array === undefined){
            this.data = new Float32Array(16);
        } else {
            this.data = array;
        }
    }

    static identity(){
		var array = new Float32Array(16);

		array[0] = array[5] = array[10] = array[15] = 1;

		return new Matrix4(array);
	}

    static translate(vector) {
		var array = new Float32Array(16);

        array[0] = 1.0;
		array[1] = 0;
		array[2] = 0;
		array[3] = vector.x;
		array[4] = 0;
		array[5] = 1.0;
		array[6] = 0;
		array[7] = vector.y;
		array[8] = 0;
		array[9] = 0;
		array[10] = 1.0;
		array[11] = vector.z;
		array[12] = 0;
		array[13] = 0;
		array[14] = 0;
		array[15] = 1.0;

        return new Matrix4(array);
    }

    static scale(vector){
		var array = new Float32Array(16);

        array[0] = vector.x;
		array[1] = 0;
		array[2] = 0;
		array[3] = 0;
		array[4] = 0;
		array[5] = vector.y;
		array[6] = 0;
		array[7] = 0;
		array[8] = 0;
		array[9] = 0;
		array[10] = vector.z;
		array[11] = 0;
		array[12] = 0;
		array[13] = 0;
		array[14] = 0;
		array[15] = 1.0;

        return new Matrix4(array);
    }

	static rotateX(angle) {
		var array = new Float32Array(16);

        var s = Math.sin(angle);
		var c = Math.cos(angle);

        array[0] = 1.0;
		array[1] = 0.0;
		array[2] = 0.0;
		array[3] = 0.0;
		array[4] = 0.0;
		array[5] = c;
		array[6] = -s;
		array[7] = 0.0;
		array[8] = 0.0;
		array[9] = s;
		array[10] = c;
		array[11] = 0.0;
		array[12] = 0.0;
		array[13] = 0.0;
		array[14] = 0.0;
		array[15] = 1.0;

        return new Matrix4(array);
    }

    static rotateY(angle) {
		var array = new Float32Array(16);

        var s = Math.sin(angle);
		var c = Math.cos(angle);

        array[0] = c;
		array[1] = 0.0;
		array[2] = s;
		array[3] = 0.0;
		array[4] = 0.0;
		array[5] = 1.0;
		array[6] = 0.0;
		array[7] = 0.0;
		array[8] = -s;
		array[9] = 0.0;
		array[10] = c;
		array[11] = 0.0;
		array[12] = 0.0;
		array[13] = 0.0;
		array[14] = 0.0;
		array[15] = 1.0;

        return new Matrix4(array);
    }

    static rotateZ(angle) {
		var array = new Float32Array(16);

        var s = Math.sin(angle);
		var c = Math.cos(angle);

        array[0] = c;
		array[1] = -s;
		array[2] = 0.0;
		array[3] = 0.0;
		array[4] = s;
		array[5] = c;
		array[6] = 0.0;
		array[7] = 0.0;
		array[8] = 0.0;
		array[9] = 0.0;
		array[10] = 1.0;
		array[11] = 0.0;
		array[12] = 0.0;
		array[13] = 0.0;
		array[14] = 0.0;
		array[15] = 1.0;

        return new Matrix4(array);
    }

	static orthographic(left, right, bottom, top) {
		var array = new Float32Array(16);

		array[0] = 2.0 / (right - left);  				// 0,0
		array[1] = 0;									// 0,1
		array[2] = 0;									// 0,2
		array[3] = -(right + left) / (right - left);	// 0,3

		array[4] = 0;									// 1,0
		array[5] = 2.0 / (top - bottom);				// 1,1
		array[6] = 0;									// 1,2
		array[7] = -(top + bottom) / (top - bottom);	// 1,3

		array[8] = 0;									// 2,0
		array[9] = 0;									// 2,1
		array[10] = -1;									// 2,2
		array[11] = 0;									// 2,3

		array[12] = 0;									// 3,0
		array[13] = 0;									// 3,1
		array[14] = 0;									// 3,2
		array[15] = 1;									// 3,3

		return new Matrix4(array);
	}

    multiplyMatrix4 (matrix) {
		var array = new Float32Array(16);

        array[0] =  this.data[0] *  matrix.data[0] + this.data[1] *  matrix.data[4] + this.data[2] *  matrix.data[8] +  this.data[3] *  matrix.data[12];
		array[1] =  this.data[0] *  matrix.data[1] + this.data[1] *  matrix.data[5] + this.data[2] *  matrix.data[9] +  this.data[3] *  matrix.data[13];
		array[2] =  this.data[0] *  matrix.data[2] + this.data[1] *  matrix.data[6] + this.data[2] *  matrix.data[10] + this.data[3] *  matrix.data[14];
		array[3] =  this.data[0] *  matrix.data[3] + this.data[1] *  matrix.data[7] + this.data[2] *  matrix.data[11] + this.data[3] *  matrix.data[15];
		array[4] =  this.data[4] *  matrix.data[0] + this.data[5] *  matrix.data[4] + this.data[6] *  matrix.data[8] +  this.data[7] *  matrix.data[12];
		array[5] =  this.data[4] *  matrix.data[1] + this.data[5] *  matrix.data[5] + this.data[6] *  matrix.data[9] +  this.data[7] *  matrix.data[13];
		array[6] =  this.data[4] *  matrix.data[2] + this.data[5] *  matrix.data[6] + this.data[6] *  matrix.data[10] + this.data[7] *  matrix.data[14];
		array[7] =  this.data[4] *  matrix.data[3] + this.data[5] *  matrix.data[7] + this.data[6] *  matrix.data[11] + this.data[7] *  matrix.data[15];
		array[8] =  this.data[8] *  matrix.data[0] + this.data[9] *  matrix.data[4] + this.data[10] * matrix.data[8] +  this.data[11] * matrix.data[12];
		array[9] =  this.data[8] *  matrix.data[1] + this.data[9] *  matrix.data[5] + this.data[10] * matrix.data[9] +  this.data[11] * matrix.data[13];
		array[10] = this.data[8] *  matrix.data[2] + this.data[9] *  matrix.data[6] + this.data[10] * matrix.data[10] + this.data[11] * matrix.data[14];
		array[11] = this.data[8] *  matrix.data[3] + this.data[9] *  matrix.data[7] + this.data[10] * matrix.data[11] + this.data[11] * matrix.data[15];
		array[12] = this.data[12] * matrix.data[0] + this.data[13] * matrix.data[4] + this.data[14] * matrix.data[8] +  this.data[15] * matrix.data[12];
		array[13] = this.data[12] * matrix.data[1] + this.data[13] * matrix.data[5] + this.data[14] * matrix.data[9] +  this.data[15] * matrix.data[13];
		array[14] = this.data[12] * matrix.data[2] + this.data[13] * matrix.data[6] + this.data[14] * matrix.data[10] + this.data[15] * matrix.data[14];
		array[15] = this.data[12] * matrix.data[3] + this.data[13] * matrix.data[7] + this.data[14] * matrix.data[11] + this.data[15] * matrix.data[15];

        return new Matrix4(array);
    }

	/*
		Multiplicar um vetor por uma matriz é o equivalente a ter a coordenada w = 0, podendo rotacionar
		e escalar o vetor, mas não tranlada-lo.
	*/

	multiplyVector3 (vector) {
        var x = this.data[0]  * vector.x + this.data[1]  * vector.y + this.data[2]  * vector.z;
        var y = this.data[4]  * vector.x + this.data[5]  * vector.y + this.data[6]  * vector.z;
        var z = this.data[8]  * vector.x + this.data[9]  * vector.y + this.data[10] * vector.z;

        return new Vector3(x, y, z);
    }

	/*
		Pontos tem a coordenada homogenea w = 1, o que significa que podem ser rotacionados, recimencionados
		e ao contrario dos vetores, tambem podem ser transladados
	*/
	multiplyPoint3 (vector) {
        var x = this.data[0]  * vector.x + this.data[1]  * vector.y + this.data[2]  * vector.z + this.data[3];
        var y = this.data[4]  * vector.x + this.data[5]  * vector.y + this.data[6]  * vector.z + this.data[7];
        var z = this.data[8]  * vector.x + this.data[9]  * vector.y + this.data[10] * vector.z + this.data[11];
        
        return new Vector3(x, y, z);
    }

	toString() {
		return 	this.data[0]  + " " + this.data[1]  + " " + this.data[2]  + " " + this.data[3]  + "\n" + 
				this.data[4]  + " " + this.data[5]  + " " + this.data[6]  + " " + this.data[7]  + "\n" + 
				this.data[8]  + " " + this.data[9]  + " " + this.data[10] + " " + this.data[11] + "\n" + 
				this.data[12] + " " + this.data[13] + " " + this.data[14] + " " + this.data[15] + "\n";
	}
}