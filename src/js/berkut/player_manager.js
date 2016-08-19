/* global BERKUT, EventEmitter */

;(function() {
    'use strict'

    const Event = {
        CREATE:        'berkut-player-manager:create',
        PLAY:          'berkut-player-manager:play',
        PAUSE:         'berkut-player-manager:pause',
        TOGGLE_PAUSE:  'berkut-player-manager:toggle-pause',
        STOP:          'berkut-player-manager:stop',
        DESTROY:       'berkut-player-manager:destroy',
        FRAME_SETUP:   'berkut-player-manager:frame-setup',
        FRAME_UPDATED: 'berkut-player-manager:frame-updated',
        DO_RESET:      'berkut-player-manager:do-reset',
        DO_CREATE:     'berkut-player-manager:do-create',
        DO_PLAY:       'berkut-player-manager:do-play',
        DO_PAUSE:      'berkut-player-manager:do-pause',
        DO_STOP:       'berkut-player-manager:do-stop',
        DO_DESTROY:    'berkut-player-manager:do-destroy',
        SEEK_POS:      'berkut-player-manager:seek-pos',
        SEEK_DIFF:     'berkut-player-manager:seek-diff',
        SET_RATE:      'berkut-player-manager:rate'
    }

    const PlayerManager = function () {
        this._players = []
        EventEmitter.on(Event.DO_RESET, () => {
            this.reset()
            event.returnValue = true
        })
        EventEmitter.on(Event.DO_CREATE, () => {
            this.create()
        })
        EventEmitter.on(Event.DO_PLAY, (index, filepath) => { this.play(index, filepath) })
        EventEmitter.on(Event.DO_PAUSE, (index) => { this.pause(index) })
        EventEmitter.on(Event.DO_STOP, (index) => { this.stop(index) })
        EventEmitter.on(Event.DO_DESTROY, (index) => { this.destroy(index) })
        EventEmitter.on(Event.SEEK_POS, (index, pos) => { this.seek(index, pos) })
        EventEmitter.on(Event.SEEK_DIFF, (index, diff) => { this.seekDiff(index, diff) })
        EventEmitter.on(Event.TOGGLE_PAUSE, (index) => { this.togglePause(index) })
        EventEmitter.on(Event.SET_RATE, (index, rate) => { this.setRate(index, rate) })
    }

    PlayerManager.prototype = {
        create: function() {
            const player = BERKUT.createPlayer()
            const index =  this._players.push(player) - 1
            this._bindCallbacks(index)
        },
        play: function(index, filepath) {
            if (filepath) {
                const prefix = process.platform === 'win32' ? 'file:///' : 'file://'
                this._players[index].play(prefix + filepath.trim())
            } else {
                this._players[index].play()
            }
        },
        pause: function(index) {
            this._players[index].pause()
        },
        togglePause: function(index) {
            this._players[index].togglePause()
        },
        seek: function (index, pos) {
            this._players[index].position = pos
        },
        seekDiff: function (index, diff) {
            this._players[index].time = this._players[index].time + diff
        },
        setRate: function(index, rate) {
            this._players[index].input.rate = rate
        },
        stop: function(index) {
            this._players[index].stop()
        },
        destroy: function(index) {
            this._players[index].stop()
            this._players[index].close()
            EventEmitter.emit(Event.DESTROY, index)
            this._players.splice(index, 1)
            this._rebindAllCallbacks()
        },
        getPlayer: function(index) {
            if (this._players[index]) { return this._players[index] }
        },
        reset: function() {
            for(let i = this._players.length - 1; i >= 0; i--) {
                this.destroy(i)
            }
        },
        _bindCallbacks: function(index) {
            const player = this._players[index]
            player.onPlaying =    () => { EventEmitter.emit(Event.PLAY, index) }
            player.onPaused =     () => { EventEmitter.emit(Event.PAUSE, index) }
            player.onStopped =    () => { EventEmitter.emit(Event.STOP, index) }
            player.onFrameSetup = (width, height, pixelFormat, videoFrame) => {
                EventEmitter.emit(Event.FRAME_SETUP, index, width, height, player)
                EventEmitter.emit(Event.FRAME_UPDATED, index, player, videoFrame)
            }
            player.onFrameReady = (videoFrame) => {
                EventEmitter.emit(
                    Event.FRAME_UPDATED,
                    index,
                    player,
                    videoFrame
                )
            }
        },
        _rebindAllCallbacks: function () {
            for(let i = 0; i < this._players.length; i = (i + 1) | 0) {
                this._bindCallbacks(i)
            }
        }
    }

    BERKUT.PlayerManager = PlayerManager
    BERKUT.PlayerManager.Event = Event
})()
