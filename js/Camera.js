/*
    Representa a camera no mundo 2D. Para essa aplicação a camera é uma matriz de projeção orthografica e
    uma matrix de vizualização que permite a movimentala pela cena.

    TODO: Zoom deveriza ser uma funcionalidade na camera?
*/

class Camera {
    constructor(transform, view, projection) {
        this.transform = transform;
        this.projection = projection;
    }

    getProjectionMatrix() {
        return this.projection;
    }

    getViewMatrix() {
        return Matrix4.translate(new Vector3(
            -this.transform.position.x,
            -this.transform.position.y,
            -this.transform.position.z
        ));
    }
}

class OrthographicCamera extends Camera {
    constructor (left, right, bottom, top) {
        var projection = Matrix4.orthographic(left, right, bottom, top);
        super(new Transform() ,Matrix4.identity(), projection);
    }

    resize(left, right, bottom, top) {
        super.projection = Matrix4.orthographic(left, right, bottom, top);
    }
}