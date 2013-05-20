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

		 var jointSize = [0.2, 0.1, 0.2];
         var torsoSize = [0.6, 1.0, 0.4];
         var headSize = [0.3, 0.4, 0.3];
         var hatSize = [0.2, 0.2, 0.1];
         var upperArmSize = [0.15, 0.45, 0.15];
         var lowerArmSize = [0.15, 0.45, 0.15];
         var handSize = [0.2, 0.2, 0.1];

         /**
          * POSITIONS
          */

         /** torso / root **/
         var torsoPosition = [0.0, 0, 0.0];

         /** head **/

         //y = torsoSize.y/2 + jointSize.y/2 = 0.55
         var neckPosition = [0.0, 0.55, 0.0];

         // y = joint.dim.y 0.1/2 + head.dim.y +0.4/2
         var headPosition = [0.0, 0.25, 0.0];

         // y = head.dim.y 0.4/2 + hat.dim.y 0.3/2 = 0.35
         var hatPosition = [0.0, 0.30, 0.0];

         /** right arm **/

         // x = torso.dim.x 0.6/2 + 0.1/2 = 0.35
         // y = torso.dim.y 1/2 - 0.2/2 = 0.4
         var rightShoulderPosition = [0.35, 0.4, 0.0];

         // x = joint.dim.x 0.2/2 = 0.1
         var rightUpperArmPosition = [0.2, 0.025, 0.0];

         // x = upperUpperArm.dim.x 0.1/2 + joint.dim.x 0.2/2 = 0.15
         var rightElbowPosition = [0.25, -0.025, 0.0];

         // x = joint.dim.x 0.2/2 + lower arm dim.x 0.15 / 2
         var rightLowerArmPosition = [0.2, 0.025, 0.0];

         // right lower arm dim.x 0.45/2 = 0.225
         var rightWristPosition = [0.225, 0.0, 0.0];

         // joint.dim.y 0.2/2 = 0.1
         var rightHandPosition = [0.0, 0.1, 0.0];

         /** left arm **/

         // x = right -x
         var leftShoulderPosition = [-0.35, 0.4, 0.0];
         var leftUpperArmPosition = [-0.2, 0.025, 0.0];
         var leftElbowPosition = [-0.25, -0.025, 0.0];
         var leftLowerArmPosition = [-0.2, 0.025, 0.0];
         var leftWristPosition = [-0.225, 0.0, 0.0];
         var leftHandPosition = [0.0, -0.1, 0.0];

         /**
          * "BONES"
          */

         // torso
         var torso = new SceneNode("torso");

         // head
         var head = new SceneNode("head");
         var hat = new SceneNode("hat");

         // right arm
         var rightUpperArm = new SceneNode("rightUpperArm");
         var rightLowerArm = new SceneNode("rightLowerArm");
         var rightHand = new SceneNode("rightHand");

         // left arm
         var leftUpperArm = new SceneNode("leftUpperArm");
         var leftLowerArm = new SceneNode("leftLowerArm");
         var leftHand = new SceneNode("leftHand");

         /**
          * "JOINTS"
          */

         // connection torso and head
         var neck = new SceneNode("neck");

         /** right arm **/

         // connection torso and right upper arm
         var rightShoulder = new SceneNode("rightShoulder");

         // connection right upper arm and right lower arm
         var rightElbow = new SceneNode("rightElbow");

         // connection right lower arm and right hand
         var rightWrist = new SceneNode("rightWrist");

         /** left arm **/

         // connection torso and left upper arm
         var leftShoulder = new SceneNode("leftShoulder");

         // connection left upper arm and left lower arm
         var leftElbow = new SceneNode("leftElbow");

         // connection left lower arm and left hand
         var leftWrist = new SceneNode("leftWrist");


             // root
         torso.addObjects([neck, rightShoulder, leftShoulder]);

         // head
         neck.addObjects([head]);
         head.addObjects([hat]);

         // right arm
         rightShoulder.addObjects([rightUpperArm]);
         rightUpperArm.addObjects([rightElbow]);
         rightElbow.addObjects([rightLowerArm]);
         rightLowerArm.addObjects([rightWrist]);
         rightWrist.addObjects([rightHand]);

         // left arm
         leftShoulder.addObjects([leftUpperArm]);
         leftUpperArm.addObjects([leftElbow]);
         leftElbow.addObjects([leftLowerArm]);
         leftLowerArm.addObjects([leftWrist]);
         leftWrist.addObjects([leftHand]);


         /**
          * TRANSOFRMATION "BONES"
          */

             // torso/root
         mat4.translate(torso.transformation, torsoPosition);

         /** head **/

             // neck
         mat4.translate(neck.transformation, neckPosition);

         // head
         mat4.translate(head.transformation, headPosition);

         // hat
         mat4.translate(hat.transformation, hatPosition);

         /** right arm **/

             // right shoulder
         mat4.translate(rightShoulder.transformation, rightShoulderPosition);
         mat4.rotate(rightShoulder.transformation, Math.PI / 2, [0, 0, -1]);

         // right upper arm
         mat4.translate(rightUpperArm.transformation, rightUpperArmPosition);

         // right elbow
         mat4.translate(rightElbow.transformation, rightElbowPosition);

         // right lower arm
         mat4.translate(rightLowerArm.transformation, rightLowerArmPosition);

         // right wrist
         mat4.translate(rightWrist.transformation, rightWristPosition);
         mat4.rotate(rightWrist.transformation, Math.PI / 2, [0, 0, -1]);

         // right hand
         mat4.translate(rightHand.transformation, rightHandPosition);
         mat4.rotate(rightHand.transformation, Math.PI / 2, [0, 0, -1]);

         /** left arm **/

             // left shoulder
         mat4.translate(leftShoulder.transformation, leftShoulderPosition);
         mat4.rotate(leftShoulder.transformation, Math.PI / 2, [0, 0, 1]);

         // left upper arm
         mat4.translate(leftUpperArm.transformation, leftUpperArmPosition);

         // left elbow
         mat4.translate(leftElbow.transformation, leftElbowPosition);

         // left lower arm
         mat4.translate(leftLowerArm.transformation, leftLowerArmPosition);

         // left wrist
         mat4.translate(leftWrist.transformation, leftWristPosition);
         mat4.rotate(leftWrist.transformation, Math.PI / 2, [0, 0, -1]);

         // left hand
         mat4.translate(leftHand.transformation, leftHandPosition);
         mat4.rotate(leftHand.transformation, Math.PI / 2, [0, 0, 1]);

         /**
          * TRANSFORMATIONS "SKINS"
          */

         // joint skin
         //var jointWireframe = new SceneNode("joint wireframe", [bandWireframe], prog_black);
         var joinSkin = new SceneNode("joint skin", [band], this.programs.red);
         mat4.scale(joinSkin.transformation, jointSize);

         // torso skin
         var torsoSkin = new SceneNode("torso skin", [cube], this.programs.vertexColor);
         mat4.scale(torsoSkin.transformation, torsoSize);
         mat4.rotate(torsoSkin.transformation, Math.PI / 2, [0, 0, 1]); // blue front, red top, green sides

         // head skin
         var headSkin = new SceneNode("head skin", [cube], this.programs.vertexColor);
         mat4.scale(headSkin.transformation, headSize);

         // hat skin
         var hatSkin = new SceneNode("hat skin", [triangle], this.programs.vertexColor);
         mat4.scale(hatSkin.transformation, hatSize);

         // upper arm
         var upperArmSkin = new SceneNode("upper arm skin", [cube], this.programs.violet);
         mat4.rotate(upperArmSkin.transformation, Math.PI / 2, [0, 0, 1]);
         mat4.scale(upperArmSkin.transformation, upperArmSize);

         // lower arm
         var lowerArmSkin = new SceneNode("lower arm skin", [cube], this.programs.violet);
         mat4.rotate(lowerArmSkin.transformation, Math.PI / 2, [0, 0, 1]);
         mat4.scale(lowerArmSkin.transformation, lowerArmSize);

         // hand skin
         var handSkin = new SceneNode("hand skin", [triangle], this.programs.red);
         mat4.rotate(handSkin.transformation, Math.PI / 2, [0, 0, 1]);
         mat4.scale(handSkin.transformation, handSize);

         /**
          * "SKINNING"
          */
         torso.addObjects([torsoSkin]);

         // head
         neck.addObjects([joinSkin]);
         head.addObjects([headSkin]);
         hat.addObjects([hatSkin]);

         // right arm
         rightShoulder.addObjects([joinSkin]);
         rightUpperArm.addObjects([upperArmSkin]);
         rightElbow.addObjects([joinSkin]);
         rightLowerArm.addObjects([lowerArmSkin]);
         rightWrist.addObjects([joinSkin]);
         rightHand.addObjects([handSkin]);

         // left arm
         leftShoulder.addObjects([joinSkin]);
         leftUpperArm.addObjects([upperArmSkin]);
         leftElbow.addObjects([joinSkin]);
         leftLowerArm.addObjects([lowerArmSkin]);
         leftWrist.addObjects([joinSkin]);
         leftHand.addObjects([handSkin]);

         /**
          * ADD TO SCENE
          */

         // an entire robot
         this.result = new SceneNode("robot", [torso], this.programs.red);
         mat4.translate(this.result.transformation, [0, -0.3, 0]);

         // the world - this node is needed in the draw() method below!
         
	};

	// draw method: activate buffers and issue WebGL draw() method
	Robot.prototype.draw = function(gl, program, transformation) {
//		window.console.log("drawing robot");
		this.result.draw(gl, program, transformation);
	};

	// this module only returns the constructor function
	return Robot;

})); // define

