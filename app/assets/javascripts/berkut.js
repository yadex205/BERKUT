const BERKUT = function () {
    'use strict'

    function loadModule(moduleName, defineName) {
        if (!window[defineName]) {
            if (defineName) {
                window[defineName] = require(moduleName)
            } else {
                require(moduleName)
            }
        }
    }

    loadModule('electron', 'electron')
    loadModule('jquery', 'jQuery')
    window.$ = window.jQuery
    loadModule('bootstrap')
    loadModule('bootstrap-slider')
    loadModule('vue', 'Vue')
    loadModule('ref', 'ref')

    window.ipc = window.electron.ipcRenderer
}

BERKUT.prototype = {
    setupControllerWindow: function () {
        new BERKUT.BPMSelector()
        new BERKUT.CrossFader()
        new BERKUT.Finder()
        new BERKUT.OutputPreview()
        new BERKUT.SearchBar()
        new BERKUT.Stack()
        new BERKUT.StatusBar()
    }
}
