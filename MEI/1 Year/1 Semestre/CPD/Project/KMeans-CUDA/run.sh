#!/bin/bash
#SBATCH --time=1:00
#SBATCH --partition=cpar
#SBATCH --constraint=k20

# ./bin/kmeans_cuda <num_points> <num_clusters> <num_blocks>
nvprof ./bin/kmeans_cuda 10000000 32 256
