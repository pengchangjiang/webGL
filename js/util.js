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
//创建索引缓存 IBO
function createIBO(gl, data) {
    //生成缓存对象
    var ibo = gl.createBuffer();
    //绑定缓存
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    //向缓存中写入数据
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    //将缓存绑定无效化
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;

}