/* global BERKUT, ipc */

;(function() {
    const OutputWindow = function() {
        this.isReady = true
    }

    OutputWindow.prototype = {
        sendFrame: function(pixels, width, height) {
            if (this.isReady) {
                ipc.send('berkut-output:updated', pixels, width, height)
            }
        }
    }

    BERKUT.OutputWindow = OutputWindow
})()
