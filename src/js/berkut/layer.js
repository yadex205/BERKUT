/* global Vue, BERKUT, I420Renderer, EventEmitter */

BERKUT.Deck = Vue.extend({
    el: function () { return '#berkut-deck' },
    data: function () {
        return {
            layers: new Array(6).fill(null).map(function() {
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_CREATE)
                return {
                    switch: 'n',
                    mute: false,
                    solo: false,
                    rhythm: false,
                    opacity: 0,
                    blend: 'normal',
                    _renderer: new I420Renderer(),
                    _frame: null
                }
            }),
            output: (() => {
                const renderer = new I420Renderer()
                renderer.bind(document.querySelector('#berkut-output-preview'))
                renderer.setSize(960, 540)
                return renderer
            })(),
            blendTask: null
        }
    },
    ready: function () {
        BERKUT.createSliders('.berkut-layer-seekbar', { tooltip: 'hide' })
        BERKUT.createSliders('.berkut-layer-opacity-slider', {
            tooltip_position: 'right',
            orientation: 'vertical',
            reversed: true,
            selection: 'after'
        }, (slider, index) => {
            slider.on('slide', (slide) => { this.layers[index].opacity = slide.value })
        })
        this.$el.querySelectorAll('.berkut-layer-preview').forEach((view, index) => {
            const renderer = this.layers[index]._renderer
            renderer.bind(view)
            EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_SETUP, (playerIndex, width, height) => {
                if (playerIndex === index) { renderer.setSize(width, height) }
            })
            EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_UPDATED, (playerIndex, time, videoFrame) => {
                if (playerIndex === index) {
                    renderer.draw(videoFrame, 'normal', 1.0)
                    this.layers[index]._frame = videoFrame
                }
            })
        })
        this.blendTask = setInterval(() => { this.blend() }, 1000 / 60)
    },
    methods: {
        play: function(index, filepath) {
            EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PLAY, index, filepath)
        },
        blend: function() {
            requestAnimationFrame(() => {
                this.output.clear()
                let layer = null
                for(let i = this.layers.length - 1; i >= 0; i = (i - 1) | 0) {
                    layer = this.layers[i]
                    if (!layer._frame) { continue }
                    this.output.draw(layer._frame, layer.blend, layer.opacity)
                }
                this.output.flush()
            })
        },
        _dropped: function(index, event) {
            event.stopPropagation()
            event.preventDefault()
            const file = event.dataTransfer.files[0]
            if (!file) { return false }
            this.play(index, `file://${file.path}`)
            return true
        }
    }
})
