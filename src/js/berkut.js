var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.playerManager = new BERKUT.PlayerManager()
        this.midiManager = new MidiManager(EventEmitter)
        this.deck = new BERKUT.Deck()
        this.finder = new BERKUT.Finder()
    })
}
