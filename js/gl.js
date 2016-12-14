
var gl; 
var program;
var canvas;
var texture;
var depthTexture;
var vertices;
var vertexBuffer;
var startTime;
var mousePosX=0;
var mousePosY=0;

function start() {
  canvas = document.getElementById("glcanvas");
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight;

  // Initialize the GL context
  gl = initWebGL(canvas);
  
  // Only continue if WebGL is available and working
  if (!gl) {
    return;
  }

  createProgram();

  vertices = new Float32Array([-1.0,-1.0, 1.0,-1.0, -1.0,1.0, 1.0,-1.0, 1.0,1.0, -1.0,1.0]);
  gl.enableVertexAttribArray(gl.getAttribLocation(program, "position"));
  
  initTexture();
  vertexBuffer = gl.createBuffer();
  startTime = new Date().getTime();

  document.addEventListener('mousemove',function(event){
    mousePosX = event.clientX/window.innerWidth;
    mousePosY = event.clientY/window.innerHeight;
  });
  setInterval(render, 1000/60);
}

function render (){
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(gl.getAttribLocation(program, "position"), 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.uniform1i(gl.getUniformLocation(program, "tex0"), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(program, "tex1"), 1);
  var time = (new Date().getTime() - startTime)/1000;
  gl.uniform1f(gl.getUniformLocation(program, "time"), time);
  gl.uniform2f(gl.getUniformLocation(program, "resolution"), 990, 1080);
  gl.uniform2f(gl.getUniformLocation(program, "mouse"), mousePosX, mousePosY);
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
}

function initWebGL(canvas) {
  gl = null;
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  return gl;
}

function createProgram() {
  var vs;
  var fs;
  program = gl.createProgram();

  vs = compileShader(gl, document.getElementById("shader-vs").innerHTML, gl.VERTEX_SHADER);
  fs = compileShader(gl, document.getElementById("shader-fs").innerHTML, gl.FRAGMENT_SHADER);

  gl.attachShader(program, vs);
  gl.deleteShader(vs);
  gl.attachShader(program, fs);
  gl.deleteShader(fs);
  gl.linkProgram(program);
}

function compileShader (gl, code, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "SHADER ERROR: " + gl.getShaderInfoLog(shader);
    }
    return shader;
}

function initTexture() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function() {
        handleLoadedTexture(texture)
    }
    texture.image.src = "images/cai_r.jpg";

    depthTexture = gl.createTexture();
    depthTexture.image = new Image();
    depthTexture.image.onload = function() {
        handleLoadedTexture(depthTexture)
    }
    depthTexture.image.src = "images/cai_profundidad_r.jpg";
}

function handleLoadedTexture(text) {
    gl.bindTexture(gl.TEXTURE_2D, text);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, text.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //gl.bindTexture(gl.TEXTURE_2D, null);
}




/*********************************************************************************************************************** */

function adjustCanvasBitmapSize() {

   // Get the device pixel ratio,
   var pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1.0;
   
   // Abort if nothing changed,
   if (((canvas.width / pixelRatio) == canvas.offsetWidth ) && ((canvas.height / pixelRatio) == canvas.offsetHeight)) {
      return ;
   }

   // Change internal bitmap dimensions,
   if ((canvas.width  / pixelRatio) != canvas.offsetWidth ) canvas.width  = pixelRatio * canvas.offsetWidth ;
	if ((canvas.height / pixelRatio) != canvas.offsetHeight) canvas.height = pixelRatio * canvas.offsetHeight;
	
	// Redraw everything again,
	render();
}