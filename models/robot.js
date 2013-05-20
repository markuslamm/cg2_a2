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

		// skeleton dimensions
		 var jointSize = [0.2, 1.0, 0.2];
         var torsoSize = [0.6, 1.0, 0.4];
         var headSize = [0.3, 0.4, 0.3];

		// skeleton positions
		var torsoPosition = [ 0.0, 0.0, 0.0 ];
		// y = torsoSize.y/2 + jointSize.y/2 = 0.55
		
		var neckY = torsoSize[1]/2 + jointSize[1]/2;
		window.console.log("neckY: " + neckY);
		var neckPosition = [ 0.5, 0.55 , 0.0 ];

		// y = jointSize.y/2 + head.y/2
		var headPosition = [ 0.75, 0.0, 0.0 ];

		// torso skeleton and transformations
		var torso = new SceneNode("torso");
		mat4.translate(torso.transformation, torsoPosition);

		// neck skeleton and transformations
		var neck = new SceneNode("neck");
		mat4.translate(neck.transformation, neckPosition);

		// head and transformations
		var head = new SceneNode("head");
		mat4.translate(head.transformation, headPosition);

		// build skins and transformations
		var torsoSkin = new SceneNode("torso_skin", [ cube ], this.programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torsoSize);

		var neckSkin = new SceneNode("neck_skin", [ wireframe ], this.programs.black)
		mat4.scale(neckSkin.transformation, jointSize);

		var headSkin = new SceneNode("head_skin", [ cube ], this.programs.vertexColor);
		mat4.scale(headSkin.transformation, headSize);
		mat4.rotate(headSkin.transformation, 0.75 * Math.PI, [ 0, 1, 0 ]);

		this.result = new SceneNode("robot", [ torso ]);
		mat4.translate(this.result.transformation, [ 0, -0.25, 0 ]);

		// add skins to skeleton
		torso.addObjects([ torsoSkin ]);
		neck.addObjects([ neckSkin ]);
		head.addObjects([ headSkin ]);

		// build scenegraph
		neck.addObjects([ head ]);
		torso.addObjects([ neck ]);

		// final robot
		this.result.addObjects([ torso ]);
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
//		window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

