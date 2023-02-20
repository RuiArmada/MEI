#ifndef K_MEANS_PAR_H_
#define K_MEANS_PAR_H_

#include "../common/point.h"
#include "common.h"

/**
 * @brief
 *
 * @param samples
 * @param clusters
 * @param sample_count
 * @param cluster_count
 * @param num_threads
 * @return k_means_out
 */
k_means_out k_means_par(const point* samples, point* clusters, const uint32_t sample_count, const uint32_t cluster_count, const uint32_t num_threads);

#endif