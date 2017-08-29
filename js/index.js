var gl, shaderProgram;

function initWebGL(canvas) {
    gl = null;
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

function start() {
    var canvas = document.getElementById("canvas");
    //获取gl
    gl = initWebGL(canvas);
    if (!gl) return;

    //创建着色器
    var shaderProgram = initShaders();
    var programInfo = {
        program: shaderProgram,
        attribLocation: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uPMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uMVMatrix')
        }
    }
    //创建对象
    var squareVerticesBuffer = initBuffers();
    //绘制场景
    drawScene(gl, squareVerticesBuffer, programInfo)
}



function initShaders() {
    var fragmentShader = getShader(gl, 'shader-fs');
    var vertexShader = getShader(gl, 'shader-vs');
    //创建着色器
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        gl.useProgram(shaderProgram);
        return shaderProgram;
    } else {
        var log =
            gl.getProgramInfoLog(shaderProgram);
        console.log(log);
    }



    // gl.useProgram(shaderProgram);

    // vertextPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    // gl.enableVertexAttribArray(vertextPositionAttribute);
}

function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;
    shaderScript = document.getElementById(id);
    if (!shaderScript) return null;
    theSource = '';
    currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }
    if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type = 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log('着色器编译失败' + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
// var horizAspect = 480.0 / 640.0;

function initBuffers() {
    var squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    var vertices = [
        1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ]
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return squareVerticesBuffer;
}

function drawScene(gl, buffers, programInfo) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //清空到黑色
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var fieldOfView = 45 * Math.PI / 180;
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 0.1;
    var zFar = 100.0;
    var projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    var modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix,
        modelViewMatrix, [-0.0, 0.0, -6.0]
    );

    var numComponents = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers);

    gl.vertexAttribPointer(
        programInfo.attribLocation.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(
        programInfo.attribLocation.vertexPosition
    );
    // gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function makePerspective(FOV, AspectRatio, Closest, Farest) {
    var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
    var A = -(Farest + Closest) / (Farest - Closest);
    var B = -2 * Farest * Closest / (Farest - Closest);
    var C = (2 * Closest) / ((YLimit * AspectRatio) * 2);
    var D = (2 * Closest) / (YLimit * 2);
    return [
        C, 0, 0, 0,
        0, D, 0, 0,
        0, 0, A, -1,
        0, 0, B, 0
    ];
}

function MakeTransform(Object) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -6, 1
    ];
}