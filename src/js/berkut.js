/* global
 $, Vue
*/

var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.layers = new BERKUT.Layers()
        this.finder = new BERKUT.Finder()
    })
}

BERKUT.Layers = Vue.extend({
    el: function () { return '#berkut-deck' },
    data: function () { return {
        layers: new Array(6).fill(null).map(() => {
            return new BERKUT.Player()
        }),
        blender: new BERKUT.Blender()
    } },
    ready: function () {
        this._registerSlider('.berkut-layer-seekbar', { tooltip: 'hide' })
        this._registerSlider('input.berkut-layer-opacity-slider', {
            tooltip_position: 'right',
            orientation: 'vertical',
            reversed: true,
            selection: 'after'
        }, (slider, index) => {
            slider.on('slide', (slide) => { this.layers[index].opacity = slide.value })
        })
        this.$el.querySelectorAll('.berkut-layer-preview').forEach((view, index) => {
            this.layers[index].bind(view)
        })
        this.layers.forEach((player) => {
            this.blender.addPlayer(player)
        })
        this.blender.bind(document.querySelector('#berkut-output-preview'))
    },
    methods: {
        _registerSlider: function (query, option, callback) {
            option.min = option.min || 0
            option.max = option.max || 1
            option.step = option.step || 0.01
            option.value = option.value || 0

            const sliders = $(query).slider(option)
            Array.from(sliders).forEach((slider, index) => {
                if (callback) { callback(slider, index) }
            })
        }
    }
})

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
