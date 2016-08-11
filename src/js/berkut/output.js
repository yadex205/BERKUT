/* global BERKUT */

;(function() {
    'use strict'

    const Output = function(el) {
        this.canvas = el
        this.gl = null
        this.texture = null

        this._setupCanvas()
        this.setSize(480, 270)
    }

    Output.prototype = {
        setSize: function(width, height) {
            const gl = this.gl
            const canvas = this.canvas

            canvas.width = width
            canvas.height = height
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        },
        clear: function() {
            this.canvas.gl.clear(this.canvas.gl.COLOR_BUFFER_BIT)
        },
        draw: function(pixels, w, h) {
            const gl = this.gl
            const width = w || gl.drawingBufferWidth
            const height = h || gl.drawingBufferHeight
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels
            )
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            gl.flush()
        },
        _setupCanvas: function() {
            const gl = this.__initGl()
            this._program = this.__createProgram(gl)
            this._texture = this.__bindTexture(gl, this._program)
            this.gl = gl
        },
        __initGl: function() {
            const gl = this.canvas.getContext('webgl2')
            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            return gl
        },
        __createProgram: function(gl) {
            const program = gl.createProgram()
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)
            gl.shaderSource(
                vertexShader,
                `
attribute highp vec4 aVertexPosition;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
void main(void) {
  gl_Position = aVertexPosition;
  vTextureCoord = aTextureCoord;
}`
            )
            gl.compileShader(vertexShader)

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(
                fragmentShader,
                `
precision highp float;
varying lowp vec2 vTextureCoord;
uniform sampler2D rgbTexture;
void main(void) {
  gl_FragColor = texture2D(rgbTexture, vTextureCoord);
}`
            )
            gl.compileShader(fragmentShader)

            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)

            gl.linkProgram(program)
            gl.useProgram(program)

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error(gl.getProgramInfoLog(program))
                console.error(gl.getShaderInfoLog(vertexShader))
                console.error(gl.getShaderInfoLog(fragmentShader))
                return
            }

            var vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition')
            gl.enableVertexAttribArray(vertexPositionAttribute)
            var textureCoordAttribute = gl.getAttribLocation(program, 'aTextureCoord')
            gl.enableVertexAttribArray(textureCoordAttribute)

            var verticesBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,
                          new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
                          gl.STATIC_DRAW)
            gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
            var texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,
                          new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]),
                          gl.STATIC_DRAW)
            gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

            return program
        },
        __bindTexture: function(gl, program) {
            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.uniform1i(gl.getUniformLocation(program, 'rgbTexture'), 0)
            return texture
        }
    }

    BERKUT.Output = Output
})();
