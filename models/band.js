/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        var segments     = config.segments || 20;
        this.asWireframe = config.asWireframe;
        
        window.console.log("Creating a " + (this.asWireframe? "Wireframe " : "") + 
                            "Band with radius="+radius+", height="+height+", segments="+segments ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];
        
        for(var i = 0; i <= segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
        }; 
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, {"numComponents": 3,
                                                   "dataType": gl.FLOAT,
                                                   "data": coords 
                                                  });
        
        var triangles = [];

        // indices of triangles [0, 1, 2, 2, 1, 3]
        for(var i = 0; i < segments * 2; i += 2){
            triangles.push(i, i + 1, i + 2);
            triangles.push(i + 2, i + 1, i + 3);    
        }
        
        // create vertex buffer object (VBO) for the indices
        this.triangleBuffer = new vbo.Indices(gl, {"indices": triangles});
        
        //lines for wireframe
        var lines = [];

        for(var i=0; i < segments * 2; i += 2){
            lines.push(i, i + 1);
            lines.push(i, i + 2); 
            lines.push(i + 1, i + 3); 
            lines.push(i + 2, i + 3);    
        }
        
        // create vertex buffer object (VBO) for the indices
        this.linesBuffer = new vbo.Indices(gl, {"indices": lines});
    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    	this.coordsBuffer.bind(gl, program, "vertexPosition");
    	//avoid "Z-Fighting"
    	//gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
    	if(this.asWireframe){
    		// bind the attribute buffers
            this.linesBuffer.bind(gl);
            // draw the vertices as points
            gl.drawElements(gl.LINES, this.linesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        }
    	else {
    		// bind the attribute buffers
            this.triangleBuffer.bind(gl);
            // draw the vertices as points
            gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
         }
    	//gl.disable(gl.POLYGON_OFFSET_FILL);
    }; 
    // this module only returns the Band constructor function    
    return Band;
})); // define

    
