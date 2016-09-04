/* global $, Vue, BERKUT */

BERKUT.StatusBar = function () {
    const OPTIONS = {
        min: 0, max: 100, step: 1, tooltip: 'hide', handle: 'none',
        value: 0, enabled: false
    }

    this._vue = new Vue({
        el: '#status-bar',
        ready: function () {
            $(this.$els.cpuMeterFactory).slider(OPTIONS)
            $(this.$els.gpuMeterFactory).slider(OPTIONS)
        }
    })
}
