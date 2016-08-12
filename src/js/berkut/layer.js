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
                    time: 0,
                    duration: 5,
                    _renderer: new I420Renderer(),
                    _frame: null,
                    _seekbar: null,
                    _isSeeking : false
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
        BERKUT.createSliders('.berkut-layer-seekbar', { tooltip: 'hide' }, (slider, index) => {
            this.layers[index]._seekbar = slider
            slider.on('slideStart', () => {
                this.layers[index]._isSeeking = true
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PAUSE, index)
            })
            slider.on('slideStop', () => {
                this.layers[index]._isSeeking = false
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PLAY, index)
            })
            slider.on('change', (event) => {
                EventEmitter.emit(BERKUT.PlayerManager.Event.SEEK_POS, index, event.value.newValue)
            })
        })
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
            EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_SETUP, (playerIndex, width, height, player) => {
                if (playerIndex === index) {
                    renderer.setSize(width, height)
                    this.layers[index].duration = player.duration
                }
            })
            EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_UPDATED, (playerIndex, player, videoFrame) => {
                if (playerIndex === index) {
                    renderer.draw(videoFrame, 'normal', 1.0)
                    this.layers[index]._frame = videoFrame
                    this.layers[index].time = player.time
                    if (!this.layers[index]._isSeeking) {
                        this.layers[index]._seekbar.slider('setValue', player.time / player.length)
                    }
                }
            })
        })
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
                this.preview.clear()
                let layer = null
                for(let i = this.layers.length - 1; i >= 0; i = (i - 1) | 0) {
                    layer = this.layers[i]
                    if (!layer._frame) { continue }
                    this.preview.draw(layer._frame, layer.blend, layer.opacity)
                }
                this.preview.flush()
                this.blendedFrame = this.preview.readPixels(this.blendedFrame)
                requestAnimationFrame(() => {
                    const width = this.preview.canvas.width
                    const height = this.preview.canvas.height
                    this.output.sendFrame(this.blendedFrame, width, height)
                })
            })
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
