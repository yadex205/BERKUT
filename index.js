'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const PlayerManager = require('./lib/player_manager')

const BERKUTCore = function () {
    this.ipc = ipcMain
    this.windows = {
        controller: null
    }
    this.playerManager = new PlayerManager(this)

    this._init()
}

BERKUTCore.prototype = {
    send: function (windowName, channel, ...args) {
        if (!this.windows[windowName]) { return }
        this.windows[windowName].webContents.send(channel, ...args)
    },
    on: function (channel, callback) {
        this.ipc.on(channel, callback)
    },
    _init: function () {
        app.on('ready', () => {
            this.__createControllerWindow()
        })
    },
    __createControllerWindow: function () {
        const win = new BrowserWindow({ width: 864, height: 648 })
        win.loadURL(`file://${__dirname}/htdocs/index.html`)
        win.on('closed', () => { app.quit() })
        this.windows.controller = win
    }
}

new BERKUTCore()
