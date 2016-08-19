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
            deck: { a: null, b: null },
            crossfader: 0,
            preview: (() => {
                const renderer = new I420Renderer()
                renderer.bind(document.querySelector('#berkut-output-preview'))
                renderer.setSize(1280, 720)
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
        BERKUT.Deck.setupCrossfader.bind(this)()
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
        selectDeck: function(index, deck) {
            switch (deck) {
                case 'a': this._resetDeckAtLayer(this.deck.a); this.deck.a = index; break;
                case 'b': this._resetDeckAtLayer(this.deck.b); this.deck.b = index; break;
                case 'n':
                    if (this.deck.a === index) { this.deck.a = null }
                    else if (this.deck.b === index) { this.deck.b = null }
                    break
            }
            this.layers[index].switch = deck
        },
        _resetDeckAtLayer(index) {
            if (index === null) { return }
            this.layers[index].switch = 'n'
        },
        _blendLayers: function() {
            this.preview.clear()
            let layer = null
            let opacity = 0
            let xfader = (this.crossfader + 1) / 2
            let abboth = this.deck.a !== null && this.deck.b !== null
            for(let i = this.layers.length - 1; i >= 0; i = (i - 1) | 0) {
                layer = this.layers[i]
                opacity = layer.opacity
                if (!layer._frame) { continue }
                if (layer.switch === 'a' && abboth && this.deck.a < this.deck.b) {
                    opacity = opacity * (1 - xfader)
                } else if (layer.switch === 'b' && abboth && this.deck.a > this.deck.b) {
                    opacity = opacity * xfader
                }
                this.preview.draw(layer._frame, layer.blend, opacity)
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
