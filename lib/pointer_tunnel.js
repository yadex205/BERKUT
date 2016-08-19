const kernel32 = require('./windows/kernel32')
const ref = require('ref')

var Writer = function () {
    this.receiver = null
    this.pointer = 0x0
    this.size = 0
}

// TODO: This is now only for win32 platform. Implements here for macOS, linux in the future.
Writer.prototype = {
    connect: function(pid) {
        const handle = kernel32.OpenProcess(
            kernel32.AccessRight.PROCESS_VM_OPERATION,
            false,
            pid
        )
        this.receiver = handle
        return handle
    },
    alloc: function(size) {
        if (!this.receiver) { return -1 }
        const pointer = kernel32.VirtualAllocEx(
            this.receiver, 0, size,
            kernel32.AllocationType.MEM_COMMIT | kernel32.AllocationType.MEM_RESERVE,
            kernel32.Protect.PAGE_READWRITE
        )
        this.pointer = pointer
        return pointer
    },
    send: function (uint8array) {
        if (!this.receiver || !this.pointer) { return }
        const buf = Buffer.from(uint8array.buffer)
        const address = buf.address()
        const result = -kernel32.WriteProcessMemory(
            this.receiver, this.pointer, address, buf.length
        )
        if (result === -1) { console.error(kernel32.GetLastError()) }
        return result
    }
}

var Reader = function() {
    this.handle = null
    this.pointer = 0x0
}

Reader.prototype = {
    connect: function(pid) {
        const handle = kernel32.OpenProcess(
            kernel32.AccessRight.PROCESS_VM_READ, false, pid
        )
        this.handle = handle
        return handle
    },
    read: function(pointer, uint8array) {
        var buf = Buffer.from(uint8array.buffer)
        const result = kernel32.ReadProcessMemory(
            this.handle, pointer, buf.address(), buf.length
        )
        if (result === -1) { console.error(kernel32.GetLastError()) }
        return result
    }
}

module.exports = {
    Writer: Writer,
    Reader: Reader
}