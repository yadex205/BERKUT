BERKUT.Deck.LayerPreview = function() {
    this.$el.querySelectorAll('.berkut-layer-preview').forEach((view, index) => {
        const renderer
            = this.layers[index]._renderer
        renderer.bind(view)
        EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_SETUP, (playerIndex, width, height, player) => {
            if (playerIndex === index) {
                renderer.setSize(width, height)
                this.layers[index].duration = player.duration
            }
        })
        EventEmitter.on(BERKUT.PlayerManager.Event.FRAME_UPDATED, (playerIndex, player, videoFrame) => {
            if (playerIndex === index) {
                renderer.draw(videoFrame, 'normal', 1.0)
                this.layers[index]._frame = videoFrame
                this.layers[index].time = player.time
                if (!this.layers[index]._isSeeking) {
                    this.layers[index]._seekbar.slider('setValue', player.time / player.length)
                }
            }
        })
    })
    
}