# Parallel Computation 2022/23

This repository contains the code for the assignments of the course ["Parallel Computation"](http://gec.di.uminho.pt/mei/cp/) at the University of Minho in 2022/23.

## Assignments

Each assignments is available in the Assignments folder.

- Assignment 1
- Assignment 2
- Assignment 3

Due to the way the assignments were structured, the code for each assignment isn't available in separate.
Instead, the code for each assignment was grouped up into a single project.

## Building

To build the code run `make` in the K-Means folder.

As of the second assignment, the code is build against the [OpenMP](https://www.openmp.org/) library.

To run a full batch of benchmarks, run `make bench` in the K-Means folder.

## Running

To run the code, run `./bin/k_means <sample_count> <cluster_count> <thread_count>` in the K-Means folder after building.

## Benchmarks

Benchmarks were run on [SeARCH](https://www4.di.uminho.pt/search/pt/use.htm).

The benchmarks folder contains the scripts used to run the benchmarks as well as the updated results.
These scripts use [sbatch](https://slurm.schedmd.com/sbatch.html) to request resources from the cluster.

## Authors

- [Tiago Sousa](https://www.github.com/Existency)
- [Rui Armada](https://github.com/RuiArmada)
