const Receiver = require('./midi/receiver')

const MidiManager = function (eventEmitter) { 
	this.eventEmitter = eventEmitter
	this.receiver = new Receiver()
	this.controllerMaps = []
}

MidiManager.prototype = {
	addControllerMap: function(name) {
		const controller = require(`../midi/${name}`)
		controller.eventEmitter = this.eventEmitter
		this.receiver.listen(function (status, data1, data2) {
			controller.receive(status, data1, data2)
		})
		this.controllerMaps.push(controller)
	},
	enableDevice: function(portNum) {
		this.receiver.enable(portNum)
	},
	disableDevice: function(portNum) {
		this.receiver.disable(portNum)
	},
	deviceList: function() {
		const names = this.receiver.list()
		const enabledList = this.receiver.enabledList()
		const list = names.map((name, index) => {
			return { name: name, portNum: index, enabled: false }
		})
		enabledList.forEach((enabled) => {
			list[enabled.portNum].enabled = true
		})
		return list
	}
}

module.exports = MidiManager