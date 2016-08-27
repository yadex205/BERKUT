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

    loadModule('jquery', 'jQuery')
    window.$ = window.jQuery
    loadModule('bootstrap')
    loadModule('vue', 'Vue')
}