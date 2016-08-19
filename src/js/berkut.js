var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.playerManager = new BERKUT.PlayerManager()
        this.midiManager = new MidiManager(EventEmitter)
        this.deck = new BERKUT.Deck()
        this.finder = new BERKUT.Finder()

        this.midiManager.deviceList().forEach((device, index) => {
            this.midiManager.enableDevice(index)
        })
        require('fs').readdir('midi', (err, files) => {
            files.forEach(file => {
                try {
                    this.midiManager.addControllerMap(file)
                } catch (e) {
                    console.warn(`${file} is unavailable`)
                }
            })
        })
    })
}
