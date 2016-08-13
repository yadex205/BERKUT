const MidiController = require('../lib/midi/controller')
const Event = require('../lib/event')
const In = Event.In

module.exports = new MidiController({
	in: () => {
		// Browser
		this.on(0xB6, 0x40, (value) => {
			if (value <= 30) { this.emit(In.SELECT_MEDIA_FWD, value) }
			else { this.emit(In.SELECT_MEDIA_REV, 128 - value)}
		})
		this.on(0xB6, 0x64, (value) => {
			if (value <= 30) { this.emit(In.SELECT_LAYER_FWD, value) }
			else { this.emit(In.SELECT_LAYER_REV, 128 - value) }
		})
		this.onMax(0x96, 0x46, In.LOAD_MEDIA_A)
		this.onMax(0x96, 0x58, In.SELECT_LAYER_A)
		this.onMax(0x96, 0x47, In.LOAD_MEDIA_A)
		this.onMax(0x96, 0x98, In.SELECT_LAYER_B)

		// Deck
		this.onMax(0x90, 0x0B, In.PLAY_PAUSE_A)
		this.onMax(0x91, 0x0B, In.PLAY_PAUSE_B)
		this.onMax(0x90, 0x0C, In.CUE_A)
		this.onMax(0x91, 0x0C, In.CUE_B)
		this.on(0xB0, 0x21, (value) => {
			if (value > 64) { this.emit(In.JOG_ROTATE_FWD_A, value - 64) }
			else { this.emit(In.JOG_ROTATE_REV_A, 64 - value) }
		})
		this.on(0xB1, 0x21, (value) => {
			if (value > 64) { this.emit(In.JOG_ROTATE_FWD_B, value - 64) }
			else { this.emit(In.JOG_ROTATE_REV_B, 64 - value) }
		})
		this.on(0xB0, 0x22, (value) => {
			if (value > 64) { this.emit(In.JOG_ROTATE_FWD_A, value - 64) }
			else { this.emit(In.JOG_ROTATE_REV_A, 64 - value) }
		})
		this.on(0xB1, 0x22, (value) => {
			if (value > 64) { this.emit(In.JOG_ROTATE_FWD_B, value - 64) }
			else { this.emit(In.JOG_ROTATE_REV_B, 64 - value) }
		})
		this.on(0xB0, 0x1F, (value) => {
			if (value > 64) { this.emit(In.JOG_SEARCH_FWD_A, value - 64) }
			else { this.emit(In.JOG_SEARCH_REV_A, 64 - value) }
		})
		this.on(0xB1, 0x1F, (value) => {
			if (value > 64) { this.emit(In.JOG_SEARCH_FWD_B, value - 64) }
			else { this.emit(In.JOG_SEARCH_REV_B, 64 - value) }
		})
		this.on(0xB0, 0x26, (value) => {
			if (value > 64) { this.emit(In.JOG_SEARCH_FWD_A, value - 64) }
			else { this.emit(In.JOG_SEARCH_REV_A, 64 - value) }
		})
		this.on(0xB1, 0x26, (value) => {
			if (value > 64) { this.emit(In.JOG_SEARCH_FWD_B, value - 64) }
			else { this.emit(In.JOG_SEARCH_REV_B, 64 - value) }
		})
		this.onMax(0xB0, 0x36, In.PAUSE_A)
		this.onZero(0xB0, 0x36, In.PLAY_A)
		this.onMax(0xB1, 0x36, In.PAUSE_B)
		this.onZero(0xB1, 0x36, In.PLAY_B)
		this.onValue(0xB0, 0x00, this.emit(In.SPEED_A))
		this.onValue(0xB1, 0x00, this.emit(In.SPEED_B))

		// Blender
		this.onValue(0xB6, 0x1F, this.emit(In.CROSSFADER))
		this.onValue(0xB0, 0x13, this.emit(In.OPACITY_A))
		this.onValue(0xB1, 0x13, this.emit(In.OPACITY_B))
	}
})