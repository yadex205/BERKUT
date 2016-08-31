BERKUT.Stack = function () {
    const SEEKBAR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
    }
    const OPACITY_SELECTOR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide',
        orientation: 'vertical', selection: 'after', reversed: true
    }

    Vue.component('component-layer', Vue.extend({
        template: '#template-layer',
        ready: function () {
            $(this.$els.seekbarFactory).slider(SEEKBAR_OPTIONS)
            $(this.$els.opacitySelectorFactory).slider(OPACITY_SELECTOR_OPTIONS)
        }
    }))

    this._vue = new Vue({
        el: '#stack'
    })
}