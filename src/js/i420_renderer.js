const I420Texture = function(gl) {
    this.gl = gl
    this.texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

I420Texture.prototype = {
    bind: function(n, program, name) {
        var gl = this.gl
        gl.activeTexture([gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2][n])
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.uniform1i(gl.getUniformLocation(program, name), n)
    },
    fill: function(width, height, data) {
        var gl = this.gl
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data)
    }
}

const I420Renderer = function() {
    this.canvas = null
    this._program = null
}

I420Renderer.prototype = {
    bind: function (canvas, height, width) {
        this.canvas = canvas
        this._setupCanvas()
        this._frameSetup(width, height)
        canvas.addEventListener('webglcontextlost', function(e) { e.preventDefault() }, false)
        canvas.addEventListener('webglcontextrestored', ((w, h) => {
            return () => {
                I420Renderer._setupCanvas(canvas)
                this._frameSetup(w, h)
            }
        })(width, height), false)
    },
    draw: function (i420Frame, blend, opacity) {
        const gl = this.canvas.gl
        if (!blend || !I420Renderer.Blend[blend]) { blend = 'normal' }
        I420Renderer.Blend[blend](gl)
        this._render(i420Frame, opacity)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    flush: function() {
        const gl = this.canvas.gl
        gl.flush()
    },
    clear: function() {
        const gl = this.canvas.gl
        const arr1 = new Uint8Array(1)
        const arr2 = new Uint8Array(1)
        arr1[0] = 0
        arr2[0] = 128
        gl.y.fill(1,1,arr1)
        gl.u.fill(1,1,arr2)
        gl.v.fill(1,1,arr2)
        gl.disable(gl.BLEND)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        gl.enable(gl.BLEND)
    },
    _frameSetup(width, height) {
        const gl = this.canvas.gl
        this.canvas.width = width
        this.canvas.height = height
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    },
    _render: function(videoFrame, opacity) {
        const gl = this.canvas.gl
        gl.uniform1f(gl.getUniformLocation(this._program, 'alpha'), opacity)
        gl.y.fill(videoFrame.width, videoFrame.height,
                  videoFrame.subarray(0, videoFrame.uOffset))
        gl.u.fill(videoFrame.width >> 1, videoFrame.height >> 1,
                  videoFrame.subarray(videoFrame.uOffset, videoFrame.vOffset))
        gl.v.fill(videoFrame.width >> 1, videoFrame.height >> 1,
                  videoFrame.subarray(videoFrame.vOffset, videoFrame.length))
    },
    _setupCanvas: function() {
        this.canvas.gl = this.canvas.getContext('webgl', {
            preserveDrawingBuffer: true
        })

        var gl = this.canvas.gl
        this.canvas.I420Program = gl.createProgram()
        var program = this.canvas.I420Program
        var vertexShaderSource = [
            'attribute highp vec4 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            'varying highp vec2 vTextureCoord;',
            'void main(void) {',
            ' gl_Position = aVertexPosition;',
            ' vTextureCoord = aTextureCoord;',
            '}'
        ].join('\n')
        var vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, vertexShaderSource)
        gl.compileShader(vertexShader)
        var fragmentShaderSource = [
            'precision highp float;',
            'varying lowp vec2 vTextureCoord;',
            'uniform sampler2D YTexture;',
            'uniform sampler2D UTexture;',
            'uniform sampler2D VTexture;',
            'uniform float alpha;',
            'const mat4 YUV2RGB = mat4',
            '(',
            ' 1.1643828125, 0, 1.59602734375, -.87078515625,',
            ' 1.1643828125, -.39176171875, -.81296875, .52959375,',
            ' 1.1643828125, 2.017234375, 0, -1.081390625,',
            ' 0, 0, 0, 1',
            ');',
            'void main(void) {',
            ' gl_FragColor = vec4( texture2D(YTexture, vTextureCoord).x, texture2D(UTexture, vTextureCoord).x, texture2D(VTexture, vTextureCoord).x, 1) * YUV2RGB * vec4(1,1,1,alpha);',
            '}'
        ].join('\n')

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, fragmentShaderSource)
        gl.compileShader(fragmentShader)
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)
        this._program = program
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program))
            console.log(gl.getShaderInfoLog(fragmentShader))
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
                      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]),
                      gl.STATIC_DRAW)
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)
        gl.enable(gl.BLEND)

        gl.y = new I420Texture(gl)
        gl.u = new I420Texture(gl)
        gl.v = new I420Texture(gl)
        gl.y.bind(0, program, 'YTexture')
        gl.u.bind(1, program, 'UTexture')
        gl.v.bind(2, program, 'VTexture')
    }
}

I420Renderer.Blend = {
    normal: function (gl) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.blendEquation(gl.FUNC_ADD)
    },
    add: function (gl) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.blendEquation(gl.FUNC_ADD)
    }
};
