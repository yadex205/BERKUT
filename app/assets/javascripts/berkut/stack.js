BERKUT.Stack = function () {
  Vue.component('component-layer', Vue.extend({
    template: '#template-layer'
  }))

  this._vue = new Vue({
    el: '#stack'
  })
}