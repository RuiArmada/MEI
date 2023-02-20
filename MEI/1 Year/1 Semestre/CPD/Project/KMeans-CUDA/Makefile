################################################################################
# Makefile for general code snippets
#
# by André Pereira
################################################################################

SHELL = /bin/sh
BIN_NAME = kmeans_cuda

CXX = nvcc
LD  = nvcc

CXXFLAGS = -O3 -std=c++17 -arch=sm_70 -Wno-deprecated-gpu-targets 

SRC_DIR = src
BIN_DIR = bin
BUILD_DIR = build
SRC = $(wildcard $(SRC_DIR)/*.cu)
OBJ = $(patsubst src/%.cu,build/%.o,$(SRC))
BIN = $(BIN_NAME)

vpath %.cu $(SRC_DIR)

################################################################################
# Rules
################################################################################

.DEFAULT_GOAL = all

$(BUILD_DIR)/%.o: %.cu
	$(CXX) -c $(CXXFLAGS) $(INCLUDES) $< -o $@ $(LIBS)

$(BIN_DIR)/$(BIN_NAME): $(OBJ)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $(OBJ) $(LIBS)

checkdirs:
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(BIN_DIR)

all: checkdirs $(BIN_DIR)/$(BIN_NAME)
	@echo "If any error occurs, try to load the following modules:"
	@echo "module load cuda/11.3.1"
	@echo "module load gcc/7.2.0"

clean:
	rm -f $(BUILD_DIR)/* $(BIN_DIR)/* 

run: clean all
	sbatch run.sh