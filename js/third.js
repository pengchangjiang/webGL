
function onload() {
    var gl = initGL('canvas');
    //着色器
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
        }`;
    var fsShader = createShader(gl, 'fs', fsSource);
    var vsShader = createShader(gl, 'vs', vsSource);
    //程序对象
    var prg = createProgram(gl, vsShader, fsShader);

    //顶点构造
    vertexBuild(gl, prg);

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
    clearGL(gl);
    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.flush();
}
function vertexBuild(gl, prg) {
    var attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');

    var attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;

    //5.3.模型(顶点)数据
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
    var positionVBO = createVBO(gl, vertexPosition);
    var colorVBO = createVBO(gl, vertexColor);
    setAttribut(gl, [positionVBO, colorVBO], attLocation, attStride);


    //使用索引缓存
    var index = [
        0, 1, 2,
        1, 2, 3
    ];
    var ibo = createIBO(gl, index);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);


}