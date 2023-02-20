#include "../include/gen_samples.h"
#include "../include/common/point.h"

#include <stdlib.h>
#include <string.h>

/**
 * @brief Generates a set of random points, sequentially.
 *
 * @param samples
 * @param clusters
 * @param cluster_count
 * @param sample_count
 */
void gen_sample_seq(point* samples, point* clusters, uint32_t cluster_count, uint32_t sample_count) {
    srand(10);

    for (uint_fast32_t i = 0; i < sample_count; i += 1) {
        samples[i].x = (float)rand() / RAND_MAX;
        samples[i].y = (float)rand() / RAND_MAX;
    }

    memcpy(clusters, samples, cluster_count * sizeof(point));
}
