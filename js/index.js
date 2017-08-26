var gl;

function start() {
    var canvas = document.getElementById("canvas");
    gl = initWebGL(canvas);
    if (!gl) return;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function initWebGL(canvas) {
    window.gl = null;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {

    }
    if (!gl) {
        console.log('WebGL初始化失败');
        gl = null;
    }
    return gl;
}