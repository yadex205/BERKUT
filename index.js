'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const PlayerManager = require('./lib/player_manager')

const BERKUTCore = function () {
    this.events = ipcMain
    this.windows = {
        controller: null
    }
    this.playerManager = new PlayerManager()

    this._init()
}

BERKUTCore.prototype = {
    _init: function () {
        app.on('ready', () => {
            this.__createControllerWindow()
        })
    },
    _events: function () {
        this.events.on('player-manager:create', (event) => {
            const id = this.playerManager.create()
            event.returnValue = id
        });
        ['play', 'pause', 'stop'].forEach((eventNameSuffix) => {
            this.events.on(`player-manager:${eventNameSuffix}`, (event, ...args) => {
                this.playerManager.emit(eventNameSuffix, ...args)
            })
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
