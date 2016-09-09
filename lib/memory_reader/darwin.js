const ffi = require('ffi')
const ref = require('ref')
const path = require('path')

module.exports = ffi.Library(path.join(__dirname, './darwin_read_process_memory.dylib'), {
    'OpenProcess': ['int', ['int']],
    'ReadProcessMemory': ['int', ['int', ref.types.uint32, ref.types.uint32, ref.types.uint32]]
})
