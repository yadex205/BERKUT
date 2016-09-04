'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let controllerWindow

app.on('ready', () => {
    controllerWindow = new BrowserWindow({
        width: 864,
        height: 648
    })
    controllerWindow.loadURL(`file://${__dirname}/htdocs/index.html`)
    controllerWindow.on('closed', () => { app.quit() })
})
