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
        this.players[id] = new wc.VlcPlayer()
        return id
    },
    destroy: function (id) {
        this.players[id].close()
        delete this.players[id]
    },
    getPlayer: function (id) {
        return this.players[id]
    }
}

module.exports = PlayerManager
