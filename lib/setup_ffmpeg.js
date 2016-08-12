const download = require('download')
const unzip = require('unzip')
const Path = require('path')
const fs = require('fs')

const ffmpegDir = Path.join(__dirname, '../vendor')

module.exports = {
	downloadWin: function(callback) {
		const task = download('https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip')
			.pipe(unzip.Extract({ path: ffmpegDir }))
		task.on('finish', (event) => {
			fs.renameSync(`${ffmpegDir}/ffmpeg-latest-win32-static`, `${ffmpegDir}/ffmpeg`)
			callback instanceof Function ? callback() : () => { }
		})
	}
}