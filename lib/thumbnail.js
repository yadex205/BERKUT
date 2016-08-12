const spawn = require('child_process').spawn
const Path = require('path')
const Promise = require('promise')
const NeDB = require('nedb')
const UUID = require('uuid')

const ffmpegBinDir = Path.join(__dirname, '../vendor/ffmpeg/bin')
const cacheDir = Path.join(__dirname, '../cache')

const ThumbnailManager = function() {
	this.db = new NeDB({
		filename: Path.join(__dirname, '../tmp/cache.json'),
		autoload: true
	})
}

ThumbnailManager.prototype = {
	findOrCreate: function(filepath, callback) {
		this.db.find({ filepath: filepath }, (err, docs) => {
			const doc = docs[0]
			if (doc) {
				if (!callback) { callback = (thumbnail) => { } }
				callback(doc.thumbnail)
			} else {
				this.create(filepath, callback)
			}
		})
	},
	create: function(filepath, callback) {
		const cachePath = Path.normalize(`${cacheDir}/${UUID.v4()}.jpg`)
		this._ffprove(filepath).then((info) => {
			const pos = info.format.duration ? info.format.duration / 3 : 0
			this._ffmpeg(filepath, cachePath, pos).then(() => {
				this.db.insert({
					filepath: filepath,
					thumbnail: cachePath
				})
				if (!callback instanceof Function) { callback = () => { } }
				callback(cachePath)
			})
		})
	},
	_ffmpeg: function (filepath, thumbnailpath, position) {
		return new Promise((resolve) => {
			const ffmpeg = spawn(ffmpegBinDir + '/ffmpeg', [
				// '-vf', 'thumbnail=120',
				'-ss', position,
				'-skip_frame', 'nokey',
				'-i', Path.normalize(filepath),
				'-vframes', '1',
				'-s', '256x128',
				'-an', '-y',
				'-f', 'image2', Path.normalize(thumbnailpath)
			])
			ffmpeg.on('close', resolve)
		})	
	},
	_ffprove: function (filepath) {
		return new Promise((resolve) => {
			let rawJson = ''
			const ffprobe = spawn(ffmpegBinDir + '/ffprobe', [
				'-v', 'quiet', '-print_format', 'json', '-show_format', Path.normalize(filepath)
			])
			ffprobe.stdout.on('data', (data) => {
				rawJson += data.toString()
			})
			ffprobe.on('close', () => {
				const json = JSON.parse(rawJson)
				resolve(json)
			})
		})
	}
}

module.exports = new ThumbnailManager()