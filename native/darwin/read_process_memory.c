#include <stdio.h>
#include <unistd.h>
#include <mach/mach_init.h>
#include <mach/mach.h>

int read_process_memory
(int pid, void* vm_address, uint32_t size, vm_offset_t* address) {
  task_t task;
  uint32_t read_size;
  task_for_pid(current_task(), pid, &task);
  return vm_read(task, (vm_address_t) vm_address, size, address, &read_size);
}
