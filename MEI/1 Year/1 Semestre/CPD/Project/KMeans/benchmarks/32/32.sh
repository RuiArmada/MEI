#!/bin/bash
#SBATCH --job-name=k_means_par
#SBATCH --cpus-per-task=1
#SBATCH --nodes=1
#SBATCH --output=k_means_32_1.out
date

echo "Running K-Means with 10000000 samples 32 clusters, sequential"

# Run the program
perf stat -r 5 ./bin/k_means 10000000 32
