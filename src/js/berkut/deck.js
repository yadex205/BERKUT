/* global Vue, BERKUT, I420Renderer, EventEmitter */

BERKUT.Deck = Vue.extend({
    el: function () { return '#berkut-deck' },
    data: function () {
        return {
            layers: new Array(6).fill(null).map(function() {
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_CREATE)
                return {
                    switch: 'n', mute: false, solo: false, rhythm: false,
                    opacity: 0, blend: 'normal',
                    time: 0, duration: 5,
                    _renderer: new I420Renderer(),
                    _frame: null, _seekbar: null, _isSeeking : false,
                    deckA: -1, deckB: -1
                }
            }),
            preview: (() => {
                const renderer = new I420Renderer()
                renderer.bind(document.querySelector('#berkut-output-preview'))
                renderer.setSize(480, 270)
                return renderer
            })(),
            output: new BERKUT.OutputWindow(),
            blendTask: null,
            blendedFrame: null
        }
    },
    ready: function () {
        BERKUT.Deck.Seekbar.bind(this)()
        BERKUT.Deck.OpacitySlider.bind(this)()
        BERKUT.Deck.LayerPreview.bind(this)()
        BERKUT.Deck.Midi.bind(this)()
        this.blendTask = setInterval(() => { this.blend() }, 1000 / 30)
    },
    watch: {
        
    },
    methods: {
        play: function (index, filepath) {
            EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PLAY, index, filepath)
        },
        blend: function() {
            requestAnimationFrame(() => {
                this._blendLayers()
                this._sendToOutput()
            })
        },
        _blendLayers: function() {
            this.preview.clear()
            let layer = null
            for(let i = this.layers.length - 1; i >= 0; i = (i - 1) | 0) {
                layer = this.layers[i]
                if (!layer._frame) { continue }
                this.preview.draw(layer._frame, layer.blend, layer.opacity)
            }
            this.preview.flush()
            this.blendedFrame = this.preview.readPixels(this.blendedFrame)
        },
        _sendToOutput: function () {
            const width = this.preview.canvas.width
            const height = this.preview.canvas.height
            this.output.sendFrame(this.blendedFrame, width, height)
        },
        _dropped: function(index, event) {
            event.stopPropagation()
            event.preventDefault()
            let file
            if (event.dataTransfer.files.length > 0) {
                file = event.dataTransfer.files[0].path
            } else {
                file = event.dataTransfer.getData('text/plain')
            }
            if (!file) { return false }
            this.play(index, file)
            return true
        }
    }
})
