/* requireJS module definition */
define([ "util", "vbo", "models/cube", "models/band", "models/triangle", "scene_node" ], (function(Util, vbo, Cube, Band, Triangle,
		SceneNode) {

	"use strict";

	// constructor, takes WebGL context object as argument
	var Robot = function(gl, programs) {
		window.console.log("creating a robot");

		this.programs = programs;

		/* create objects for drawing the roboter */
		var triangle = new Triangle(gl);
		var cube = new Cube(gl);
		var band = new Band(gl,  { radius: 0.5, height: 1.0, segments: 50 });
		var wireframe = new Band(gl, { asWireframe : true
		});

		/* dimensions */
		var torsoSize 	= [0.6, 1.0, 0.4];
		var jointSize 	= [0.1, 0.1, 0.1];
		var headSize 	= [0.3, 0.4, 0.3];
		var upperArmSize = [0.15, 0.4, 0.15];
		var lowerArmSize = [0.15, 0.5, 0.15];

		/* positions */
		var torsoPosition	= [0.0,0.0, 0.0];
		var neckPosition	= [0.0, torsoSize[1]/2 + jointSize[1]/2, 0.0];
		var headPosition	= [0.0, jointSize[1]/2 + headSize[1]/2, 0.0]; 
		var rightShoulderPosition = [torsoSize[0]/2 + jointSize[1]/2, torsoSize[1]/2 - jointSize[0]/2, 0.0];
		var leftShoulderPosition = [-(torsoSize[0]/2 + jointSize[1]/2), torsoSize[1]/2 - jointSize[0]/2, 0.0];
		var leftUpperArmPosition = [-(jointSize[0]/2 + upperArmSize[0]/2), (jointSize[1]/2 - upperArmSize[1]/2), 0];
		var rightUpperArmPosition = [jointSize[0]/2 + upperArmSize[0]/2, (jointSize[1]/2 - upperArmSize[1]/2), 0];
		var leftElbowPosition = [0.0, -(upperArmSize[1]/2 + jointSize[1]/2), 0.0];
		var leftLowerArmPosition = [0, -(jointSize[1]/2 + lowerArmSize[1]/2), 0.0];

		
		
		/* 
		 * creating skeleton objects and set position in scene 
		 */
		var torso = new SceneNode("torso");
		mat4.translate(torso.transformation, torsoPosition);

		var neck = new SceneNode("neck");
		mat4.translate(neck.transformation, neckPosition);
		
		var head = new SceneNode("head");
		mat4.translate(head.transformation, headPosition);
		
		var rightShoulder = new SceneNode("right_shoulder");
		mat4.translate(rightShoulder.transformation, rightShoulderPosition);
		
		var rightUpperArm = new SceneNode("right_upper_arm");
		mat4.translate(rightUpperArm.transformation, rightUpperArmPosition);
		
		var leftShoulder = new SceneNode("left_shoulder");
		mat4.translate(leftShoulder.transformation, leftShoulderPosition);
		
		var leftUpperArm = new SceneNode("left_upper_arm");
		mat4.translate(leftUpperArm.transformation, leftUpperArmPosition);
		
		var leftElbow = new SceneNode("left_elbow");
		mat4.translate(leftElbow.transformation, leftElbowPosition);
		
		var leftLowerArm = new SceneNode("left_lower_arm");
		mat4.translate(leftLowerArm.transformation, leftLowerArmPosition);
		
		/*
		 * creating skins
		 */
		var torsoSkin = new SceneNode("torso skin", [cube], this.programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torsoSize);
		mat4.rotate(torsoSkin.transformation, 1 * Math.PI / 2, [0, 1, 0]); // blue in front, just optional

		var neckSkin = new SceneNode("neck skin", [band], this.programs.black);
		mat4.scale(neckSkin.transformation, jointSize);
		
		var headSkin = new SceneNode("head skin", [cube], this.programs.vertexColor);
		mat4.scale(headSkin.transformation, headSize);
		
		var jointSkin = new SceneNode("joint_skin", [band], this.programs.black);
		mat4.scale(jointSkin.transformation, jointSize);
		mat4.rotate(jointSkin.transformation, Math.PI / 2, [0, 0, -1])
		
		var upperArmSkin = new SceneNode("upperarm_skin", [cube], this.programs.vertexColor);
		mat4.scale(upperArmSkin.transformation, upperArmSize);
		mat4.rotate(upperArmSkin.transformation, Math.PI / 2, [0, 0, -1]);
		
		var lowerArmSkin = new SceneNode("lowerarm_skin", [cube], this.programs.vertexColor);
		mat4.scale(lowerArmSkin.transformation, lowerArmSize);
		mat4.rotate(lowerArmSkin.transformation, Math.PI / 2, [0, 0, -1]);

		/* connect skeleton with skins */
		torso.addObjects([torsoSkin]);
		neck.addObjects([neckSkin]);
		head.addObjects([headSkin]);
		rightShoulder.addObjects([jointSkin]);
		rightUpperArm.addObjects([upperArmSkin]);
		leftShoulder.addObjects([jointSkin]);
		leftUpperArm.addObjects([upperArmSkin]);
		leftElbow.addObjects([jointSkin]);
		leftLowerArm.addObjects([lowerArmSkin]);
		
		/* creating scenegraph */
		neck.addObjects([head]);
		leftElbow.addObjects([leftLowerArm]);
		leftUpperArm.addObjects([leftElbow]);
		leftShoulder.addObjects([leftUpperArm]);
		rightShoulder.addObjects([rightUpperArm]);
		torso.addObjects([neck, rightShoulder, leftShoulder]);

		/* the final robot */
		this.result = new SceneNode("robot", [torso], this.programs.red);
		mat4.translate(this.result.transformation, [ 0, -0.2, 0 ]);
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
		// window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

