darwin_read_process_memory.dylib: ./native/darwin/read_process_memory.c
	clang -dynamiclib -std=gnu99 ./native/darwin/read_process_memory.c -o ./lib/memory_reader/darwin_read_process_memory.dylib
