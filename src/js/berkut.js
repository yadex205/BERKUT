// berkut.js

var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.layers = new BERKUT.Layers()
        this.mixer = new BERKUT.Mixer(this.layers)
        this.finder = new BERKUT.Finder()
    })
}

BERKUT.Layers = Vue.extend({
    el: function () { return '#berkut-deck' },
    data: function () { return {
        layers: new Array(6).fill(null).map(() => { return new BERKUT.Layer() }),
        targetcanvas: $('#blendtest')[0]
    } },
    ready: function () {
        $('div.layer-controller-seekbar input.seekbar').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
        })
        Array.from($('div.opacity-slider input.opacity').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip_position: 'right',
            orientation: 'vertical', reversed: true, selection: 'after'
        })).forEach((slider, index) => {
            slider.on('slide', (slide) => { this.layers[index].opacity = slide.value })
        })
        let canvases = this.getCanvases()
        for (i = 0; i < canvases.length; i++) {
            WebChimera.Renderer.bind(canvases[i], this.layers[i].player, {
                preserveDrawingBuffer: true
            })
        }
    },
    methods: {
        getCanvases: function () {
            return Array.from($('div.berkut-layer canvas.layer-thumbnail'))
        },
        render: function () {
            let ctx = this.targetcanvas.getContext('2d')
            ctx.clearRect(0,0,320,240)
            ctx.globalCompositeOperation = 'lighter'
            let canvases = $('canvas')
            for (i = 0, l = 6; i < l; i = (i + 1) | 0) {
                ctx.drawImage(canvases[i], 0, 0, 320, 240)
            }
        }
    }
})

BERKUT.Layer = function() {
    this.position = 0.0
    this.duration = 5.0
    this.blend = "NORMAL"
    this.mute = false
    this.solo = false
    this.rhythm = false
    this.player = new WebChimera.VlcPlayer(['-vvv'])
    this.opacity = 0

    this.player.mute = true
    this.player.playlist.mode = 2
}

BERKUT.Mixer = function (layerManager) {
    this.renderer = new PIXI.WebGLRenderer(480, 270, {
        preserveDrawingBuffer: true
    })
    $('#blendtest')[0].appendChild(this.renderer.view)
    this.stage = new PIXI.Container()
    this._blendTask = null
    this._layerManager = layerManager
    this.size = { x: 480, y: 270 }

    Array.from(layerManager.getCanvases()).forEach((canvas) => {
        this._addPlayer(canvas)
    })
}

BERKUT.Mixer.prototype = {
    _addPlayer: function (canvas) {
        let quad = new PIXI.Sprite(
            PIXI.Texture.fromCanvas(canvas, PIXI.SCALE_MODES.LINEAR)
        )
        this.stage.addChildAt(quad, 0)
    },
    enable: function () {
        this._blendTask = setInterval(() => {
            requestAnimationFrame(this.__blend.bind(this))
        }, 1000/30)
    },
    disable: function () {
        clearInterval(this._blendTask)
    },
    __blend: function () {
        let i
        let quad
        for (i = 0; i < 6; i = (i + 1) | 0) {
            quad = this.stage.children[i]
            quad.texture.update()
            quad.width = this.size.x
            quad.height = this.size.y
            quad.blendMode = PIXI.BLEND_MODES[this._layerManager.layers[5 - i].blend]
            quad.alpha = this._layerManager.layers[5 - i].opacity
        }
        this.renderer.render(this.stage)
    }
}

BERKUT.Finder = Vue.extend({
    el: () => { return '#berkut-finder' },
    data: () => { return {
        query: '',
        results: []
    } }
})

BERKUT.Finder.Result = function() {
    this.thumbnailTexture = null
    this.name = 'test'
}
