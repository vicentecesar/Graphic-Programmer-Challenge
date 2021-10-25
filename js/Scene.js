/*
    Esse arquivo define cenas na aplicação. Uma cena Representa uma hierarquia de transformações gemotricas
    que são aplicadas de pai para filho em uma arvore. Para essa aplicação, uma cena realiza renderização
    em modo imediato, sendo assim a ordem dos filhos afeta a ordem de renderização.

    Para aplicações mais complexas uma fila de rerização (renderização adiada) pode ser usada para controlar
    a ordem de renderização
*/

/* Classe para representar um nó da arvore de hierarquia da cena */
class SceneNode {
    constructor (object) {
        if(object == undefined)
            this.object = null;
        else
            this.object = object;
        
        this.transform = new Transform();
        this.children = [];
        this.parent = null;

        this.visible = true;
    }

    getObject() {
        return this.object;
    }

    /* Desenha a hierarquia de nos */
    draw(shader, tpMatrix) {
        for(var i = 0; i < this.children.length; i++) {
            this.children[i].draw(shader, tpMatrix.multiplyMatrix4(this.transform.toMatrix()));
        }

        if(this.object && this.visible) {
            shader.setMatrix4fv("model", tpMatrix.multiplyMatrix4(this.transform.toMatrix()));
            this.object.draw();
        }
    }

    /*
        Uma relação entre dois nós pode ser feita com setParent ou addChild. São formas diferentes para
        obter o mesmo resultado, dando mais flexibilidade na hora de realizar as logicas de hierarquia.

        Não a problema chamar os dois metodos erroneamente, a ligação será refeita, mas o nó não será
        duplicada
    */

    setParent(parent) {
        /* Caso o no ja tenha um pai, essa hierarquia é desfeita */
        if(this.parent != null)
            this.parent.removeChild(this);
        
        /* Se o pai for um objeto valido, cria uma nova ligação na hierarquia */
        if(parent != null && parent != undefined) {
            parent.addChild(this);
        }
    }

    getParent() {
        return this.parent;
    }

    /* Adiciona um no filho caso não o tenha ainda */
    addChild(child) {
        /* Se o filho não existir adiciona-o na hierarquia */
        if(this.children.indexOf(child) == -1) {
            child.parent = this;
            this.children.push(child);
        }
    }

    removeChild(child) {
        var index = this.children.indexOf(child);
        if(index != -1) {
            this.children[index].parent = null;
            this.children.splice(index, 1);
        }
    }

    setVisible(visible) {
        this.visible = visible;
    }
}

/* Classe que contem uma cena completa */
class Scene {
    constructor () {
        this.nodes = [];
        this.shader = null;
        this.camera = null;
    }

    setShader(shader) {
        this.shader = shader;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    add(node) {
        this.nodes.push(node);
    }

    /* Desenha todos os nós na raiz da cena, fazendo que toda a hierarquia seja desenhar recursivamente */
    draw() {
        this.shader.bind();
        this.shader.setMatrix4fv("projection", this.camera.getProjectionMatrix());
        this.shader.setMatrix4fv("view", this.camera.getViewMatrix());
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(this.shader, Matrix4.identity());
        }
    }
}