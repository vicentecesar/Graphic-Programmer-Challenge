/*
    Arquivo emcapsular as principais funcionalidades WebGL usadas (Funcionalidade mais genericas).
    O arquivo tambem inicializa o contexto WebGL
*/

/* Posição dos atributos no shader */
const ATTR_POSITION = 0;
const ATTR_UV = 1;

/* Contexto global OpenGL atualmente vinculado */
var gl;

/* Inicializa o contexto WebGL */
function CreateContext(canvasID) {
    var canvas = document.getElementById(canvasID);
    var glContext = canvas.getContext("webgl2");

    if(!glContext) {
        console.error("WebGL 2 não está disponivel ...");
        return null;
    }

    /*
        Definimos a cor padrão na qual queremos a tela e definimos alguns metodos auxiliares aqui.
        Algumas opções de renderização tambem são definidas aqui
    */

    /* Habilita teste de profundidade */
    glContext.enable(glContext.DEPTH_TEST);
    /* Descarta fragmentos com valores menor ou igual ao fragmento atual */
    glContext.depthFunc(glContext.LEQUAL);
    /* Define a função de blending para 1 - alpha e a habilita */
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA);
    glContext.enable( glContext.BLEND );

    /* Limpa a tela com a cor padrão */
    glContext.clearColor(1.0, 1.0, 1.0, 1.0);

    /* Emcapsulamento de funcionalidade WebGL */
    glContext.setClearColor = function (r, g, b) {
        this.clearColor(r, g, b, 1.0);
    }

    glContext.clearScreen = function () {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
    }

    glContext.setSize = function (w, h) {
        if(w === undefined || h === undefined){
            w = window.innerWidth;
            h = window.innerHeight;
        }

        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w
        this.canvas.height = h;

        this.viewport(0, 0, w, h);
    }

    glContext.createArrayBuffer = function (vextexArray, isStatic) {
        /* Valor default para variavel */
        if(isStatic === undefined) isStatic = true;

        var vertexBuffer = this.createBuffer();

        this.bindBuffer(this.ARRAY_BUFFER, vertexBuffer);
        this.bufferData(this.ARRAY_BUFFER, vextexArray, isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER, null);

        return vertexBuffer;
    }

    glContext.createTextureBufferObject = function (img, flipY) {
        var tbo = this.createTexture();

        if(flipY == true) {
            this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
        }

        this.bindTexture(this.TEXTURE_2D, tbo);
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);

        /* Configura opções de filtragem para quando o zoom estiver muito alto */
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);

        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE);
        this.texParameteri(this.TEXTURE_2D, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE);

        this.generateMipmap(this.TEXTURE_2D);
        this.bindTexture(this.TEXTURE_2D, null);

        if(flipY == true) {
            this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);
        }

        return tbo;
    }
    
    glContext.createVertexArrayObjectMesh = function (indices, vertices, uvs) {
        var vao = {drawMode : this.TRIANGLES};

        vao.id = this.createVertexArray();
        this.bindVertexArray(vao.id);

        if(vertices !== undefined && vertices != null) {
            vao.vertexBuffer = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, vao.vertexBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_POSITION);
            this.vertexAttribPointer(ATTR_POSITION, 3, this.FLOAT, false, 0, 0);

            vao.vertexCount = vertices.length / 3;
        }

        if(uvs !== undefined && uvs != null) {
            vao.uvBuffer = this.createBuffer();

            this.bindBuffer(this.ARRAY_BUFFER, vao.uvBuffer);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_UV);
            this.vertexAttribPointer(ATTR_UV, 2, this.FLOAT, false, 0, 0);

            vao.uvCount = uvs.length / 2;
        }

        if(indices !== undefined && indices != null) {
            vao.indexBuffer = this.createBuffer();

            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, vao.indexBuffer);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            
            vao.indexCount = indices.length;
        }

        /*
            Os objetos devem ser desvinculados na ordem reverssa para não sejam removidos os estado do VAO
        */
        
        this.bindVertexArray(null);
        this.bindBuffer(this.ARRAY_BUFFER, null);
        if(indices !== undefined && indices != null)
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);

        return vao;
    }

    glContext.bindContext = function () {
        gl = this;
    }

    glContext.bindContext();
    glContext.setSize();
    window.addEventListener("resize", function (e) { glContext.setSize() });

    return glContext;
}