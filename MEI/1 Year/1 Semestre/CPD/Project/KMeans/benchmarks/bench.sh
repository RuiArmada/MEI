#!/bin/bash

# creating the output folder and cleaning it if it already exists
mkdir -p output
rm -rf output/*.out

for i in 4 32
do
    for j in 2 4 8 16 32
    do
        while [ $(squeue -u $USER | wc -l) -gt 2 ]; do sleep 2; done
        sbatch --partition=cpar ./benchmarks/$i/$i\_$j.sh
    done
done

# run the rest of the benchmarks
while [ $(squeue -u $USER | wc -l) -gt 2 ]; do sleep 2; done
sbatch --partition=cpar ./benchmarks/4/4.sh
while [ $(squeue -u $USER | wc -l) -gt 2 ]; do sleep 2; done
sbatch --partition=cpar ./benchmarks/32/32.sh

# wait for all jobs to finish
while [ $(squeue -u $USER | wc -l) -gt 1 ]; do sleep 2; done

# move the output files to the output folder
mv *.out output
tar -cf output$(date +%Y%m%d%H%M%S).tar output