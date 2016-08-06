/* global
 BERKUT
*/

(function() {
    'use strict'

    const WebChimera = require('wcjs-prebuilt')
    WebChimera.Renderer = require('wcjs-renderer')

    function Player(view) {
        this._player = null

        this.view = view
        this.blend = 'NORMAL'
        this.mute = false
        this.solo = false
        this.rhythm = false
        this.opacity = false
    }

    Player.prototype = {
        bind: function(view) {
            const player = new WebChimera.VlcPlayer(['-vvv'])
            player.playlist.mode = 2 // Turn on loop playing
            player.mute = true // Mute audio
            WebChimera.Renderer.bind(view, player, {
                preserveDrawingBuffer: true
            })
            this._player = player
        },
        play: function(filepath) {
            if (!this.isBound()) { return }
            this._player.play(filepath)
        },
        pause: function() {
            if (!this.isBound()) { return }
            this._player.pause()
        },
        stop: function() {
            if (!this.isBound()) { return }
            this._player.stop()
            WebChimera.Renderer.clear(this.view)
        },
        destroy: function () {
            if (!this.isBound()) { return }
            this._player.close()
            this._player = null
            WebChimera.Renderer.clear(this.view)
        },
        duration: function() {
            if (!this.isBound()) { return }
            return this._player.length / 1000
        },
        position: function() {
            if (!this.isBound()) { return }
            return this._player.time / 1000
        },
        positionRatio: function() {
            if (!this.isBound()) { return }
            return this.position
        },
        isBound: function() {
            return this._player !== null || this._player !== undefined
        }
    }

    BERKUT.Player = Player
}())
