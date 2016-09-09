#include <unistd.h>
#include <mach/mach.h>

int OpenProcess (int pid) {
  task_t task;
  task_for_pid(current_task(), pid, &task);
  return task;
}

int ReadProcessMemory
(task_t task, vm_address_t address, vm_address_t data, vm_size_t size) {
  vm_size_t read_size;
  return vm_read_overwrite(task, address, size, data, &read_size);
}
