function onload() {
    var gl = initGL('canvas');
    var prg = init(gl);
    //顶点构造
    clearGL(gl);

    // gl.drawArrays(gl.POINTS, 0, 4);
    // gl.flush();
    //http://www.gltech.win/%E5%AD%A6%E4%B9%A0webgl/2017/07/10/%E7%BB%98%E5%88%B6%E7%82%B9%E7%BA%BF%E9%9D%A2.html
    var selectNode = document.getElementById('drawModeSelect');
    var mode = null;


    selectNode.onchange = function (e) {
        var vertexPosition = [
            0.0, 1.0, 0.0,
            0.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0
        ];
        var vertexColor = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        var count = 4;
        var modetxt = e.target.value;
        switch (modetxt) {
            case 'points':
                mode = gl.POINTS;
                break;
            case 'lineStrip':
                mode = gl.LINE_STRIP;
                break;
            case 'lineLoop':
                mode = gl.LINE_LOOP;
                break;
            case 'lines':
                mode = gl.LINES;
                break;
            case 'triangleStrip':
                mode = gl.TRIANGLE_STRIP;
                vertexPosition = [
                    0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0,
                    1.0, 1.0, 0.0,
                    2.0, 0.0, 0.0
                ];
                break;
            case 'triangleFan':
                mode = gl.TRIANGLE_FAN;
                vertexPosition = [
                    0.0, 0.0, 0.0
                ];
                vertexColor = [
                    1.0, 1.0, 0.0, 1.0
                ];
                count = 1;
                for (var angle = 0; angle < 361; angle++) {
                    var a = angle / 180 * Math.PI;
                    var x = Math.cos(a);
                    var y = Math.sin(a);
                    var z = 0;

                    vertexPosition.push(x);
                    vertexPosition.push(y);
                    vertexPosition.push(z);
                    vertexColor = vertexColor.concat([1.0, 1.0, 0.0, 1.0]);
                    count++;
                }
                break;
            case 'triangles':
                mode = gl.TRIANGLES;
                break;
            case 'null':
                clearGL(gl);
                break;
        }
        if (modetxt != 'null') {
            vertexBuild(gl, prg, vertexPosition, vertexColor);
            matrixBuild(gl, prg);
            clearGL(gl);
            gl.drawArrays(mode, 0, count);
        }

    }
}

function init(gl) {
    //着色器 vec4(1.0,0.0,0.0,0.5)
    const fsSource = `
        precision mediump float;
        varying vec4 vColor;
        void main() {
            gl_FragColor = vColor;
        }`;
    const vsSource = `
        attribute vec3 position;
        attribute vec4 color;
        uniform mat4 mvpMatrix;
        varying vec4 vColor;
        void main(void){
            vColor = color;
            gl_Position = mvpMatrix * vec4(position, 1.0);
            gl_PointSize = 10.0;
        }`;
    var fsShader = createShader(gl, 'fs', fsSource);
    var vsShader = createShader(gl, 'vs', vsSource);
    //程序对象
    var prg = createProgram(gl, vsShader, fsShader);
    return prg;
}

function vertexBuild(gl, prg, vertexPosition, vertexColor) {
    var attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');

    var attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;

    //5.3.模型(顶点)数据
    // var vertexPosition = [
    //     0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0,
    //     1.0, 1.0, 0.0,
    //     1.0, 0.0, 0.0
    // ];
    // var vertexColor = [
    //     1.0, 1.0, 1.0, 1.0,
    //     1.0, 0.0, 0.0, 1.0,
    //     0.0, 1.0, 0.0, 1.0,
    //     0.0, 0.0, 1.0, 1.0
    // ];
    var positionVBO = createVBO(gl, vertexPosition);
    var colorVBO = createVBO(gl, vertexColor);
    setAttribut(gl, [positionVBO, colorVBO], attLocation, attStride);
}

function matrixBuild(gl, prg) {
    //矩阵计算
    var m = new matIV();
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var vpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(pMatrix, vMatrix, vpMatrix);
    m.multiply(vpMatrix, mMatrix, mvpMatrix);
    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
    gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
}