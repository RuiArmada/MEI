CC = gcc
BIN = bin/
SRC = src/
BNC = benchmarks/
INCLUDES = include/
EXEC = k_means
THREADS = 16

########################################## CFLAGS #################################################
# General purpose flags
CFLAGS = -Wall -Wextra -Werror -lm -fopt-info -fopenmp

#-PERFORMANCE-#
# Performance flags
CFLAGS += -O2 -ffast-math -flto
# CFLAGS += -O2 -ffast-math -flto -fno-omit-frame-pointer -g 
# The aren't supported in SeARCH.
# CFLAGS += -mfma -msse4.2 -mfpmath=sse
CFLAGS += -ftree-loop-if-convert

#-VALGRIND-#

VALGRIND_FLAGS = --leak-check=full --show-leak-kinds=all --track-origins=yes --leak-resolution=high

.DEFAULT_GOAL := main

$(BIN)euclidean_distance.o: $(SRC)euclidean_distance.c $(INCLUDES)euclidean_distance.h
	$(CC) $(CFLAGS) -c $(SRC)euclidean_distance.c -o $(BIN)euclidean_distance.o

$(BIN)gen_samples.o: $(SRC)gen_samples.c $(INCLUDES)gen_samples.h
	$(CC) $(CFLAGS) -c $(SRC)gen_samples.c -o $(BIN)gen_samples.o

$(BIN)common.o: $(SRC)k_means/common.c $(INCLUDES)k_means/common.h
	$(CC) $(CFLAGS) -c $(SRC)k_means/common.c -o $(BIN)common.o

$(BIN)k_means_seq.o: $(SRC)k_means/k_means_seq.c $(INCLUDES)k_means/common.h $(INCLUDES)k_means/k_means_seq.h
	$(CC) $(CFLAGS) -c $(SRC)k_means/k_means_seq.c -o $(BIN)k_means_seq.o

$(BIN)k_means_par.o: $(SRC)k_means/k_means_par.c $(INCLUDES)k_means/common.h $(INCLUDES)k_means/k_means_par.h
	$(CC) $(CFLAGS) -c $(SRC)k_means/k_means_par.c -o $(BIN)k_means_par.o

main: $(SRC)main.c $(BIN)euclidean_distance.o $(BIN)gen_samples.o $(BIN)k_means_seq.o $(BIN)k_means_par.o $(BIN)common.o
	$(CC) $(CFLAGS) $(SRC)main.c $(BIN)*.o -o $(BIN)$(EXEC)

########################################## VALGRIND ###############################################
valgrind: main
	valgrind $(VALGRIND_FLAGS) $(BIN)$(EXEC)

#- Other -#

clean_objs:
	@rm -f $(BIN)*.o
	@rm -f $(PRF)*.o

clean_exec:
	@rm -f $(BIN)$(EXEC)

clean_benchmarks:
	@rm -f $(BNC)bin/*
	@rm -f $(BNC)*.o

clean: clean_objs clean_exec clean_benchmarks
	@echo "Done cleaning"

runseq: main
	./$(BIN)$(EXEC) 10000000 $(CP_CLUSTERS)

runpar: main
	./$(BIN)$(EXEC) 10000000 $(CP_CLUSTERS) $(THREADS)

bench: main
	./benchmarks/bench.sh