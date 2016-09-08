const fs = require('fs')

const Renderer = function (frameType, canvas) {
    this.frameType = frameType || 'i420'
    this.canvas = null
    this._setupGl()

    if(canvas) {
        this.bindCanvas(canvas)
    }
}

Renderer.prototype = {
    bindCanvas: function (canvas) {
        this.canvas = canvas
        this.setSize()
    },
    setSize: function (width = 320, height = 240) {
        const gl = this.canvas.gl
        this.canvas.width = width
        this.canvas.height = height
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    },
    render: function(frame, options) {
        const gl = this.canvas.gl
        Renderer.Render.i420.bind(this)(gl, frame, options)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    flush: function () {
        this.canvas.gl.flush()
    },
    clear: function () {
        this.canvas.gl.clear(this.canvas.gl.COLOR_BUFFER_BIT)
    },
    _setupGl: function () {
        const ctxName = window.WebGL2RenderingContext ? 'webgl2' : 'webgl'
        this.canvas.gl = this.canvas.getContext(ctxName, { preserveDrawingBuffer: true })
        this.canvas.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        Renderer.Bootstrap[this.frameType].bind(this)(this.canvas.gl)
    },
    _createShader: function (type, filepath) {
        const gl = this.canvas.gl
        const shader = gl.createShader(type)
        const source = fs.readFileSync(filepath)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        return shader
    },
    _getLogs: function (program, ...shaders) {
        const gl = this.canvas.gl
        console.log(gl.getProgramInfoLog(program))
        shaders.forEach((shader) => { console.log(gl.getShaderInfoLog(shader)) })
    }
}

Renderer.Bootstrap = {
    i420: function (gl) {
        const program = gl.createProgram()
        gl.program = program
        const vertexShader = this._createShader(gl.VERTEX_SHADER, './shader/i420.vs')
        const fragmentShader = this._createShader(gl.FRAGMENT_SHADER, './shader/i420.fs')
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { this._getLogs(program, vertexShader, fragmentShader) }
        const vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition')
        gl.enableVertexAttribArray(vertexPositionAttribute)
        const textureCoordAttribute = gl.getAttribLocation(program, 'aTextureCoord')
        gl.enableVertexAttribArray(textureCoordAttribute)
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
                      gl.STATIC_DRAW)
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
                      gl.STATIC_DRAW)
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)
        gl.enable(gl.BLEND)
        gl.y = new Texture(gl)
        gl.u = new Texture(gl)
        gl.v = new Texture(gl)
        gl.y.bind(0, program, 'YTexture')
        gl.u.bind(1, program, 'UTexture')
        gl.v.bind(2, program, 'VTexture')
    },
    rgba32: function (gl) {
        const program = gl.createProgram()
        gl.program = program
        const vertexShader = this._createShader(gl.VERTEX_SHADER, './shader/rgba32.vs')
        const fragmentShader = this._createShader(gl.FRAGMENT_SHADER, './shader/rgba32.fs')
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { this._getLogs(program, vertexShader, fragmentShader) }
        const vertexPositionAttribute = gl.getAttribLocation(program, 'aVertexPosition')
        gl.enableVertexAttribArray(vertexPositionAttribute)
        const textureCoordAttribute = gl.getAttribLocation(program, 'aTextureCoord')
        gl.enableVertexAttribArray(textureCoordAttribute)
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array([1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0]),
                      gl.STATIC_DRAW)
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
        gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0]),
                      gl.STATIC_DRAW)
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)
        gl.enable(gl.BLEND)
        gl.texture = new Texture(gl)
        gl.texture.bind(0, program, 'rgbTexture')
    }
}

Renderer.Render = {
    i420: function (gl, frame, options) {
        gl.uniform1f(gl.getUniformLocation(gl.program, 'alpha'), options.opacity || 1.0)
        gl.y.fill(frame.width, frame.height, gl.LUMINANCE,
                  frame.subarray(0, frame.uOffset))
        gl.u.fill(frame.width >> 1, frame.height >> 1, gl.LUMINANCE,
                  frame.subarray(frame.uOffset, frame.vOffset))
        gl.v.fill(frame.width >> 1, frame.height >> 1, gl.LUMINANCE,
                  frame.subarray(frame.vOffset, frame.length))
    },
    rgba32: function (gl, frame, options) {
        const width = options.width || gl.drawingBufferWidth
        const height = options.height || gl.drawingBufferHeight
        gl.texture.fill(width, height, gl.RGBA, frame)
    }
}

const Texture = function (gl) {
    this.gl = gl
    this.texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

Texture.prototype = {
    bind: function(n, program, name) {
        const gl = this.gl
        gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n])
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.uniform1i(gl.getUniformLocation(program, name), n)
    },
    fill: function(width, height, dataType, data) {
        const gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, dataType, width, height, 0, dataType, gl.UNSIGNED_BYTE, data)
    }
}
module.exports = Renderer
