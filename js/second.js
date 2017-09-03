function onload() {
    //1.初始化GL
    var gl = initGL('canvas');
    //2.清空GL
    // clearGL(gl);
    //3.构建着色器
    // const fsSource = `void main() {
    //     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    // }`;
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
    //4.程序对象创建和连接
    var prg = createProgram(gl, vsShader, fsShader);
    //5.vertex情报组织
    //5.1.attributeLoction的获取
    // var attLocation = gl.getAttribLocation(prg, 'position');
    var attLocation = new Array(2);
    attLocation[0] = gl.getAttribLocation(prg, 'position');
    attLocation[1] = gl.getAttribLocation(prg, 'color');
    //5.2.attribute 元素数数量(这次使用xyz,所以取3)
    // var attStride = 3;
    var attStride = new Array(2);
    attStride[0] = 3;
    attStride[1] = 4;
    //5.3.模型(顶点)数据
    var vertexPosition = [
        0.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 0.0, 0.0
    ];
    var vertexColor = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
    //6.生成 VBO(vertex buffer object)
    // var vbo = createVBO(gl, vertexPosition);
    var positionVBO = createVBO(gl, vertexPosition);
    var colorVBO = createVBO(gl, vertexColor);
    setAttribut(gl, [positionVBO, colorVBO], attLocation, attStride);
    //10.矩阵相关处理
    //10.1 matIV对象生成
    var m = new matIV();
    //10.2 各种矩阵的生成和初始化
    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var vpMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());
    //10.3 视图变换坐标矩阵
    m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    //10.4 投影坐标变换矩阵
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);
    //10.5 各矩阵向乘，得到最终矩阵
    // m.multiply(pMatrix, vMatrix, mvpMatrix);
    // m.multiply(mvpMatrix, mMatrix, mvpMatrix);
    //将试图矩阵和投影矩阵乘好保存起来
    m.multiply(pMatrix, vMatrix, vpMatrix);

    //移动第一个模型的模型坐标变换矩阵
    // m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
    //第一个模型 模型矩阵*视图矩阵*投影矩阵
    // m.multiply(vpMatrix, mMatrix, mvpMatrix);
    //将坐标变换矩阵传入uniformLocation，并绘制
    //11. 11.1 uniformLocation的获取
    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
    //11.2 向uniformLocation中传入变换矩阵
    // gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
    //12 绘制模型
    // gl.drawArrays(gl.TRIANGLES, 0, 3);

    //第二个模型
    // m.identity(mMatrix);
    // m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
    // m.multiply(vpMatrix, mMatrix, mvpMatrix);
    // gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    //13 context刷新

    var count = 0;
    (function () {
        clearGL(gl);
        count++;
        var rad = (count % 360) * Math.PI / 180;


        //模型1按照一个圆的轨道旋转
        var x = Math.cos(rad);
        var y = Math.sin(rad);
        m.identity(mMatrix);
        m.translate(mMatrix, [x, y + 1.0, 0.0], mMatrix);
        //完成模型1坐标变换，并绘制
        m.multiply(vpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);



        //模型2沿Y轴进行旋转
        m.identity(mMatrix);
        m.translate(mMatrix, [1.0, -1.0, 0.0], mMatrix);
        m.rotate(mMatrix, rad, [0, 1, 0], mMatrix);
        //模型2坐标变换，绘制
        m.multiply(vpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);


        //模型3进行放大缩小
        var s = Math.sin(rad) + 1.0;
        m.identity(mMatrix);
        m.translate(mMatrix, [-1.0, -2.0, 0.0], mMatrix);
        m.scale(mMatrix, [s, s, 0.0], mMatrix);
        //模型3的变换，绘制
        m.multiply(vpMatrix, mMatrix, mvpMatrix);
        gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush();
        setTimeout(arguments.callee, 1000 / 30);
    })();
}
//初始化gl
function initGL(id) {
    var c = document.getElementById(id);
    var gl = c.getContext('webgl');
    return gl;
}
//清除GL
function clearGL(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
//构建着色器
function createShader(gl, type, source) {
    var shader = null;
    switch (type) {
        case 'fs':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;
        case 'vs':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;
        default:
            break;
    }
    //将资源分配shader
    gl.shaderSource(shader, source);
    //编译着色器
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;
    else {
        console.log(gl.getShaderInfoLog(shader));
    }
}
//程序对象的生成和连接
function createProgram(gl, vsShader, fsShader) {
    //创建程序对象
    var program = gl.createProgram();
    //向程序对象里分配着色器
    gl.attachShader(program, vsShader);
    gl.attachShader(program, fsShader);
    //连接着色器
    gl.linkProgram(program);
    //判断着色器连接是否成功
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        return program;
    } else {
        console.log(gl.getProgramInfo(program));
    }
}
//生成VBO
function createVBO(gl, data) {
    //生成缓存对象
    var vbo = gl.createBuffer();
    //绑定缓存
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    //向缓存中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    //将绑定的缓存设为无效
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}
//设置VBO属性
function setAttribut(gl, vbos, attL, attS) {
    vbos.forEach(function (vbo, i) {
        //7.绑定VBO(位置)
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        //8.设定attribute属性有效
        gl.enableVertexAttribArray(attL[i]);
        //9.添加attribute属性
        gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
    }, this);
}