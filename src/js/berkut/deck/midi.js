BERKUT.Deck.Midi = function() {
    const MidiEvent = require('../lib/midi/event').In
    const PlayerEvent = BERKUT.PlayerManager.Event
    const DeckEvent = BERKUT.Deck.Event

    const jogDiff = 60.0 / (35 * 720) * 1000

    const register = function (midiEventName, callback) {
        EventEmitter.on(
            MidiEvent[midiEventName],
            callback
        )
    }

    register('JOG_ROTATE_REV_A', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(PlayerEvent.SEEK_DIFF, this.deck.a, -1.0 * value * jogDiff)
        }
    })

    register('JOG_ROTATE_FWD_A', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(PlayerEvent.SEEK_DIFF, this.deck.a, 1.5 * value * jogDiff)
        }
    })

    register('JOG_ROTATE_REV_B', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(PlayerEvent.SEEK_DIFF, this.deck.b, -1.0 * value * jogDiff)
        }
    })

    register('JOG_ROTATE_FWD_B', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(PlayerEvent.SEEK_DIFF, this.deck.b, 1.5 * value * jogDiff)
        }
    })

    register('PLAY_A', () => {
        if (this.deck.a !== null) { EventEmitter.emit(PlayerEvent.DO_PLAY, this.deck.a) }
    })

    register('PAUSE_A', () => {
        if (this.deck.a !== null) { EventEmitter.emit(PlayerEvent.DO_PAUSE, this.deck.a) }
    })

    register('PLAY_B', () => {
        if (this.deck.b !== null) { EventEmitter.emit(PlayerEvent.DO_PLAY, this.deck.b) }
    })

    register('PAUSE_B', () => {
        if (this.deck.b !== null) { EventEmitter.emit(PlayerEvent.DO_PAUSE, this.deck.b) }
    })

    register('PLAY_PAUSE_A', () => {
        if (this.deck.a !== null) { EventEmitter.emit(PlayerEvent.TOGGLE_PAUSE, this.deck.a)}
    })

    register('PLAY_PAUSE_B', () => {
        if (this.deck.b !== null) { EventEmitter.emit(PlayerEvent.TOGGLE_PAUSE, this.deck.b)}
    })

    register('OPACITY_1', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 0, value / 127.0)
    })

    register('OPACITY_2', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 1, value / 127.0)
    })

    register('OPACITY_3', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 2, value / 127.0)
    })

    register('OPACITY_4', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 3, value / 127.0)
    })

    register('OPACITY_5', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 4, value / 127.0)
    })

    register('OPACITY_6', (value) => {
        EventEmitter.emit(DeckEvent.SET_OPACITY, 5, value / 127.0)
    })

    register('OPACITY_A', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(DeckEvent.SET_OPACITY, this.deck.a, value / 127.0)
        }
    })

    register('OPACITY_B', (value) => {
        if (this.deck.b !== null) {
            EventEmitter.emit(DeckEvent.SET_OPACITY, this.deck.b, value / 127.0)
        }
    })

    register('SPEED_A', (value) => {
        if (this.deck.a !== null) {
            EventEmitter.emit(PlayerEvent.SET_RATE, this.deck.a, Math.max(0.3, value / 127 * 2))
        }
    })

    register('SPEED_B', (value) => {
        if (this.deck.b !== null) {
            EventEmitter.emit(PlayerEvent.SET_RATE, this.deck.b, Math.max(0.3, value / 127 * 2))
        }
    })

    register('CROSSFADER', (value) => {
        EventEmitter.emit(BERKUT.Deck.Event.SET_CROSSFADER, (value / 127.0 - 0.5) * 2)
    })
}