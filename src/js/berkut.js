// berkut.js

var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.layers = new BERKUT.Layers()
        this.finder = new BERKUT.Finder()
    })
}

BERKUT.Layers = Vue.extend({
    el: () => { return '#berkut-layers-holder' },
    data: () => { return {
        layers: new Array(6).fill(new BERKUT.Layer())
    } },
    ready: () => {
        $('div.layer-controller-seekbar input.seekbar').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
        })
        $('div.opacity-slider input.opacity').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip_position: 'right',
            orientation: 'vertical', reversed: true, selection: 'after'
        })
    }
})

BERKUT.Layer = function() {
    this.texture = null
    this.position = 0.0
    this.duration = 5.0
    this.blendTechnique = 'normal'
    this.mute = false
    this.solo = false
    this.rhythm = false
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
