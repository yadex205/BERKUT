BERKUT.Deck.OpacitySlider = function () {
	BERKUT.createSliders('.berkut-layer-opacity-slider', {
		tooltip_position: 'right',
		orientation: 'vertical',
		reversed: true,
		selection: 'after'
	}, (slider, index) => {
		slider.on('slide', (slide) => { this.layers[index].opacity = slide.value })
		EventEmitter.on(BERKUT.Deck.Event.SET_OPACITY, (sliderIndex, opacity) => {
			if (index === sliderIndex) {
				slider.slider('setValue', opacity, true)
			}
		})
	})
}