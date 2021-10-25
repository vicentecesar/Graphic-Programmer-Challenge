/*
    Representa um sprite que pode ser renderizavel pela GPU. Alem de de informações necessarias para
    renderização (vertices e textura), um Sprite tambem contem informações de altura e lagura, o que pode
    ser necessario para calculos de posição no programa
*/

class Sprite {
    constructor(img) {
        var vertices = [
            img.width, 0.0, 0.0,
            img.width, img.height, 0.0,
            0.0,       img.height, 0.0,
            0.0,       0.0, 0.0
        ];
        
        var uvs = [
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ];
        
        var indices = [
            0, 1, 2,
            0, 2, 3
        ];
        
        this.width = img.width;
        this.height = img.height;

        this.vao = gl.createVertexArrayObjectMesh(indices, vertices, uvs);
        this.texture = gl.createTextureBufferObject(img, true);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    draw() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.bindVertexArray(this.vao.id);

        gl.drawElements(this.vao.drawMode, this.vao.indexCount, gl.UNSIGNED_SHORT, 0);

        gl.bindVertexArray(null);
    }
}