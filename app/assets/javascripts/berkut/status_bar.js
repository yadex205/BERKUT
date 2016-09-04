/* global $, Vue, BERKUT */

BERKUT.StatusBar = function () {
    const OPTIONS = {
        min: 0, max: 100, step: 1, tooltip: 'hide', handle: 'none',
        value: 0, enabled: false
    }

    this._vue = new Vue({
        el: '#status-bar',
        data: {
            _cpuMeter: null,
            _gpuMeter: null
        },
        ready: function () {
            this._cpuMeter = $(this.$els.cpuMeterFactory).slider(OPTIONS)
            this._gpuMeter = $(this.$els.gpuMeterFactory).slider(OPTIONS)
        },
        events: {
            'cpu-load-change': function (load) {
                this._cpuMeter.slider('setValue', load)
            },
            'gpu-load-change': function (load) {
                this._gpuMeter.slider('setValue', load)
            }
        }
    })
}

BERKUT.StatusBar.Event = {
    CPU_LOAD_CHANGE: 'cpu-load-change',
    GPU_LOAD_CHANGE: 'gpu-load-change'
}
