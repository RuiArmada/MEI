#!/bin/bash
#SBATCH --job-name=k_means_par
#SBATCH --cpus-per-task=16
#SBATCH --nodes=1
#SBATCH --output=k_means_32_16.out
date

echo "Running K-Means with 10000000 samples 32 clusters 16 threads"

# Run the program
perf stat -r 20 ./bin/k_means 10000000 32 16
