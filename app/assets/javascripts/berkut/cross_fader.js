/* global $, Vue, BERKUT */

BERKUT.CrossFader = function () {
    const OPTIONS = {
        min: -1, max: 1, step: 0.01, value: 0, tooltip: 'hide', handle: 'square'
    }

    this._vue = new Vue({
        el: '#cross-fader',
        data: {
            crossFaderValue: 0.5,
        },
        ready: function () {
            $(this.$els.crossFaderFactory)
                .slider(OPTIONS)
                .on('change', (event) => {
                    this.crossFaderValue = event.value.newValue
                })
        }
    })
}
