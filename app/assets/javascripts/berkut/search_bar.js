BERKUT.SearchBar = function () {
    this._vue = new Vue({
        el: document.querySelector('#search-bar'),
        data: {
            isFocused: false,
            query: ''
        }
    })
}