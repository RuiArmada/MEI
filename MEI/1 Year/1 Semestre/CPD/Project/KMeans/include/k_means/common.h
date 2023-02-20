#ifndef K_MEANS_COMMON_H_
#define K_MEANS_COMMON_H_

#include <inttypes.h>
#include <stdlib.h>

/**
 * @brief This struct is used to store the output of the k-means algorithm.
 *
 */
typedef struct output {
    uint32_t* cluster_size;
    uint32_t iterations;
} k_means_out;

/**
 * @brief This struct is used to auxiliate the k-means algorithm.
 *
 */
typedef struct auxiliary {
    float x_sum;
    float y_sum;
    uint32_t total;
} k_means_aux;

/**
 * @brief Initializes the output struct.
 *
 * @param k
 * @return k_means_out
 */
k_means_out k_means_out_init(const uint32_t k);

/**
 * @brief Frees the memory allocated for the output struct.
 *
 */
void k_means_out_free(k_means_out* out);

/**
 * @brief Initializes an array of auxiliary structs.
 *
 * @param uint32_t k The number of clusters.
 * @return k_means_aux*
 */
k_means_aux* k_means_aux_init(const uint32_t k);

/**
 * @brief Initializes an array of auxiliary structs.
 *
 * @param uint32_t k The number of clusters.
 * @param uint32_t num_threads The number of threads.
 * @return k_means_aux**
 */
k_means_aux** k_means_aux_init_2d(const uint32_t k, const uint32_t num_threads);

/**
 * @brief Frees the memory allocated for the auxiliary structs.
 *
 */
void k_means_aux_free(k_means_aux* aux);

#endif