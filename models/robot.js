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
		var band = new Band(gl,  { radius: 0.5, height: 1.0, segments: 50 });
		var wireframe = new Band(gl, { asWireframe : true
		});

		/* dimensions */
		var torsoSize = [ 0.6, 1.0, 0.4 ];
		var jointSize = [ 0.2, 0.1, 0.2 ];
		var headSize = [ 0.3, 0.4, 0.3 ];

		var torsoPosition = [ 0.0, 0, 0.0 ];
		// y = torsoSize.y/2 + jointSize.y/2 = 0.55
		var neckPosition = [ 0.0, 0.55, 0.0 ];

		// y = joint.dim.y 0.1/2 + head.dim.y +0.4/2
		var headPosition = [ 0.0, 0.25, 0.0 ];

		var torso = new SceneNode("torso");

		var neck = new SceneNode("neck");

		// torso skin
		var torsoSkin = new SceneNode("torso skin", [ cube ], this.programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torsoSize);
		mat4.rotate(torsoSkin.transformation, 1 * Math.PI / 2, [ 0, 1, 0 ]); // blue
		// front,
		// red
		// top,
		// green
		// sides

		var joinSkin = new SceneNode("joint skin", [ band ], this.programs.red);
		mat4.scale(joinSkin.transformation, jointSize);

		mat4.translate(neck.transformation, neckPosition);
		mat4.translate(torso.transformation, torsoPosition);

		torso.addObjects([ torsoSkin ]);
		neck.addObjects([ joinSkin ]);

		torso.addObjects([ neck ]);

		// the final robot
		this.result = new SceneNode("robot", [ torso ], this.programs.red);
		mat4.translate(this.result.transformation, [ 0, 0, 0 ]);
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
		// window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

