/* global BERKUT, Vue */

;(function() {
    'use strict'

    const migemo = require('migemo')
    const Path = require('path')

    const Finder = Vue.extend({
        el: () => { return document.querySelector('#berkut-finder') },
        data: () => { return {
            query: '',
            results: [],
            thumbnailCache: []
        } },
        methods: {

        }
    })

    BERKUT.Finder = Finder
})()
