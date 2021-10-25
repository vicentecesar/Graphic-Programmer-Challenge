class Application2D {
    constructor() {
        var _this = this;

        /* Calcula proporção da tela */
        this.aspect = window.innerWidth / window.innerHeight;
        var inv = 1.0 / this.aspect;

        /* Cria shader padrão */
        this.shader = new Shader(Util.getTextByID("vertex-shader"), Util.getTextByID("fragment-shader"));

        /* Cria objetos em cena */
        this.background = new SceneNode(new Sprite(Util.getImageByID("background")));
        this.background2 = new SceneNode(new Sprite(Util.getImageByID("background")));
        this.grass = new SceneNode(new Sprite(Util.getImageByID("grass")));
        this.grass2 = new SceneNode(new Sprite(Util.getImageByID("grass")));
        this.tank = new SceneNode(new Sprite(Util.getImageByID("tank")));
        this.cannon = new SceneNode(new Sprite(Util.getImageByID("cannon")));
        /* No vazio para ajudar a posicionar o centro de rotação do canhão */
        this.emptyNode = new SceneNode();
        /* No vazio, paio de todos os nos da cena, ajuda na escala da cena */
        this.root = new SceneNode();
        this.projectile = new SceneNode(new Sprite(Util.getImageByID("projectile")));
        this.curve = new SceneNode(new Curve(new Array(Curve.resolution * 3).fill(0), Util.getImageByID("blue")));
        

        /* Define hierarquia de nós  */
        this.emptyNode.setParent(this.tank);
        this.cannon.setParent(this.emptyNode);
        this.background.setParent(this.root);
        this.background2.setParent(this.root);
        this.tank.setParent(this.root);
        this.curve.setParent(this.root);
        this.grass.setParent(this.root);
        this.grass2.setParent(this.root);
        this.projectile.setParent(this.root);

        /* Posiciona elementos na tela e ajusta seus tamanhos dentro da arvore de hierarquia */
        this.tank.transform.position.y = 51;
        this.cannon.transform.position.y = -this.cannon.getObject().getHeight() / 2.0;
        this.emptyNode.transform.rotation.z = 30;
        this.emptyNode.transform.position.x = 57;
        this.emptyNode.transform.position.y = 45;
        this.projectile.transform.position = this.getStartParticlePosition();
        this.projectile.transform.rotation.z = this.emptyNode.transform.rotation.z;
        this.background.transform.scale = new Vector3(8.0 * inv, 5.0 * inv, 1);
        this.background2.transform.scale = new Vector3(-8.0 * inv, 5.0 * inv, 1);
        this.grass.transform.scale = new Vector3(8.0 * inv, 1, 1);
        this.grass2.transform.scale = new Vector3(-8.0 * inv, 1, 1);
        this.curve.transform.position.y = 6;

        /* Inicialmente o projetil é invsivel */
        this.projectile.setVisible(false);
        
        /* Cria camera */
        this.camera = new OrthographicCamera(0, window.innerWidth, 0, window.innerHeight);

        /* Adiciona elementos a cena */
        this.scene = new Scene();
        this.scene.add(this.root);
        this.scene.setShader(this.shader);
        this.scene.setCamera(this.camera);

        /* Controle de resize */
        window.addEventListener("resize", function (e) { _this.onResize() });
        
        /* Controle de input */
        this.key = [];
        window.addEventListener("keydown", function (e) { _this.key[e.key] = true; });
        window.addEventListener("keyup", function (e) { _this.key[e.key] = false; });

        /* Recupera campos a serem preenchidos */
        this.height = document.getElementById("height");
        this.size = document.getElementById("size");
        this.distance = document.getElementById("distance");
        
        /* Configura o projetil */
        this.velocity = 30.0;
        this.p = new Particle(this.projectile.transform, this.getProjectileVelocity());

        /* Redimenciona a cena para o zoom ideal */
        this.scaleScene();

        /* Prrenche os valores nos campos solicitados */
        this.updateValues();
    }

    /* Realiza o processamento da entrada de usuario, atualiza a fisica da particula e desenha a cena */
    onUpdate(deltaTime) {
        this.processUserInput(deltaTime);
        this.p.update(deltaTime);
        this.scene.draw();

        /*
            Atualiza os valores de tragetoria analitica e numerica
            Caso queira ver a comparação dos dois valores, descomente a linha abaixo
        */
        
        // this.size.innerHTML = this.p.numericPathLenth.toFixed(2) + " / " + this.pathLenth.toFixed(2);
    }

    /* Redimenciona a cena ao redimenionar a tela, para que a cena seja responsiva */
    onResize() {
        this.aspect = window.innerWidth / window.innerHeight;
        var inv = 1.0 / this.aspect;
        this.background.transform.scale = new Vector3(8.0 * inv, 5.0 * inv, 1);
        this.background2.transform.scale = new Vector3(-8.0 * inv, 5.0 * inv, 1);
        this.grass.transform.scale = new Vector3(8.0 * inv, 1, 1);
        this.grass2.transform.scale = new Vector3(-8.0 * inv, 1, 1);
        this.camera.resize(0, window.innerWidth, 0, window.innerHeight);
        this.scaleScene();
    }

    /*
        Processa as entradas de usuario e atualiza os valores calculados para a nova configuração.
        Logo apos, a cena é redimencionada para o zoom ideial.
        Apertando a tecla espaço o metodo de integração é iniciado, exibindo a tragetoria do projetil.

        Uma trava de algulo foi estabelecida no canhão, pois em angulos mt grandes ou muito pequenos,
        o sprite do canhão se esconde totalmente atrás do sprite do tanque
    */

    processUserInput(deltaTime) {
        if(this.key["ArrowUp"]) {
            this.emptyNode.transform.rotation.z += 60 * deltaTime;

            this.setAngle(this.emptyNode.transform.rotation.z)

            this.p.setPosition(this.getStartParticlePosition());
            this.p.setVelocity(this.getProjectileVelocity());
            this.updateValues();
            this.scaleScene();
        } else if(this.key["ArrowDown"]) {
            this.emptyNode.transform.rotation.z -= 60 * deltaTime;

            this.setAngle(this.emptyNode.transform.rotation.z)
            
            this.p.setPosition(this.getStartParticlePosition());
            this.p.setVelocity(this.getProjectileVelocity());
            this.updateValues();
            this.scaleScene();
        }
        
        if(this.key[" "]) {
            this.startSimulation();
        }
    }

    /* Define o angulo */
    setAngle(angle) {
        var ang = angle;

        if(ang > 140)
            ang = 140;

        if(ang < -30)
            ang = -30;

        this.emptyNode.transform.rotation.z = ang;

        this.p.setPosition(this.getStartParticlePosition());
        this.p.setVelocity(this.getProjectileVelocity());
        this.updateValues();
        this.scaleScene();
    }

    /* Função usada pelos testes automaticos */
    startSimulation() {
        if(!this.p.isStart()) {
            this.p.setPosition(this.getStartParticlePosition());
            this.p.setVelocity(this.getProjectileVelocity());
            this.p.reset();
            this.p.start();
            this.projectile.setVisible(true);
        }
    }

    /* Calcula os valores solicitados e atualiza a curva */
    updateValues() {
        var cannonWidth = this.cannon.getObject().getWidth() / Physics.pixelPerMeters;
        var cannonPos = this.emptyNode.transform.position.divideScalar(Physics.pixelPerMeters);
        var angle = this.emptyNode.transform.rotation.z;
        var maxHeight = this.p.getMaxHeight(cannonPos.y + this.getCannonDirection().multiplyScalar(cannonWidth).y);
        var maxDistance = this.p.getMaxDistance(maxHeight);

        this.height.innerHTML = maxHeight.toFixed(2);
        this.maxDistance = maxDistance;
        this.distance.innerHTML = maxDistance.toFixed(2);
        this.pathLenth = this.p.getPathLenthDown(this.p.getDownTime(maxHeight)) + this.p.getPathLenth(angle) / 2;
        this.size.innerHTML = this.pathLenth.toFixed(2);

        this.curveArray = this.p.generateTragetory(this.p.getUpTime(this.velocity, angle, Physics.gravity) + this.p.getDownTime(maxHeight));
        this.curve.getObject().updete(this.curveArray)
    }

    /* Recupera a direção do canhão */
    getCannonDirection() {
        var angle = this.emptyNode.transform.rotation.z;
        /* Inicialmente o canhão aponta para direita (Vetor normalizado) */
        var r = new Vector3(1.0, 0.0, 0.0);
        /* Rotacionamos a direção para ser  a mesma do canhão */
        var dir = Matrix4.rotateZ(angle * Transform.degToRad).multiplyVector3(r);
        return dir;
    }

    /*
        Calcula a posição onde a simulação da particula irá começar. Isso é necessario pois o projetil
        é filho apenas do nó raiz, uma vez que problemas complicados podem ocorrer ao misturar simulação
        fisica com a hierarquia de nós, ja que a arvore de nós mantem o posicionamento local no componet
        transform e a fisica necessita do posicionamento global.
    */
    getStartParticlePosition() {
        return this.tank.transform.position.addVector3(
            this.emptyNode.transform.position.addVector3(
            this.getCannonDirection().multiplyScalar(this.cannon.getObject().getWidth())
        )).subVector3(new Vector3(0.0, 7.0, 0.0));
    }

    /* Recupera o vetor velocidade do projetil */
    getProjectileVelocity() {
        return this.getCannonDirection().multiplyScalar(this.velocity);
    }

    /* Calcula a largura que a tela devira ter se desejamos apenas o tanque e a curva na tela */
    getSceneWidth() {
        var cannonPos = this.emptyNode.transform.position.divideScalar(Physics.pixelPerMeters);
        var cannonWidth = this.cannon.getObject().getWidth() / Physics.pixelPerMeters;
        var maxHeight = this.p.getMaxHeight(cannonPos.y + this.getCannonDirection().multiplyScalar(cannonWidth).y);

        return this.p.getMaxDistance(maxHeight) * Physics.pixelPerMeters +
        (cannonPos.x + this.getCannonDirection().multiplyScalar(cannonWidth).x) * Physics.pixelPerMeters;
    }

    /* Calcula a altura da tela de forma que englobe a curva e o tanque */
    getSceneHeight() {
        var cannonPos = this.emptyNode.transform.position.divideScalar(Physics.pixelPerMeters);
        var cannonWidth = this.cannon.getObject().getWidth() / Physics.pixelPerMeters;
        var h = this.p.getMaxHeight(cannonPos.y + this.getCannonDirection().multiplyScalar(cannonWidth).y) *
        Physics.pixelPerMeters +
        this.grass.getObject().getHeight();

        /* Caso a curva seja menor que o tanque, retorna a altura do tanque */
        return Math.max(h, this.tank.getObject().getHeight() + this.grass.getObject().getHeight());
    }

    /* Calcula o deslocamento a esquerda em caso de mira para tras */
    getCurveDif() {
        return Math.abs(this.curveArray.at(-3));
    }

    /* Calcula o tamanho da tela em caso de mira para tras */
    getInvSceneWidth() {
        return Math.abs(this.curveArray.at(-3)) + this.tank.getObject().getWidth();
    }

    /* Escala a cena de forma a marte um zoom perfeito */
    scaleScene() {        
        if(this.getCannonDirection().x < 0) {
            var sw = Math.abs(window.innerWidth / this.getInvSceneWidth());
            var sh = Math.abs(window.innerHeight / this.getSceneHeight());
            var s = sw < sh ? sw : sh;
            this.root.transform.scale = new Vector3(s, s, 1);
            /* Movimenta a camera para que a cena seja totalmente englobada */
            this.camera.transform.position.x = - this.getCurveDif() * s;
        } else {
            var sw = Math.abs(window.innerWidth / this.getSceneWidth());
            var sh = Math.abs(window.innerHeight / this.getSceneHeight());
            var s = sw < sh ? sw : sh;
            this.root.transform.scale = new Vector3(s, s, 1);
            this.camera.transform.position.x = 0;
        }
    }
}