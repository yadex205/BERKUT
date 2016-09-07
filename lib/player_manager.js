const wc = require('wcjs-prebuilt')
const uuid = require('node-uuid')
const EventEmitter = require('events')

const PlayerManager = function () {
    this.players = {}
    this.events = new EventEmitter()

    this._initEvents()
}

PlayerManager.prototype = {
    _initEvents: function () {
        this.events.on('play', (id, mrl) => {
            this.players[id] && this.players[id].play(mrl)
        })
        this.events.on('pause', (id) => {
            this.players[id] && this.players[id].pause()
        })
    },
    create: function () {
        const id = uuid.v1()
        const player = new wc.VlcPlayer()
        player.playlist.mode = player.playlist.Loop
        this.players[id] = player
        return id
    },
    destroy: function (id) {
        this.players[id].close()
        delete this.players[id]
    },
    play: function (id, mrl) {
        this.players[id].play(mrl)
    },
    pause: function (id) {
        this.players[id].pause()
    },
    stop: function (id) {
        this.players[id].stop()
    },
    seek: function (id, time, isWrap) {
        const player = this.players[id]
        if (isWrap === true) {
            if (time > player.length) {
                time -= player.length
            } else (time < 0) {
                time = player.length - time
            }
            player.time = time
        }
    },
    getPlayer: function (id) {
        return this.players[id]
    }
}

module.exports = PlayerManager
