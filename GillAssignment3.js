"use strict";

//author: Matt Gill
//date: 3/2/2021
//description: This program is a tent with a sun going around it, the  behind the horizon. 
//The started code is the solution for the triangle and spinning cube in class exercise.
//proposed points (8 of 10): The only problem I can get figured out is the colors. For some reason my colors will not change.
//I tried to email for help on this, but never heard back.
//For the keybaord inputs, D changes the direction of the sun, F makes it go faster, and S makes it go slower. The case does not matter.

//declare global variables
var canvas;
var gl;
var theta = 0.0;
var thetaLoc;
var vertices;
var verticesTriangle;
var verticesHorizon;
var program;
var programTriangle;
var programHorizon;
var horizon = true;
var speed = 0.1;
var direction = false;
var speed2 = 0.1;
var colors;
var colors2;

window.onload = function init()
{
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();

    colors = [
    vec3(1,1,0),
    vec3(0,1,1),
    vec3(1,1,1)
    ];
    colors2 = [
    vec3(0,0,0),
    vec3(0,0,0),
    vec3(0,0,0),
    vec3(0,0,0),
    vec3(0,0,0),
    vec3(0,0,0)

    ];


    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //This is the sun. I would like it to be yellow. and rotate through the sky.

    vertices = [
        vec2(0, .75),
        vec2(.25, .75),
        vec2(0, 1),
        vec2(.25, 1)
    ];
    
    //This is the tent, I would like the color of the tent to be random. It ended up being a random shade of red.
    verticesTriangle = [
        vec2(-0.3, -0.7),
        vec2(0.3, -0.7),
        vec2(0, 0.5)
    ];
    //This is the horizon, I would like it to be black.
    verticesHorizon = [
        vec2(-1, 0),
        vec2(1, 0),
        vec2(-1, -1),
        vec2(-1, -1),
        vec2(1, -1),
        vec2(1, 0)
    ];

    // establish shaders and uniform variables
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programTriangle = initShaders(gl, "vertex-shader-still", "fragment-shader-color");
    programHorizon = initShaders(gl, "vertex-shader-still", "fragment-shader-color");

    //This function creates a menu that allows you to speed up the sun and change the direction of it.
    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            case 0:
                direction = !direction;
                break;
            case 1:
                speed += .1;
        }
    }
    //This creates a slider which allows you to speed up the sun and slow it down. These work on different variables so they will cancel eachother out.

    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("Speed slider", speed2);  //I changed this to speedw so that they are seperate.
    }

    //This changes the color of the tent to a random shade of red.

    document.getElementById("Change Color").onclick = function(event) {
        console.log("pressed button");
        let r = Math.random()
        let g = Math.random()
        let b = Math.random()
        colors = [
            vec3(r,g,b),
            vec3(r,g,b),
            vec3(r,g,b),
            vec3(r,g,b)
        ];
    //This allows the user to speed up and slow down the sun using keyboard inputs.
    }
        window.onkeydown = function(event) {
            var key = String.fromCharCode(event.keyCode);
            switch( key ) {
                case 'D': //changes the direction of the sun.
                case 'd':
                    direction = !direction;
                    break;
                case 'F': // makes the sun go faster
                case 'f':
                    speed += .1;
                    break;
                case 'S': // makes the sun go slower
                case 's':
                    speed = .1;
                    if (speed < 0) {
                        speed = 0;
                    }
                    break;
                }
        };

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // This implements the menu
    if (direction == true) {
        theta += speed;
    }
    else {
        theta -= speed;
    }
    //This implements the slider.
    theta += speed2;
    //Now we make the sun. 
    
    gl.useProgram(program);
   
    // Load the data from above
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate shader variables with our data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // This makes the sun rotate around the middle.
    theta += 0.01;
    gl.uniform1f(thetaLoc, theta);

    // Now draw the sun on 
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Load the data
    //Draw the horizon
    //I did this before the tent so that the tent is on top.
    //I made a new vertex shader. This is probably not necessary, but I was trying to get some other things working.
    gl.useProgram(programHorizon);

    //I used buffer ID too, this probably doesnt make a difference.
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    //Used verticesHorizon as this is the 
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesHorizon), gl.STATIC_DRAW);

    var positionLoc2 = gl.getAttribLocation(programHorizon, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    let cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );

    //Had to use colorLoc2 so they wouldnt interfere. I flipped them so colorLoc is down below.
    let colorLoc2 = gl.getAttribLocation(programHorizon, "aColor");
    gl.vertexAttribPointer(colorLoc2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc2);

    gl.drawArrays(gl.TRIANGLES, 0, verticesHorizon.length);

    gl.useProgram(programTriangle);

    //I switched over to programTriangle This probably doesnt do anything other than change the color.
    // We are also now using the Triangle points

    var bufferId3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    var positionLoc2 = gl.getAttribLocation(programTriangle, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    let colorLoc = gl.getAttribLocation(programTriangle, "aColor");
    gl.vertexAttribPointer(colorLoc, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);

    requestAnimationFrame(render);
}
