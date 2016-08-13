const Midi = require('midi')
const EventEmitter = require('events')
const inputTable = require('../../config/midi_input.json')

const MidiReceiver = function(portNum) {
	this._init(portNum)
}

MidiReceiver.list = function() {
	const input = new Midi.input()
	const names = []
	for (let i = 0; i < input.getPortCount(); i++) {
		names.push(input.getPortName(i))
	}
	return names
}

MidiReceiver.prototype = {
	_init: function(portNum) {
		const input = new Midi.input()
		input.openPort(portNum)
		this._input = input
		this.isDead = false
	},
	listen: function(callback) {
		if (!callback instanceof Function || this.isDead) { return }
		this._input.on('message', (deltaTime, message) => {
			callback(deltaTime, message)
		})
	},
	destroy: function() {
		this._input.closePort();
		delete this._input
		this.isDead = true
	}
}

MidiReceiverManager = function () {
	this._receivers = {}
	this._eventEmitter = new EventEmitter()
}

MidiReceiverManager.Event = {
	RECEIVE: 'midi-receive-manager:receive'
}

MidiReceiverManager.prototype = {
	enable: function(portNum) {
		const name = this.list()[portNum]
		if (!name || this._receivers[name]) { return }

		const receiver = new MidiReceiver(portNum)
		receiver.listen((deltaTime, message) => {
			this._eventEmitter.emit(
				MidiReceiverManager.Event.RECEIVE,
				portNum, deltaTime, message[0], message[1], message[2]
			)
		})
	},
	disable: function(portNum) {
		const name = this.list()[portNum]
		if (!name || !this._receivers[name]) { return }

		this._receivers[name].destroy()
		delete this._receivers[name]
	},
	listen: function(callback) {
		if (!callback instanceof Function) { return }
		this._eventEmitter.on(
			MidiReceiverManager.Event.RECEIVE,
			(portNum, deltaTime, status, data1, data2) => {
				callback(status, data1, data2)
			}
		)
	},
	list: function() {
		return MidiReceiver.list()
	},
	enabledList: function() {
		return this.list().map((name, portNum) => {
			return { name: name, portNum: portNum }
		}).filter((midi) => {
			return this._receivers[midi.name]
		})
	}
}

module.exports = MidiReceiverManager