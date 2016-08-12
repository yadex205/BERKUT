/* global BERKUT, Vue */

;(function() {
    'use strict'

    const migemo = require('migemo')
    const Path = require('path')
    const crawl = require('../lib/crawl')

    const Finder = Vue.extend({
        el: () => { return document.querySelector('#berkut-finder') },
        data: () => { return {
            query: '',
            results: [],
            _thumbnailCache: [],
            _cache: []
        } },
        watch: {
            'query': function(val, prevVal) {

            }
        },
        ready: function() {
            this.crawl()
        },
        methods: {
            crawl: function() {
                crawl((files) => {
                    this._cache = files
                    console.log(files)
                })
            }
        }
    })

    BERKUT.Finder = Finder
})()
