#ifndef K_MEANS_SEQ_H_
#define K_MEANS_SEQ_H_

#include "../common/point.h"
#include "common.h"

/**
 * @brief
 *
 * @param samples
 * @param clusters
 * @return k_means_out
 */
k_means_out k_means_seq(const point* samples, point* clusters, const uint32_t sample_count, const uint32_t cluster_count);

#endif