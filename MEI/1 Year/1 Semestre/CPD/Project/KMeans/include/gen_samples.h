#ifndef UTILS_H_
#define UTILS_H_

#include <inttypes.h>

typedef struct point point;

/**
 * @brief Generates a set of random points, sequentially.
 *
 * @param samples
 * @param clusters
 * @param cluster_count
 * @param sample_count
 */
void gen_sample_seq(point* samples, point* clusters, uint32_t cluster_count, uint32_t sample_count);

#endif