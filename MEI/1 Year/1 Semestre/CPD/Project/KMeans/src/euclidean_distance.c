
#include <inttypes.h>
#include <math.h>
#include <omp.h>

#include "../include/common/point.h"
#include "../include/euclidean_distance.h"
#include "../include/common/builtins.h"


/**
 * @brief Returns the euclidean distance between two points.
 *
 * WARNING: This is here for reference only. It is not used in the program.
 *
 * @param p1
 * @param p2
 * @return float
 */
float euclidean_distance_sqrt(const point* p1, const point* p2) {
    return sqrtf(powf(p1->x - p2->x, 2) + powf(p1->y - p2->y, 2));
}

/**
 * @brief Returns the squared euclidean distance between two points.
 *
 * @param p1
 * @param p2
 * @return float
 */
inline float euclidean_distance_squared(const point* p1, const point* p2) {
    return powf(p1->x - p2->x, 2) + powf(p1->y - p2->y, 2);
}
