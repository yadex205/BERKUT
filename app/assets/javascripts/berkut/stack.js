/* global $, Vue, ipc, BERKUT */

BERKUT.Stack = function () {
    'use strict'

    const SEEKBAR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
    }
    const OPACITY_SELECTOR_OPTIONS = {
        min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide',
        orientation: 'vertical', selection: 'after', reversed: true
    }

    // TODO: (yadex205) This definition will be move to another script which treats blending
    const BLEND_MODES = {
        NORMAL: { name: 'Normal', short: 'NORM' },
        ADD: { name: 'Add', short: 'ADD' },
        SUBTRACT: { name: 'Subtract', short: 'SUB' }
    }

    const SPEED_ADJUST_MODES = {
        BEAT: 'Beat', RATE: 'Rate', BPM: 'BPM'
    }

    Vue.component('component-layer', Vue.extend({
        template: '#template-layer',
        props: {
            index: Number
        },
        data: function () {
            return {
                blendMode: Object.keys(BLEND_MODES)[0],
                speedAdjustMode: 'RATE',
                speedValue: { BEAT: 4, RATE: 1.0, BPM: 120 },
                lrPosition: 'n',
                displayMode: 'normal',
                deckPosition: 'n',
                _seekbar: null,
                _opacitySelector: null,
                _playerId: null,
                blendModesSet: BLEND_MODES,
                speedAdjustModesSet: SPEED_ADJUST_MODES,
                speedValueMin: { BEAT: 1, RATE: 0, BPM: 1},
                speedValueMax: { BEAT: 64, RATE: 8, BPM: 320 },
                speedValueStep: { BEAT: 1, RATE: 0.01, BPM: 1 },
            }
        },
        ready: function () {
            this._seekbar = $(this.$els.seekbarFactory).slider(SEEKBAR_OPTIONS)
            this._opacitySelector = $(this.$els.opacitySelectorFactory).slider(OPACITY_SELECTOR_OPTIONS)
            this._playerId = ipc.sendSync('player-manager:create')
        },
        events: {
            'deck-position:set': function (deck) {
                this.deckPosition = deck
            }
        },
        methods: {
            switchDeck: function (deck) {
                this.$parent.$emit('deck-position:request', this.index, deck)
            }
        }
    }))

    this._vue = new Vue({
        el: '#stack',
        data: {
            layerSize: 6,
            layerIndexOfDeck: { a: -1, b: -1 }
        },
        events: {
            'deck-position:request': function(index, deck) {
                const decks = this.layerIndexOfDeck
                if (deck === 'n') {
                    if (decks.a === index) { this.layerIndexOfDeck.a = -1 }
                    if (decks.b === index) { this.layerIndexOfDeck.b = -1 }
                    this.$children[index].$emit('deck-position:set', 'n')
                } else {
                    if (decks.a === index) {
                        this.layerIndexOfDeck.a = -1
                        this.$children[index].$emit('deck-position:set', 'n')
                    } else if (decks.b === index) {
                        this.layerIndexOfDeck.b = -1
                        this.$children[index].$emit('deck-position:set', 'n')
                    }
                    if (decks[deck] !== -1) {
                        this.$children[decks[deck]].$emit('deck-position:set', 'n')
                    }
                    this.layerIndexOfDeck[deck] = index
                    this.$children[index].$emit('deck-position:set', deck)
                }
            }
        }
    })
}
