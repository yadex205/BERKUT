/* global
 BERKUT, I420Renderer
*/

(function() {
    'use strict'

    var Blender = function() {
        this.view = null
        this._renderer = null
        this._players = []
        this._blendTask = null
    }

    Blender.prototype = {
        bind: function(view) {
            this._renderer = new I420Renderer()
            this._renderer.bind(view, 480, 640)
        },
        addPlayer: function(player) {
            this._players.unshift(player)
        },
        enable: function() {
            this._blendTask = setInterval(() => {
                requestAnimationFrame(() => {
                    this._renderer.clear()
                    let i = 0
                    let player = null
                    let frame = null
                    let state = 0
                    for(;i < this._players.length; i = (i + 1) | 0) {
                        player = this._players[i]
                        frame = player.getVideoFrame()
                        state = player.getState()
                        if (!frame || !(state === 3 || state === 4)) { continue }
                        this._renderer.draw(player.getVideoFrame(), 'normal', player.opacity)
                    }
                    this._renderer.flush()
                })
            }, 1000 / 60)
        }
    }

    BERKUT.Blender = Blender
})();
