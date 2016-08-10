'use strict'

const WebChimera = require('wcjs-prebuilt')

const Player = function() {
    WebChimera.VlcPlayer.call(this, ['-vvv'])
    this.playlist.mode = this.playlist.Loop
    this.mute = true
    this.pixelFormat = this.I420

    this.blend = 'normal'
    this.videomute = false
    this.solo = false
    this.rhythm = false
    this.opacity = 0
}

Player.prototype = WebChimera.VlcPlayer.prototype

module.exports = Player
