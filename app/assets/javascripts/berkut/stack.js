/* global $, Vue, BERKUT */

BERKUT.Stack = function () {
    'use strict'

    const SEEKBAR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
    }
    const OPACITY_SELECTOR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide',
        orientation: 'vertical', selection: 'after', reversed: true
    }

    Vue.component('component-layer', Vue.extend({
        template: '#template-layer',
        data: function () {
            return {
                blendMode: 'normal',
                _seekbar: null,
                _opacitySelector: null
            }
        },
        ready: function () {
            this._seekbar = $(this.$els.seekbarFactory).slider(SEEKBAR_OPTIONS)
            this._opacitySelector = $(this.$els.opacitySelectorFactory).slider(OPACITY_SELECTOR_OPTIONS)
        }
    }))

    this._vue = new Vue({
        el: '#stack',
        data: {
            layerSize: 6
        }
    })
}
