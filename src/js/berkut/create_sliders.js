/* global $, BERKUT */

BERKUT.createSliders = function(query, opt, callback) {
    'use strict'

    opt.min = opt.min || 0
    opt.max = opt.max || 1
    opt.step = opt.step || 0.01
    opt.value = opt.value || 0


    const sliders = $(query).slider(opt)

    Array.from(sliders).forEach(function (slider, index) {
        if (callback) { callback(slider, index) }
    })
}
