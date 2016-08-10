/* global BERKUT, WebChimera */

BERKUT.createPlayer = function() {
    const player = new WebChimera.VlcPlayer()

    player.mute = true
    player.pixelFormat = player.I420
    player.playlist.mode = player.playlist.Loop

    return player
}
