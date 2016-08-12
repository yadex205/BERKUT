var BERKUT = function() {
    document.addEventListener('DOMContentLoaded', () => {
        this.playerManager = new BERKUT.PlayerManager()
        this.deck = new BERKUT.Deck()
        this.finder = new BERKUT.Finder()
    })
}
