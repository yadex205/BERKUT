BERKUT.Deck.Seekbar = function() {
    BERKUT.createSliders(
        '.berkut-layer-seekbar',
        { tooltip: 'hide' },
        (slider, index) => {
            this.layers[index]._seekbar = slider
            slider.on('slideStart', () => {
                this.layers[index]._isSeeking = true
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PAUSE, index)
            })
            slider.on('slideStop', () => {
                this.layers[index]._isSeeking = false
                EventEmitter.emit(BERKUT.PlayerManager.Event.DO_PLAY, index)
            })
            slider.on('change', (event) => {
                EventEmitter.emit(BERKUT.PlayerManager.Event.SEEK_POS, index, event.value.newValue)
            })
        }
    )
}