BERKUT.Deck.Midi = function() {
	const MidiEvent = require('../lib/midi/event').In
	const PlayerEvent = BERKUT.PlayerManager.Event

	const register = function (midiEventName, callback) {
		EventEmitter.on(
			MidiEvent[midiEventName],
			callback
		)
	}

	register('PLAY_A', () => {
		EventEmitter.emit(PlayerEvent.DO_PLAY, 0)
	})

	register('PAUSE_A', () => {
		EventEmitter.emit(PlayerEvent.DO_PAUSE, 0)
	})
}