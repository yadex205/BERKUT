// berkut.js

var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.layers = new BERKUT.Layers()
        this.finder = new BERKUT.Finder()
    })
}

BERKUT.Layers = Vue.extend({
    el: function () { return '#berkut-layers-holder' },
    data: function () { return {
        layers: new Array(6).fill(null).map(() => { return new BERKUT.Layer() })
    } },
    ready: function () {
        $('div.layer-controller-seekbar input.seekbar').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
        })
        $('div.opacity-slider input.opacity').slider({
            min: 0, max: 1, step: 0.01, value: 0, tooltip_position: 'right',
            orientation: 'vertical', reversed: true, selection: 'after'
        })
        canvases = $('div.berkut-layer canvas.layer-thumbnail')
        for (i = 0; i < canvases.length; i++) {
            WebChimera.Renderer.bind(canvases[i], this.layers[i].player, {})
        }
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
    this.player = new WebChimera.VlcPlayer(['-vvv'])

    this.player.mute = true
    this.player.playlist.mode = 2
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
