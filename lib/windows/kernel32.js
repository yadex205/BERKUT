const ref = require('ref')
const ffi = require('ffi')

const kernel32 = ffi.Library('kernel32', {
    'OpenProcess': [ref.types.uint32, [ref.types.uint32, 'bool', ref.types.uint32]],
    'VirtualAllocEx': [ref.types.uint64, [ref.types.uint32, ref.types.uint64, ref.types.uint32, ref.types.uint32, ref.types.uint32]],
    'WriteProcessMemory': ['int', [ref.types.uint32, ref.types.uint64, ref.types.uint64, ref.types.uint32, ref.types.uint64]]
})

const AccessRight = {
    PROCESS_VM_OPERATION: 0x0008
}

const AllocationType = {
    MEM_COMMIT:     0x00001000,
    MEM_RESERVE:    0x00002000,
    MEM_RESET:      0x00080000,
    MEM_RESET_UNDO: 0x10000000
}

module.exports = {
    AccessRight: AccessRight,
    openProcess: function(accessRight, inherit, pid) {
        return kernel32.OpenProcess(accessRight || AccessRight.PROCESS_VM_OPERATION , inherit || false, pid)
    },
    VirtualAllocEx: function(processHandle, prefix, size, allocationType, protect) {
        return kernel32.VirtualAllocEx(processHandle, prefix || 0, size, )
    },
    WriteProcessMemory: function(processHandle, prefix, buffer, size) {
        const writtenSize
        const result = kernel32.WriteProcessMemory(processHandle, prefix, buffer, size, writtenSize)
        return result !== 0 ? writtenSize : -1
    }
}