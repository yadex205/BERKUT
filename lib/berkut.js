// lib/berkut.js

const WebChimera = require('wcjs-prebuilt')

module.exports = function (renderCanvas) {
	this.mixer = new Mixer(renderCanvas)
}

var Mixer = function (canvas) {
	this.players = []
	this.length = 0
	this.canvas = canvas
	this.renderContext = require('webgl-video-renderer').setupCanvas(this.canvas)
	this.gl = this.renderContext.gl
	this.gl.blendFunc(this.gl.ONE, this.gl.ONE)
}

Mixer.prototype = {
	addPlayer: function (player) {
		this.players.push(player)
		this.length = this.players.length
		let originalFunc = player.onFrameReady
		player.onFrameReady = (frame) => {
			originalFunc(frame)
		 }
	},
	_render: function () {
		for (i = 0; i < this.length; i = (i + 1) | 0) {
			var frame = this.players[i].videoFrame
			if (!frame) { continue }
			var gl = this.renderContext.gl
			if (i === 0) { gl.disable(gl.BLEND) } else { gl.enable(gl.BLEND) }
			this.renderContext.render(
				frame, frame.width, frame.height, frame.uOffset, frame.vOffset 
			)
		}
	},
	dumpTexture: function (canvas) {
		canvas.getContext('2d').putImageData(
			this.renderContext.gl.getImageData(0, 0, this.canvas.width, this.canvas.height),
			0, 0
		)
	}
}