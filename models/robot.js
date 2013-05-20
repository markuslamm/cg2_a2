/* requireJS module definition */
define(["util", "vbo", "models/cube", "models/band", "models/triangle", "scene_node"], 
       (function(Util, vbo, Cube, Band, Triangle, SceneNode) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Robot = function(gl, programs) {
        window.console.log("creating a robot");
        
        this.programs = programs;
        
        // create some objects to be used for drawing the roboter
        var triangle = new Triangle(gl);
        var cube = new Cube(gl);
        var band = new Band(gl);
        var wireframe = new Band(gl, {asWireframe : true});        
        
        //skeleton dimensions
        var headSize = [0.3, 0.4, 0.3]
        var neckSize = [0.15, 0.15, 0.15];
        var torsoSize = [0.6, 1.0, 0.4];
        
        //skeleton positions
        var torsoPosition = [0.0, -1, 0.0];
//        var neckPosition = [0, torsoSize[1]/2 + neckSize[1]/2, 0];
//        var headPosition = [0, torsoSize[1]/2 + neckSize[1]/2 + headSize[1]/2, 0];
        // y = torso.dim.y 1/2 + 0.1/2 = 0.55
        var neckPosition = [0.0, 0.55, 0.0];

        // y = joint.dim.y 0.1/2 + head.dim.y +0.4/2
        var headPosition = [0.0, 0.25, 0.0];
        
        //torso skeleton and transformations
        this.torso = new SceneNode("torso");
        mat4.translate(this.torso.transformation, torsoPosition);
       
        //neck skeleton and transformations
        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transformation, neckPosition);
        
        //head and transformations
        this.head = new SceneNode("head");
        mat4.translate(this.head.transformation, headPosition);
        
        //build skins and transformations
        var torsoSkin = new SceneNode("torso_skin", [cube], this.programs.vertexColor);
        mat4.scale(torsoSkin.transformation, torsoSize);
        
        var neckSkin = new SceneNode("neck_skin", [wireframe], this.programs.black)
        mat4.scale(neckSkin.transformation, neckSize);
        
        var headSkin = new SceneNode("head_skin", [cube], this.programs.red);
        mat4.scale(headSkin.transformation, headSize);
        mat4.rotate(headSkin.transformation, 0.5*Math.PI, [0,1,0]);
        
        this.result = new SceneNode("robot", [this.torso], this.programs.red);
        mat4.translate(this.result.transformation, [0, 1, 0]);     
        
        //add skins to skeleton
        this.torso.addObjects([torsoSkin]);
        this.neck.addObjects([neckSkin]);
        this.head.addObjects([headSkin]);
        
      //build scenegraph
        this.neck.addObjects([this.head]);
        this.torso.addObjects([this.neck]);
        this.result.addObjects([this.torso]);
        
        //
       
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl, program, transformation) {
    	window.console.log("drawing robot");
    	this.result.draw(gl, program, transformation);
    };
        
    // this module only returns the constructor function    
    return Robot;

})); // define

    
