/* requireJS module definition */
define([ "util", "vbo", "models/cube", "models/band", "models/triangle", "scene_node" ], (function(Util, vbo, Cube, Band, Triangle,
		SceneNode) {

	"use strict";

	// constructor, takes WebGL context object as argument
	var Robot = function(gl, programs) {
		window.console.log("creating a robot");

		this.programs = programs;

		// create some objects to be used for drawing the roboter
		var triangle = new Triangle(gl);
		var cube = new Cube(gl);
		var band = new Band(gl);
		var wireframe = new Band(gl, { asWireframe : true
		});

		/*
		 * dimensions
		 */
		var torsoSize = [0.6, 1.0, 0.3];
		var headSize = [0.3, 0.35, 0.3];

		/* positions */
		var torsoPosition = [0.0, 0.0, 0.0 ];

		/* create skeleton and set position */
		var torso = new SceneNode("torso");
		mat4.translate(torso.transformation, torsoPosition); // unneccessary?!

		var head = new SceneNode("head");
		var headPosition = [0, torsoSize[1]/2 + headSize[1]/2, 0];
		console.log("head position: " + headPosition)
		mat4.translate(head.transformation, [0.0, headPosition[1], 0]);
		
		/*
		 * skins and transformation
		 */
		var torsoSkin = new SceneNode("torso_skin", [ cube ], this.programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torsoSize);
		
		var headSkin = new SceneNode("head_skin", [cube], this.programs.violet);
		mat4.scale(headSkin.transformation, headSize);
		
		
		/*
		 * connect skeleton and skins
		 */
		torso.addObjects([torsoSkin]);
		head.addObjects([headSkin]);
		
		/*
		 * create scenegraph
		 */
		torso.addObjects(head);
		this.result = new SceneNode("robot", [torso], this.programs.red);
		
		
		/*
		 * the final robot
		 */
		
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
		//window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

