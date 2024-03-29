/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "program", "shaders", 
        "models/triangle", "models/cube", "models/band", "models/robot"], 
       (function($, glmatrix, util, Program, shaders,
                 Triangle, Cube, Band, Robot ) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.vertexColor = new Program(gl, 
                                                shaders.vs_PerVertexColor(), 
                                                shaders.fs_PerVertexColor() );   
        this.programs.red = new Program(gl, 
                                        shaders.vs_NoColor(), 
                                        shaders.fs_ConstantColor([1.0,0.0,0.0,1.0]) );
        
        this.programs.black = new Program(gl, 
                						shaders.vs_NoColor(), 
                						shaders.fs_ConstantColor([0.0,0.0,0.0,1.0]) );
        
        this.programs.green = new Program(gl,
				shaders.vs_NoColor(), 
				shaders.fs_ConstantColor([0.0,1.0,0.0,1.0]) );
        
        this.programs.violet = new Program(gl, 
				shaders.vs_NoColor(), 
				shaders.fs_ConstantColor([1.0,0.0,1.0,1.0]) );
        
        // create some objects to be used for drawing
        this.triangle = new Triangle(gl);
        this.cube = new Cube(gl);
        this.band = new Band(gl);
        this.wireframe = new Band(gl, {asWireframe : true});
        this.robot = new Robot(gl, this.programs);

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by
        // the HtmlController. Each attribute in this.drawOptions
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false, 
                             "Triangle": false,
                             "Cube": false,
                             "Band": false,
                             "Wireframe": false,
                             "Depth Test": true,
                             "Backface-Culling": false,
                             "Show Robot": true
                             };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }
        
        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
// gl.enable(gl.DEPTH_TEST);
// gl.depthFunc(gl.LESS);
        
        // TODO ver�nderte cube darstellung???????
        if(this.drawOptions["Depth Test"]){                    
        	gl.enable(gl.DEPTH_TEST);
        }
        else {
        	gl.disable(gl.DEPTH_TEST);
        }
        gl.depthFunc(gl.LESS)
        
        if(this.drawOptions["Backface-Culling"]) {
        	gl.enable(gl.CULL_FACE);
        	gl.frontFace(gl.CW);
			gl.cullFace(gl.BACK);
        }
        else {
        	gl.disable(gl.CULL_FACE);
        }
                
        // draw the scene objects
        if(this.drawOptions["Triangle"]) {    
           this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Cube"]) {    
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Band"]) {    
            this.band.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Wireframe"]) {    
            this.wireframe.draw(gl, this.programs.black);
        }
        if(this.drawOptions["Show Robot"]) {    
            this.robot.draw(gl, this.programs.red, this.transformation);
        }
    };
	

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {
       // window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

         /* TODO remove stupid switch !!!! */

     // degrees to radians
        var radians = angle*Math.PI/180;
        // manipulate the corresponding matrix, depending on the name of the
		// joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.transformation, radians, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.transformation, radians, [1,0,0]);
                break;
            case "worldZ": 
                mat4.rotate(this.transformation, radians, [0,0,1]);
                break;
            case "headX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "headY":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "leftShoulderX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "leftShoulderZ":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "leftElbowX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "leftWristX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "leftWristY":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "rightShoulderX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "rightShoulderZ":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "rightElbowX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "rightWristX":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            case "rightWristY":
            	this.robot.rotate(rotationAxis, angle);
            	break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };
        // redraw the scene
        this.draw();
    }
    return Scene;           
})); // define module
        

