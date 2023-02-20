#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "../include/common/builtins.h"
#include "../include/gen_samples.h"
#include "../include/k_means.h"

// Steps as described in the assignment
// Step 1 - Initialize the samples & clusters.
// Step 1a - Initialize a vector with random values. (N samples in the (x,y) space)
// Step 1b - Initialize the K clusters with the coordinates of the first K samples.
// Step 1c - Assign each sample to the nearest cluster using the euclidean distance.
// Step 2 - Calculate the centroid of each cluster. (also known as geometric center)
// Step 3 - Assign each sample to the nearest cluster using the euclidean distance.
// Step 4 - Repeat steps 2 and 3 until there are no points that change clusters.

int main(int argc, char** argv) {
    // ./k_means <sample_count> <cluster_count> <thread_count>
    if (unlikely(argc < 3)) {
        return EXIT_FAILURE;
    }

    uint32_t sample_count = atoi(argv[1]);
    uint32_t cluster_count = atoi(argv[2]);

    point* samples = (point*)malloc(sample_count * sizeof(point));
    point* clusters = (point*)malloc(cluster_count * sizeof(point));
    k_means_out out = k_means_out_init(cluster_count);

    gen_sample_seq(samples, clusters, cluster_count, sample_count);

    if (argc == 4) {
        uint32_t num_threads = atoi(argv[3]);

        out = k_means_par(samples, clusters, sample_count, cluster_count, num_threads);
    }
    else {
        // Step 1 - Initialize the samples & clusters.
        out = k_means_seq(samples, clusters, sample_count, cluster_count);
    }

    // Print the results
    printf("N = %d, K = %d\n", sample_count, cluster_count);
    for (uint32_t i = 0; i < cluster_count; i++) {
        printf("Center: (%.3f, %.3f) : Size: %d\n",
            clusters[i].x, clusters[i].y, out.cluster_size[i]);
    }
    printf("Iterations: %d\n", out.iterations);

    free(samples);
    free(clusters);
    k_means_out_free(&out);

    return EXIT_SUCCESS;
}