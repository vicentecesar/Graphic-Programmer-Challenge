class Curve {
    /* Define uma resolução padrão para as curvas nessa aplicação */
    static resolution = 40;
    
    constructor(vertices, img) {
        this.vao = gl.createVertexArrayObjectMesh(null, vertices, null);
        /* Define o modo de desenho de forma que gere pontos interligados por uma linha */
        this.vao.drawMode = gl.LINE_STRIP;
        this.texture = gl.createTextureBufferObject(img);
    }

    draw() {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.bindVertexArray(this.vao.id);

        gl.drawArrays(this.vao.drawMode, 0, this.vao.vertexCount);

        gl.bindVertexArray(null);
    }

    /* Permite que uma curva seja definida dinamicamente sempre que alterada pelo programa principal */
    updete(vertices) {
        gl.bindVertexArray(this.vao.id);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vao.vertexBuffer);
        /*
            STATIC_DRAW é a melhor opção aqui, pois a curva é atualizada apenas quando o usuario a
            modifica com o input do teclado, o que é menor até mesmo que a taxa de quadros.
            DYNAMIC_DRAW não é necessario aqui.
        */
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}