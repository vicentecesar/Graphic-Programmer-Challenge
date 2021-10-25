/*
    Abstração para shaders GLSL, permite que o usuario compile shaders, vicule e desvicule do contexto
    e defina variaveis de shaders na GPU
*/

class Shader {
    constructor(vsSrc, fsSrc) {
        this.id = Shader.create(vsSrc, fsSrc);
    }

    bind() {
        gl.useProgram(this.id);
    }

    unbind() {
        gl.useProgram(null);
    }

    setFloat(attr, value) {
        gl.uniform1f(gl.getUniformLocation(this.id, attr), value);
    }

    setVector3fv(attr, value) {
        gl.uniform3fv(gl.getUniformLocation(this.id, attr), value);
    }

    setMatrix4fv(attr, value) {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.id, attr), true, value.data);
    }

    static compile(src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("Erro de compilação: " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            
            return null;
        }

        return shader;
    }

    static create(vsSrc, fsSrc){

        if(!vsSrc || !fsSrc) {
            return null;
        }
        
        var vShader = Shader.compile(vsSrc, gl.VERTEX_SHADER);

        if(!vShader) {
            return null;
        }

        var fShader = Shader.compile(fsSrc, gl.FRAGMENT_SHADER);
        
        if(!fShader) {
            gl.deleteShader(vShader);
            return null;
        }

        var shaderProgram = gl.createProgram();
        
        gl.attachShader(shaderProgram, vShader);
        gl.attachShader(shaderProgram, fShader);
        gl.linkProgram(shaderProgram);

        if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Erro ao criar Shader Program: " + gl.getProgramInfoLog(shaderProgram));
            gl.deleteProgram(shader);
            
            return null;
        }

        /*
            Isso deve estar contido apenas em versões de debug e desenvolvimento:
                https://www.khronos.org/registry/OpenGL-Refpages/es2.0/xhtml/glValidateProgram.xml
        */

        gl.validateProgram(shaderProgram)

        if(!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
            console.log("Erro ao validar o programa: " + src, gl.getProgrmaInfoLog(shader));
            gl.deleteProgram(vShader);
            gl.deleteProgram(fShader);
            gl.deleteProgram(shader);
            
            return null;
        }

        gl.detachShader(shaderProgram, vShader);
        gl.detachShader(shaderProgram, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return shaderProgram;
    }
}