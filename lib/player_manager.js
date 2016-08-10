const WebChimera = require('wcjs-prebuilt')
const {ipcMain} = require('electron')

const Event = {
    CREATE:        'berkut-player-manager:create',
    PLAY:          'berkut-player-manager:play',
    PAUSE:         'berkut-player-manager:pause',
    STOP:          'berkut-player-manager:stop',
    DESTROY:       'berkut-player-manager:destroy',
    FRAME_UPDATED: 'berkut-player-manager:frame-updated',
    DO_CREATE:     'berkut-player-manager:do-create',
    DO_PLAY:       'berkut-player-manager:do-play',
    DO_PAUSE:      'berkut-player-manager:do-pause',
    DO_STOP:       'berkut-player-manager:do-stop',
    DO_DESTROY:    'berkut-player-manager:do-destroy'
}

const PlayerManager = function () {
    this._players = []
    this._browserWindows = []
    ipcMain.on(Event.DO_CREATE, (event) => {
        const index = this.create()
        event.sender.send(Event.CREATE, index)
    })
    ipcMain.on(Event.DO_PLAY, (event, index, filepath) => { this.play(index, filepath) })
    ipcMain.on(Event.DO_PAUSE, (event, index) => { this.pause(index) })
    ipcMain.on(Event.DO_STOP, (event, index) => { this.stop(index) })
    ipcMain.on(Event.DO_DESTROY, (event, index) => { this.destroy(index) })
}

PlayerManager.prototype = {
    create: function() {
        const player = new WebChimera.VlcPlayer(['-vvv'])
        player.playlist.mode = player.playlist.Loop
        player.mute = true
        player.pixelFormat = player.I420
        const index =  this._players.push(player) - 1
        this._bindCallbacks(index)
        return index
    },
    registerListenWindow: function(browserWindow) {
        this.browserWindows.push(browserWindow)
    },
    play: function(index, filepath) {
        if (!this._players[index]) { return }
        this._players[index].play(filepath)
    },
    pause: function(index) {
        if (!this._players[index]) { return }
        this._players[index].pause()
    },
    stop: function(index) {
        if (!this._players[index]) { return }
        this._players[index].stop()
    },
    destroy: function(index) {
        if (!this._players[index]) { return }
        this._players[index].close()
        this._emitSingle(Event.DESTROY, index)
        this._players.splice(index, 1)
        this._rebindAllCallbacks()
    },
    getPlayer: function(index) {
        if (this._players[index]) { return this._players[index] }
    },
    _bindCallbacks: function(index) {
        const player = this._players[index]
        player.onPlaying = () => { this._emitSingle(Event.PLAY, index) }
        player.onPaused = () => { this._emitSingle(Event.PAUSE, index) }
        player.onStopped = () => { this._emitSingle(Event.STOP, index) }
        player.onFrameReady = (videoFrame) => { this._emitFrameUpdated(index, videoFrame) }
    },
    _rebindAllCallbacks: function () {
        this.__eachPlayer((player, index) => { this._bindCallbacks(index) })
    },
    _emitSingle: function(channelName, message) {
        this.__eachBrowserWindow((browserWindow) => {
            browserWindow.webContents.send(channelName, message)
        })
    },
    _emitFrameUpdated: function(index, videoFrame) {
        const player = this._players[index]
        this.__eachBrowserWindow((browserWindow) => {
            browserWindow.webContents.send(
                'berkut-player-manager:frame-updated',
                index,
                player.time,
                videoFrame
            )
        })
    },
    __eachPlayer(callback) {
        let i = 0
        for(; i < this._players.length; i = (i + 1) | 0) {
            callback(this._players[i], i)
        }
    },
    __eachBrowserWindow(callback) {
        let i = 0
        for(; i < this._browserWindows.length; i = (i + 1) | 0) {
            callback(this._browserWindows[i])
        }
    }
}

PlayerManager.Event = Event

module.exports = PlayerManager
