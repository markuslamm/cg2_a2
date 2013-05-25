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
		var band = new Band(gl, { radius : 0.5, height : 1.0, segments : 50
		});
		var wireframe = new Band(gl, { asWireframe : true
		});

		/* dimensions */
		var torsoSize = [ 0.6, 1.0, 0.4 ];
		var jointSize = [ 0.1, 0.1, 0.1 ];
		var headSize = [ 0.3, 0.4, 0.3 ];
		var upperArmSize = [ 0.2, 0.4, 0.2 ];
		var lowerArmSize = [ 0.2, 0.3, 0.2 ];
		var handSize = [ 0.2, 0.2, 0.2 ];

		/* positions */
		var torsoPosition = [ 0.0, 0.0, 0.0 ];
		var neckPosition = [ 0.0, torsoSize[1] / 2 + jointSize[1] / 2, 0.0 ];
		var headPosition = [ 0.0, jointSize[1] / 2 + headSize[1] / 2, 0.0 ];

		var leftShoulderPosition = [ -(torsoSize[0] / 2 + jointSize[1] / 2), torsoSize[1] / 2 - jointSize[0] / 2, 0.0 ];
		var leftUpperArmPosition = [ -(jointSize[0] / 2 + upperArmSize[0] / 2), (jointSize[1] / 2 - upperArmSize[1] / 2), 0 ];
		var leftElbowPosition = [ 0.0, -(upperArmSize[1] / 2 + jointSize[1] / 2), 0.0 ];
		var leftLowerArmPosition = [ 0, -(jointSize[1] / 2 + lowerArmSize[1] / 2), 0.0 ];
		var leftWristPosition = [ 0, -(lowerArmSize[1] / 2 + jointSize[1] / 2), 0 ];
		var leftHandPosition = [ 0, -(jointSize[1] / 2 + handSize[1] / 2), 0 ];

		var rightShoulderPosition = [ torsoSize[0] / 2 + jointSize[1] / 2, torsoSize[1] / 2 - jointSize[0] / 2, 0.0 ];
		var rightUpperArmPosition = [ jointSize[0] / 2 + upperArmSize[0] / 2, (jointSize[1] / 2 - upperArmSize[1] / 2), 0 ];
		var rightElbowPosition = [ 0.0, -(upperArmSize[1] / 2 + jointSize[1] / 2), 0.0 ];
		var rightLowerArmPosition = [ 0, -(jointSize[1] / 2 + lowerArmSize[1] / 2), 0.0 ];
		var rightWristPosition = [ 0, -(lowerArmSize[1] / 2 + jointSize[1] / 2), 0 ];
		var rightHandPosition = [ 0, -(jointSize[1] / 2 + handSize[1] / 2), 0 ];

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

		var rightElbow = new SceneNode("right_elbow");
		mat4.translate(rightElbow.transformation, rightElbowPosition);

		var rightLowerArm = new SceneNode("right_lower_arm");
		mat4.translate(rightLowerArm.transformation, rightLowerArmPosition);

		var rightWrist = new SceneNode("right_wrist");
		mat4.translate(rightWrist.transformation, rightWristPosition);

		var rightHand = new SceneNode("right_hand");
		mat4.translate(rightHand.transformation, leftHandPosition);

		var leftShoulder = new SceneNode("left_shoulder");
		mat4.translate(leftShoulder.transformation, leftShoulderPosition);

		var leftUpperArm = new SceneNode("left_upper_arm");
		mat4.translate(leftUpperArm.transformation, leftUpperArmPosition);

		var leftElbow = new SceneNode("left_elbow");
		mat4.translate(leftElbow.transformation, leftElbowPosition);

		var leftLowerArm = new SceneNode("left_lower_arm");
		mat4.translate(leftLowerArm.transformation, leftLowerArmPosition);

		var leftWrist = new SceneNode("left_wrist");
		mat4.translate(leftWrist.transformation, leftWristPosition);

		var leftHand = new SceneNode("left_hand");
		mat4.translate(leftHand.transformation, rightHandPosition);

		/*
		 * creating skins
		 */
		var torsoSkin = new SceneNode("torso skin", [ cube ], this.programs.vertexColor);
		mat4.scale(torsoSkin.transformation, torsoSize);
		mat4.rotate(torsoSkin.transformation, 1 * Math.PI / 2, [ 0, 1, 0 ]); // blue
																				// in
																				// front,
																				// just
																				// optional

		var neckSkin = new SceneNode("neck skin", [ band ], this.programs.black);
		mat4.scale(neckSkin.transformation, jointSize);

		var headSkin = new SceneNode("head skin", [ cube ], this.programs.vertexColor);
		mat4.scale(headSkin.transformation, headSize);

		var shoulderSkin = new SceneNode("shoulder_skin", [ band ], this.programs.black);
		mat4.scale(shoulderSkin.transformation, jointSize);
		mat4.rotate(shoulderSkin.transformation, Math.PI / 2, [ 0, 0, -1 ]);

		var elbowSkin = new SceneNode("elbow_skin", [ band ], this.programs.black);
		mat4.scale(elbowSkin.transformation, jointSize);
		mat4.rotate(elbowSkin.transformation, Math.PI / 2, [ 0, 0, -1 ]);

		var upperArmSkin = new SceneNode("upperarm_skin", [ cube ], this.programs.vertexColor);
		mat4.scale(upperArmSkin.transformation, upperArmSize);

		var lowerArmSkin = new SceneNode("lowerarm_skin", [ cube ], this.programs.vertexColor);
		mat4.scale(lowerArmSkin.transformation, lowerArmSize);

		var wristSkin = new SceneNode("wrist_skin", [ band ], this.programs.black);
		mat4.scale(wristSkin.transformation, jointSize);
		mat4.rotate(wristSkin.transformation, Math.PI / 2, [ 0, 0, -1 ])

		var handSkin = new SceneNode("hand_skin", [ triangle ], this.programs.violet);
		mat4.scale(handSkin.transformation, handSize);
		mat4.rotate(handSkin.transformation, 2 * Math.PI / 2, [ 0, 0, -1 ])

		/* connect skeleton with skins */
		torso.addObjects([ torsoSkin ]);
		neck.addObjects([ neckSkin ]);
		head.addObjects([ headSkin ]);
		rightLowerArm.addObjects([ lowerArmSkin ]);
		rightElbow.addObjects([ elbowSkin ]);
		rightUpperArm.addObjects([ upperArmSkin ]);
		rightShoulder.addObjects([ shoulderSkin ]);
		rightWrist.addObjects([ wristSkin ]);
		rightHand.addObjects([ handSkin ]);

		leftShoulder.addObjects([ shoulderSkin ]);
		leftUpperArm.addObjects([ upperArmSkin ]);
		leftElbow.addObjects([ elbowSkin ]);
		leftLowerArm.addObjects([ lowerArmSkin ]);
		leftWrist.addObjects([ wristSkin ]);
		leftHand.addObjects([ handSkin ]);

		/* creating scenegraph */
		neck.addObjects([ head ]);

		leftWrist.addObjects([ leftHand ]);
		leftLowerArm.addObjects([ leftWrist ]);
		leftElbow.addObjects([ leftLowerArm ]);
		leftUpperArm.addObjects([ leftElbow ]);
		leftShoulder.addObjects([ leftUpperArm ]);

		rightWrist.addObjects([ rightHand ]);
		rightLowerArm.addObjects([ rightWrist ]);
		rightElbow.addObjects([ rightLowerArm ]);
		rightUpperArm.addObjects([ rightElbow ]);
		rightShoulder.addObjects([ rightUpperArm ]);

		torso.addObjects([ neck, rightShoulder, leftShoulder ]);

		/* the final robot */
		this.result = new SceneNode("robot", [torso], this.programs.red);
		mat4.translate(this.result.transformation, [0, -0.2, 0]);

		this.rotateJoint = function(joint, angle) {
			//console.log("this.rotatejoint(" + joint + "," + angle + ")");
			var radians = angle*Math.PI/180;
			switch (joint) {
				case "headX":
					mat4.rotate(neck.transformation, radians, [1, 0, 0])
					break;
				case "headY":
					mat4.rotate(neck.transformation, radians, [0, 1, 0])
					break;
				case "leftShoulderX":
					mat4.rotate(leftShoulder.transformation, radians, [1, 0, 0])
					break;
				case "leftShoulderZ":
					mat4.rotate(leftShoulder.transformation, radians, [0, 0, 1])
					break;
				case "leftElbowX":
					mat4.rotate(leftElbow.transformation, radians, [1, 0, 0])
					break;
				case "leftWristX":
					mat4.rotate(leftWrist.transformation, radians, [1, 0, 0])
					break;
				case "leftWristY":
					mat4.rotate(leftWrist.transformation, radians, [0, 1, 0])
					break;
				case "rightShoulderX":
					mat4.rotate(rightShoulder.transformation, radians, [1, 0, 0])
					break;
				case "rightShoulderZ":
					mat4.rotate(rightShoulder.transformation, radians, [0, 0, 1])
					break;
				case "rightElbowX":
					mat4.rotate(rightElbow.transformation, radians, [1, 0, 0])
					break;
				case "rightWristX":
					mat4.rotate(rightWrist.transformation, radians, [1, 0, 0])
					break;
				case "rightWristY":
					mat4.rotate(rightWrist.transformation, radians, [0, 1, 0])
					break;
				default:
					window.console.log("joint " + rotationAxis + " not implemented.");
					break;
			}
		};
	};
	
	Robot.prototype.rotate = function(joint, angle) {
		//window.console.log("Robot.prototype.rotate()");
		this.rotateJoint(joint, angle);
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
		// window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

