/*
    Controle do loop de renderização, pode ser usado para impor uma trava de FPS ou deixar o FSP livre
    durante a execução do software.
*/

class RenderLoop {
    constructor(callback, fps) {
        var _this = this;
        this.msLastFrame = null;
        this.callback = callback;
        this.fps = 0;
        this.isActive = false;

        if(fps != undefined && fps > 0) {
            this.msLimit = 1000.0/fps;

            this.run = function () {
                var msCurrent = performance.now();
                var msDelta = (msCurrent - _this.msLastFrame);
                var deltaTime = msDelta/1000.0;

                if(msDelta >= _this.msLimit) {
                    _this.fps = Math.floor(1.0/deltaTime);
                    _this.msLastFrame = msCurrent;
                    _this.callback(deltaTime);
                }

                if(_this.isActive) {
                    window.requestAnimationFrame(_this.run);
                }
            }
        } else {
            this.run = function () {
                var msCurrent = performance.now();
                var msDelta = (msCurrent - _this.msLastFrame);
                var deltaTime = msDelta/1000.0;

                _this.fps = Math.floor(1.0/deltaTime);
                _this.msLastFrame = msCurrent;
                _this.callback(deltaTime);

                if(_this.isActive) {
                    window.requestAnimationFrame(_this.run);
                }
            }
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);
    }

    stop() {
        this.isActive = false;
    }
}