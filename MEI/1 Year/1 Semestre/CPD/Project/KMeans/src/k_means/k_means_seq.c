#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../../include/common/builtins.h"
#include "../../include/k_means.h"
#include "../../include/euclidean_distance.h"

/**
 * @brief Auxiliary struct to calculate cluster centers
 *       and total number of points in each cluster in
 *       each iteration of the algorithm.
 */

void seq_recalc_centroids(point* samples, const k_means_aux* clusters, const uint32_t cluster_count);
void seq_cluster_points(const point* samples, const point* clusters, k_means_aux* new, const uint32_t sample_count, const uint32_t cluster_count);
uint32_t seq_has_converged(const k_means_aux* old, const k_means_aux* new, const uint32_t cluster_count);

// Original python code was taken from https://datasciencelab.wordpress.com/tag/lloyds-algorithm/

/**
 * @brief Recalculates the centroid of each cluster.
 *
 * @param clusters The clusters.
 * @param cluster_count The size of each cluster.
 * @param aux The auxiliary struct containing values of the last iteration.
 */
void seq_recalc_centroids(point* clusters, const k_means_aux* aux, const uint32_t cluster_count) {
    for (uint32_t i = 0; i < cluster_count; i++) {
        clusters[i].x = aux[i].x_sum / aux[i].total;
        clusters[i].y = aux[i].y_sum / aux[i].total;
    }
}

/**
 * @brief Cluster points implementations.
 *
 * @param samples
 * @param clusters
 * @param new
 */
 // cluster points
void seq_cluster_points(const point* samples, const point* clusters, k_means_aux* new, const uint32_t sample_count, const uint32_t cluster_count) {
    for (uint32_t i = 0; i < sample_count; i++) {
        float min_distance = euclidean_distance_squared(&samples[i], &clusters[0]);
        uint32_t cluster_id = 0;
        for (uint32_t j = 1; j < cluster_count; j++) {
            float distance = euclidean_distance_squared(&samples[i], &clusters[j]);
            if (distance < min_distance) {
                min_distance = distance;
                cluster_id = j;
            }
        }

        new[cluster_id].x_sum += samples[i].x;
        new[cluster_id].y_sum += samples[i].y;
        new[cluster_id].total++;
    }
}

/**
 * @brief Checks whether the algorithm has converged.
 *
 * @param old k_means_aux struct with previous iter values.
 * @param new k_means_aux struct with current iter values.
 */
uint32_t seq_has_converged(const k_means_aux* old, const k_means_aux* new, const uint32_t cluster_count) {
    uint32_t counter = 0;

    for (uint32_t i = 0; i < cluster_count; i++) {
        counter += (old[i].x_sum != new[i].x_sum) || (old[i].y_sum != new[i].y_sum) || (old[i].total != new[i].total);
    }

    return counter;
}

/**
 * @brief K-means algorithm naive implementation.
 *
 * @param samples
 * @param clusters
 */
k_means_out k_means_seq(const point* samples, point* clusters, const uint32_t sample_count, const uint32_t cluster_count) {
    uint32_t iter = 0;  // iteration counter

    k_means_out out = k_means_out_init(cluster_count);
    k_means_aux* old = k_means_aux_init(cluster_count);
    k_means_aux* new = k_means_aux_init(cluster_count);

    // Step 1c - Assign each sample to the nearest cluster using the euclidean distance.
    seq_cluster_points(samples, clusters, new, sample_count, cluster_count);

    do {
        // Step 2 - Calculate the centroid of each cluster. (also known as the geometric center)
        seq_recalc_centroids(clusters, new, cluster_count);

        // Delete previous iter's metrics: set "new" to "old" and "new" to 0
        memcpy(old, new, cluster_count * sizeof(k_means_aux));
        memset(new, 0, cluster_count * sizeof(k_means_aux));

        // Step 3 - Assign each sample to the nearest cluster using the euclidean distance
        seq_cluster_points(samples, clusters, new, sample_count, cluster_count);

        iter++;
    } while (seq_has_converged(old, new, cluster_count));  // Step 4, TODO: improve convergence check?


    // fill the output struct
    for (uint32_t i = 0; i < cluster_count; i++) {
        out.cluster_size[i] = new[i].total;
    }
    out.iterations = iter;

    // Free the allocated memory
    free(old);
    free(new);

    return out;
}
