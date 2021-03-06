"use strict";

class Plane {

    constructor(gl, nSlices) {
        this.position = [0,0,0];
        this.rotation = [0,0,0];
        this.scale = [1,1,1];
        this.colour = [0.5, 0.5, 0.5];    // grey
        this.matrix = glMatrix.mat4.create();
        this.normalMatrix = glMatrix.mat3.create();

        let lines = [];
        let normals = [];

        for (let i = 0; i <= nSlices; i++) {
            let d = i / nSlices - 0.5;

            // line in the z direction
            lines.push(d, 0, -0.5);
            lines.push(d, 0, 0.5);

            // normals are all straight up
            normals.push(0,1,0);
            normals.push(0,1,0);

            // line in the x direction 
            lines.push(-0.5, 0, d);
            lines.push(0.5, 0, d);

            normals.push(0,1,0);
            normals.push(0,1,0);
        }

        this.nPoints = lines.length / 3;
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);       

        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);       

    }

    render(gl, shader) {

        // set the world matrix
        glMatrix.mat4.identity(this.matrix);
        glMatrix.mat4.translate(this.matrix, this.matrix, this.position);
        glMatrix.mat4.rotateY(this.matrix, this.matrix, this.rotation[1]);  // heading
        glMatrix.mat4.rotateX(this.matrix, this.matrix, this.rotation[0]);  // pitch
        glMatrix.mat4.rotateZ(this.matrix, this.matrix, this.rotation[2]);  // roll
        glMatrix.mat4.scale(this.matrix, this.matrix, this.scale);
        gl.uniformMatrix4fv(shader["u_worldMatrix"], false, this.matrix);
       
        glMatrix.mat3.normalFromMat4(this.normalMatrix, this.matrix);
        gl.uniformMatrix3fv(shader["u_normalMatrix"], false, this.normalMatrix);

        // 1) Set the diffuse material to white
        gl.uniform3fv(shader["u_diffuseMaterial"], new Float32Array(this.colour));

        // Set position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader["a_position"], 3, gl.FLOAT, false, 0, 0);

        // 2) Set normal attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shader["a_normal"], 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, this.nPoints);   

    }
}