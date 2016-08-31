BERKUT.Stack = function () {
  const SEEKBAR_OPTIONS = {
    min: 0, max: 1, step: 0.01, value: 0, tooltip: 'hide'
  }

  Vue.component('component-layer', Vue.extend({
    template: '#template-layer',
    ready: function () {
      const seekbarFactory = this.$els.seekbarFactory
      $(seekbarFactory).slider(SEEKBAR_OPTIONS)
    }
  }))

  this._vue = new Vue({
    el: '#stack'
  })
}