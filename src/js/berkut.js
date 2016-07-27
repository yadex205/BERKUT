// berkut.js

var BERKUT = function() {
    this._bindingRoot = new Vue({
        el: 'body'
    })

    this._layers = new Vue({
        el: '#berkut-layers-holder',
        data: {
            layers: new Array(6)
        }
    })
}
