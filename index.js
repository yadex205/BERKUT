// index.js

const electron = require('electron')

const {app} = electron
const {BrowserWindow}= electron

let dashboardWindow

function createWindow () {
    dashboardWindow = new BrowserWindow({
        width: 1024,
        minWidth: 1024
    })
    dashboardWindow.loadURL(`file://${__dirname}/htdocs/index.html`)
    app.on('closed', () => {
        dashboardWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    switch(process.platform) {
    case 'darwin': app.quit()
    }
})

app.on('activate', (dashboardWindow === null) ? createWindow : ()=>{})
