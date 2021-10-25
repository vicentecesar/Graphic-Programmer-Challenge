/*
    Arquivo define constantes fisicas usadas no codigo, metodos para simulação fisica e calculo usando formulas
    fisicas fechadas.
*/

/* Classe para armazenar a gravidade e constante para conversão, para que a fisica funcione corretamente */
class Physics {
    static gravity = 10.0;
    static pixelPerMeters = 20;
}


/*
    Representa a fisica de uma particula, sendo possivel simular seu movimento e calcular caracteristeicas do
    movimento como alcance, tempo de subida, decida, entre outros.
*/
class Particle {
    /* Uma particula é composta de uma tranformação e uma velocidade inicia, caso exista */
    constructor(transform, velocity) {
        /* O valor inicial passado como parametro é salvo, caso seja necessario reiniciar a simulação */
        this.startVelocity = velocity;
        this.startPosition = transform.position;
        this.transform = transform;
        this.velocity = velocity;
        this.lastPosition = transform.position;
        this.numericPathLenth = 0;
        this.run = false;
    }

    /* Metodos de integração numerica */
    
    /*
        Integra a tragetoria da particula usando "semi-implicit euler"
    
        Esse metodo é usadado para simular a tragetoria da particula
    */
    update(deltaTime) {
        
        if(this.run) {
            var g = new Vector3(0.0, -Physics.gravity, 0.0);
            
            this.velocity = this.velocity.addVector3(g.multiplyScalar(deltaTime));
            
            this.transform.position = this.transform.position.addVector3(this.velocity.multiplyScalar(Physics.pixelPerMeters * deltaTime));
            
            /* Calculo do caminho total do projetil através de integração numerica */
            this.numericPathLenth += (this.transform.position.subVector3(this.lastPosition).length() / Physics.pixelPerMeters);
            
            this.lastPosition = this.transform.position;
        }
            
        /* Como não temos um sistema de deteção de colisão, impedimos manumalmente que o projetil continue manualmete */
        if(this.transform.position.y < 50) {
            this.run = false;
        }
    }

    /* Verifica se a simulação está sendo executada */
    isStart() {
        return this.run;
    }

    /* Inicia a simulação */
    start() {
        this.run = true;
    }

    /* Para a simulação */
    pause() {
        this.run = false;
    }

    /* Reinicia a simução */
    reset() {
        this.lastPosition = this.startPosition;
        this.transform.position = this.startPosition;
        this.velocity = this.startVelocity;
        this.numericPathLenth = 0;
    }

    /* Define a posição incial para simução */
    setPosition(position) {
        this.startPosition = position;

    }

    /* Define a velocidade inicial para simulação */
    setVelocity(velocity) {
        this.startVelocity = velocity;
    }

    /* Verifica se o projetil chegou ao chão */
    onGround() {
        if(this.transform.position.y < 50)
            return true;
        else
            return false;
    }

    /* Metodos analiticos */

    /* Gera a sequencia de pontos que correspondem a tragetoria do projetil */
    generateTragetory(totalTime) {
        var gravity = new Vector3(0.0, Physics.gravity, 0.0);
        var velocity = this.startVelocity;
        /* A resolução é o numero de amostras feitas na curva, 40 é o suficiente para essa aplicação */
        var resolution = Curve.resolution;
        var step = totalTime / (resolution - 1);
        var t = 0;
        var vertices = [];
        var startPosition1 =  this.startPosition.divideScalar(Physics.pixelPerMeters);

        for(var i = 0; i < resolution; i++, t += step) {
            /*
                Inicialmente o problema foi resolvido usando calculo vetorial:
                
                var vertice = startPosition.addVector3(
                    velocity.multiplyScalar(t).subVector3(
                    gravity.multiplyScalar(t*t*0.5)
                ).multiplyScalar(Physics.pixelPerMeters));

                Como solicitado será realizado usando matrizes de transformação, sendo o calculo acima
                equivalente a:
            */

            /* Matrix de escala para converter a medida para metros */
            var c = Physics.pixelPerMeters;
            var ppm = Matrix4.scale(new Vector3(c, c, c));

            /* translação do movimento uniform */
            var v0t = Matrix4.translate(velocity.multiplyScalar(t));

            /* Translação do movimento acelerado */
            var gt2 = Matrix4.translate(gravity.multiplyScalar(-t*t*0.5));

            /* Matrix de transformação final */
            var mat = ppm.multiplyMatrix4(gt2.multiplyMatrix4(v0t));

            /* Tranforma o vertice pela matris de transformação */
            var vertice = mat.multiplyPoint3(startPosition1);

            /* Adiciona o vertice ao array */
            vertices.push(vertice.x);
            vertices.push(vertice.y);
            vertices.push(vertice.z);
        }
        
        /* Retorna o vertice */
        return vertices;
    }

    /* Recupera a direção inicial do movimento */
    getDirection(angle) {
        /* Inicialmente o canhão aponta para direita (Vetor normalizado) */
        var r = new Vector3(1.0, 0.0, 0.0);
        /* Rotacionamos a direção para ser  a mesma do canhão */
        var dir = Matrix4.rotateZ(angle * Transform.degToRad).multiplyVector3(r);
        return dir;
    }

    /* Recupera o tempo de subida */
    getUpTime() {
        var v = this.startVelocity;

        if(v.y >= 0.0)
            return v.y / Physics.gravity;
        else
            return 0.0;
    }

    /* Recupera o tempo de decida */
    getDownTime(height) {
        var dir = this.startVelocity.normalize();
        var v = this.startVelocity;

        if(height >= 0)
            if(dir.y >= 0)
                return Math.sqrt((2 * height) / (Physics.gravity));
            else {
                var delta = (v.y * v.y) + (2 * Physics.gravity * height);
                console.log(delta);
                var x = (v.y + Math.sqrt(delta)) / (2 * Physics.gravity / 2);
                return x;
            }
        else
            return 0.0;
    }

    /* Calcula a auturam maxima do movimento */
    getMaxHeight(h0) {
        var dir = this.startVelocity.normalize();
        var v = this.startVelocity;
        /* A altura inicial é a altura até a ponta do canhão */

        if(dir.y >= 0.0) {
            return h0 + (v.y * v.y) / (2 * Physics.gravity);
        } else {
            if(h0 >= 0.0)
                return h0;
            else
                return 0.0;
        }
    }

    /* Calcula a distancia maxima do movimento */
    getMaxDistance(maxHeight) {
        var time = this.getUpTime() + this.getDownTime(maxHeight);
        var v = this.startVelocity;
        return Math.abs(v.x * time);
    }

    /*
        O caminho total percorrido tambem foi calculado por integração numerica. A integração numerica
        apresenta algum nivel de imprecisão, ja que é calculada com "semi-implicit euler" enquanto a
        simulação ocorre. Para melhores resultados a integração foi calculada analiticamente aqui.
    */

    /* Calcula o caminho total percorrido suponto que o projetil sai e chega na mesma altura (integral analitica da velocidade) */
    getPathLenth(angle) {
        var rads = angle * Transform.degToRad;
        var s = Math.sin(rads);
        var c = Math.cos(rads);
        var v = this.startVelocity.length();
        var g = Physics.gravity;

        if(angle < 0) {
            return 0;
        } else {
            return ((v * v * s) / g) + ((v * v * c * c) / (2 * g)) * Math.log((1 + s) / (1 - s));
        }
    }

    /* Calcula o caminho total de um lançamento de um lançamento vertical (integral analitica da velocidade) */
    getPathLenthDown(downTime) {
        var v = this.startVelocity.x;
        var g = Physics.gravity;
        var t = downTime;
        var r = Math.sqrt(g * g * t  * t + v * v) 
        return (g * t * r + v * v * Math.log(Math.abs(g * t + r) / Math.abs(v))) / (2 * g)
    }
}