#!/bin/bash
#SBATCH --job-name=k_means_par
#SBATCH --cpus-per-task=8
#SBATCH --nodes=1
#SBATCH --output=k_means_4_8.out
date

echo "Running K-Means with 10000000 samples 4 clusters 8 threads"

# Run the program
perf stat -r 20 ./bin/k_means 10000000 4 8
