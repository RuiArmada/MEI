#ifndef IMPL_EUCLIDEAN_DISTANCES_H
#define IMPL_EUCLIDEAN_DISTANCES_H

#include <inttypes.h>

typedef struct point point;

/**
 * @brief Returns the euclidean distance between two points.
 *        This function performs a single calculation.
 *        WARNING: This functions is for reference only.
 *                 It is not used in the final version.
 *
 * @param p1
 * @param p2
 * @return float
 */
float euclidean_distance_sqrt(const point* p1, const point* p2);

/**
 * @brief Returns the squared euclidean distance between two points.
 *        This function performs a single calculation.
 *
 * @param p1     The first point.
 * @param p2     The second point.
 * @return float The squared euclidean distance between the two points.
 */
float euclidean_distance_squared(const point* p1, const point* p2);

#endif