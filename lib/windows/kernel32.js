const ref = require('ref')
const ffi = require('ffi')

const kernel32 = ffi.Library('kernel32', {
    'OpenProcess': [ref.types.uint32, [ref.types.uint32, 'bool', ref.types.uint32]],
    'VirtualAllocEx': [ref.types.uint64, [ref.types.uint32, ref.types.uint64, ref.types.uint32, ref.types.uint32, ref.types.uint32]],
    'WriteProcessMemory': ['int', [ref.types.uint32, ref.types.uint64, ref.types.uint64, ref.types.uint32, ref.types.uint64]],
    'ReadProcessMemory': ['int', [ref.types.uint32, ref.types.uint64, ref.types.uint64, ref.types.uint32, ref.types.uint32]],
    'GetLastError': [ref.types.uint32, []]
})

const AccessRight = {
    PROCESS_VM_OPERATION: 0x0008,
    PROCESS_VM_READ:      0x0010
}

const AllocationType = {
    MEM_COMMIT:     0x00001000,
    MEM_RESERVE:    0x00002000,
    MEM_RESET:      0x00080000,
    MEM_RESET_UNDO: 0x10000000
}

const Protect = {
    PAGE_READWRITE: 0x04
}

module.exports = {
    AccessRight: AccessRight,
    AllocationType: AllocationType,
    Protect: Protect,
    OpenProcess: function(accessRight, inherit, pid) {
        return kernel32.OpenProcess(accessRight || AccessRight.PROCESS_VM_OPERATION , inherit || false, pid)
    },
    VirtualAllocEx: function(processHandle, prefix, size, allocationType, protect) {
        return kernel32.VirtualAllocEx(processHandle, prefix || 0, size, allocationType, protect)
    },
    WriteProcessMemory: function(processHandle, prefix, buffer, size) {
        let writtenSize = 0x0
        const result = kernel32.WriteProcessMemory(processHandle, prefix, buffer, size, writtenSize)
        return result !== 0 ? writtenSize : -1
    },
    ReadProcessMemory: function (processHandle, prefix, receiveBuffer, size) {
        let readSize = 0x0
        const result = kernel32.ReadProcessMemory(processHandle, prefix, receiveBuffer, size, readSize)
        return result !== 0 ? readSize : -1
    },
    GetLastError: function() {
        return kernel32.GetLastError()
    }
}