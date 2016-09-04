/* global $, Vue, BERKUT */

BERKUT.BPMSelector = function () {
    this._vue = new Vue({
        el: '#bpm-selector',
        data: {
            beat: 1
        }
    })
}
