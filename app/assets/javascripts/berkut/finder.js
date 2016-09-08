/* global Vue, BERKUT */

BERKUT.Finder = function () {
    this._vue = new Vue({
        el: '#finder',
        data: {
            items: []
        }
    })
}
