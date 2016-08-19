BERKUT.Deck.setupCrossfader = function() {
    const slider = $('#berkut-crossfader')
    slider.on('change', (event) => {
        EventEmitter.emit(BERKUT.Deck.Event.CHANGE_CROSSFADER, event.value.newValue)
        this.crossfader = event.value.newValue
    })
    EventEmitter.on(BERKUT.Deck.Event.SET_CROSSFADER, (value) => {
        slider.slider('setValue', value, true, true)
    })
}