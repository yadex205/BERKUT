/* global Vue, BERKUT */

BERKUT.OutputPreview = function () {
    this._vue = new Vue({
        el: '#output-preview',
        data: {
            fps: 0
        }
    })
}
