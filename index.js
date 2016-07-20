// index.js

const electron = require('electron')

const {app} = electron
const {BrowserWindow}= electron

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1024,
        minWidth: 1024
    })
    mainWindow.loadURL(`file://${__dirname}/htdocs/index.html`)
    app.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    switch(process.platform) {
    case 'darwin': app.quit()
    }
})

app.on('activate', (mainWindow === null) ? createWindow : ()=>{})
