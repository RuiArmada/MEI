#include "../../include/k_means/common.h"

#include <stdlib.h>

/**
 * @brief Initializes the output struct.
 *
 * @param k
 * @return k_means_out
 */
k_means_out k_means_out_init(const uint32_t k) {
    return (k_means_out) { .cluster_size = (uint32_t*)calloc(k, sizeof(uint32_t)), .iterations = 0 };
}

/**
 * @brief Frees the memory allocated for the output struct.
 *
 */
void k_means_out_free(k_means_out* out) {
    free(out->cluster_size);
}

/**
 * @brief Initializes an array of auxiliary structs.
 *
 * @param uint32_t k The number of clusters.
 * @return k_means_aux*
 */
k_means_aux* k_means_aux_init(const uint32_t k) {
    return (k_means_aux*)calloc(k, sizeof(k_means_aux));
}

/**
 * @brief Initializes an array of auxiliary structs.
 *
 * @param uint32_t k The number of clusters.
 * @param uint32_t num_threads The number of threads.
 * @return k_means_aux**
 */
k_means_aux** k_means_aux_init_2d(const uint32_t k, const uint32_t num_threads) {
    k_means_aux** aux = (k_means_aux**)calloc(num_threads, sizeof(k_means_aux*));
    for (uint32_t i = 0; i < num_threads; i++) {
        aux[i] = k_means_aux_init(k);
    }
    return aux;
}

/**
 * @brief Frees the memory allocated for the auxiliary structs.
 *
 */
void k_means_aux_free(k_means_aux* aux) {
    free(aux);
}
