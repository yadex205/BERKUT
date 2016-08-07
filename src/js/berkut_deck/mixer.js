/* global
 BERKUT
 */

(function() {
    'use strict'

    const PIXI = require('pixi.js')

    function Mixer() {
        this._players = []
        this._pixiRenderer = new PIXI.WebGLRenderer(640, 480, {
            preserveDrawingBuffer: true,
            view: document.querySelector('#berkut-output-preview')
        })
        this._pixiContainer = new PIXI.Container()
        this._mixerTask = null
    }

    Mixer.prototype = {
        registerPlayer: function(player) {
            this._pixiContainer.addChildAt(new PIXI.Sprite(
                PIXI.Texture.fromCanvas(player.view, PIXI.SCALE_MODES.NEAREST)
            ), 0)
            this._players.unshift(player)
        },
        setView: function(view) {
            this._pixiRenderer.view = view
        },
        blend: function () {
            let i = 0
            let quad = null
            let player = null
            let size = this._pixiContainer.children.length
            for (; i < size; i = (i + 1) | 0) {
                quad = this._pixiContainer.children[i]
                player = this._players[i]
                quad.texture.update()
                quad.width = 640
                quad.height = 480
                quad.blendMode = PIXI.BLEND_MODES[player.blend]
                quad.alpha = player.opacity
            }
            this._pixiRenderer.render(this._pixiContainer)
        },
        start: function() {
            if (this._mixerTask) { this.stop() }
            this._mixerTask = setInterval(() => {
                requestAnimationFrame(this.blend.bind(this))
            }, 1000 / 60)
        },
        stop: function() {
            clearInterval(this._mixerTask)
            this._mixTask = null
        }
    }

    BERKUT.Mixer = Mixer
}());
