const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const mimedb = require('mime-db')

/*
const EXTENSIONS = Object.keys(mimedb).filter((type) => {
    return type.startsWith('video') || type.startsWith('image')
}).map((type) => {
    return mimedb[type].extensions
}).filter((extensions) => {
    return extensions !== null && extensions !== undefined
}).reduce((prev, current) => {
    return prev.concat(current)
})
 */

const EXTENSIONS = [
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff',
    'mp4', 'avi', 'mov', 'mkv', 'webm', 'wmv'

]

const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']

const searcher = {
    win32: function(root, callback) {
        const wildcards = EXTENSIONS.map((ext) => { return `*.${ext}` })
        const proc = spawn('dir', ['/B', '/S', root].concat(wildcards))
        proc.stdout.on('data', (data) => {
            callback(data.toString().split('\n'))
        })
    },
    darwin: function(root, callback) {
        const condition = EXTENSIONS.map((ext) => {
            return `kMDItemDisplayName == "*.${ext}"`
        }).join(' || ')
        const proc = spawn('mdfind', ['-onlyin', root, '-name', condition])
        proc.stdout.on('data', (data) => {
            callback(data.toString().split('\n'))
        })
    }
}

module.exports = function(callback, root) {
    if (!root) { root = HOME }
    searcher[process.platform](root, callback)
}
