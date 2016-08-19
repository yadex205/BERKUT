/* global BERKUT, ipc */

;(function() {
    const OutputWindow = function() {
        this.isReady = true
    }

    OutputWindow.prototype = {
        sendFrame: function(pixels, width, height) {
            const address = Buffer.from(pixels.buffer).address()
            if (this.isReady) {
                const pid = process.pid
                ipc.send('berkut-output:updated', pid, address, width, height)
            }
        }
    }

    BERKUT.OutputWindow = OutputWindow
})()
