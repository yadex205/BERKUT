const Controller = function(options) {
	this._callbacks = {}
	this.eventEmitter = null
	
	if (options.in instanceof Function) { options.in().bind(this) }
}

Controller.prototype = {
	on: function(status, data1, callback) {
		if (!this._callbacks[status]) { this._callbacks[status] = {} }
		this._callbacks[status][data1] = callback
	},
	onValue: function(status, data1, eventName) {
		this.on(status, data1, (value) => {
			this.emit(eventName, value)
		})
	},
	onMax: function(status, data1, eventName) {
		this.on(status, data1, (value) => {
			if (value === 127) {
				this.emit(eventName, value)
			}
		})
	},
	onZero: function (status, data1, eventName) {
		this.on(status, data1, (value) => {
			if (value === 0) {
				this.emit(eventName, value)
			}
		})
	},
	emit: function(eventName, value) {
		if (this.eventEmitter) {
			this.eventEmitter.emit(eventName, value)
		}	
	},
	receive: function(status, data1, data2) {
		if (!this._callbacks[status] || !this._callbacks[status][data1]) { return }
		this._callbacks[status][data1](data2)
	}
}