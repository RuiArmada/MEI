#ifndef K_MEANS_H_
#define K_MEANS_H_

#include "k_means/common.h"
#include "k_means/k_means_par.h"
#include "k_means/k_means_seq.h"

// For the algorithm validation, the results of the first phase of the practical work should be used,
// using the 20 iterations stop criterion.
// We will also allow the user to choose the max number of iterations at compile time.
#ifndef STOP_CRITERION
#define STOP_CRITERION 20  // 20 iterations
#endif

#endif