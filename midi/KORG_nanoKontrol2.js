const MidiController = require('../lib/midi/controller')
const Event = require('../lib/event')
const In = Event.In

module.exports = new MidiController({
	in: () => {
		// Deck

		// Blender
		this.onValue(0xBA, 0x01, In.OPACITY_1)
		this.onValue(0xBA, 0x02, In.OPACITY_2)
		this.onValue(0xBA, 0x03, In.OPACITY_3)
		this.onValue(0xBA, 0x04, In.OPACITY_4)
		this.onValue(0xBA, 0x05, In.OPACITY_5)
		this.onValue(0xBA, 0x06, In.OPACITY_6)
	}
})