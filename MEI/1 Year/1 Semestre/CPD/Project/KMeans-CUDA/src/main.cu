#include <cuda.h>
#include <inttypes.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define u32 uint32_t

#define cuda_err_check(ans) \
    { gpuAssert((ans), __FILE__, __LINE__); }
inline void gpuAssert(cudaError_t code, const char* file, int line, bool abort = true) {
    if (code != cudaSuccess) {
        fprintf(stderr, "GPUassert: %s %s %d\n", cudaGetErrorString(code), file, line);
        if (abort) exit(code);
    }
}

__device__ float d_euclidean_distance(float x, float y, float x_, float y_) {
    return (x - x_) * (x - x_) + (y - y_) * (y - y_);
}

__global__ void d_clear_accumulators(float* __restrict__ d_xa, float* __restrict__ d_ya, u32* __restrict__ d_ca) {
    u32 i = threadIdx.x;
    d_xa[i] = 0.0f;
    d_ya[i] = 0.0f;
    d_ca[i] = 0;
}

__global__ void d_recalc_centroids(
    float* __restrict__ cx,
    float* __restrict__ cy,
    float* __restrict__ d_xa,
    float* __restrict__ d_ya,
    u32* __restrict__ d_ca) {
    u32 cid = threadIdx.x;
    u32 count = (d_ca[cid] > 0.0f) * d_ca[cid] + (d_ca[cid] <= 0.0f);

    cx[cid] = d_xa[cid] / count;
    cy[cid] = d_ya[cid] / count;
}

// cuda_kMeans_ClearAll_wrapper(
//      outputSums_x_ptr_device,
//      outputSums_y_ptr_device,
//      outputClustersCount_ptr_device,
//      1,
//      CLUSTERS_NUMBER);

__global__ void d_cluster_points(
    float* __restrict__ d_s,
    float* __restrict__ cx,
    float* __restrict__ cy,
    float* __restrict__ d_xa,
    float* __restrict__ d_ya,
    u32* __restrict__ d_ca,
    int n,
    int k) {
    u32 idx = blockIdx.x * blockDim.x + threadIdx.x;
    u32 iter = idx << 1;  // Since we have 2 floats per sample (x, y)

    if (idx < n) {
        float x = d_s[iter];
        float y = d_s[iter + 1];
        float min_dist = 1e10f;
        u32 min_cid = 0;

        for (u32 cid = 0; cid < k; cid++) {
            float x_ = cx[cid];
            float y_ = cy[cid];

            float dist = d_euclidean_distance(x, y, x_, y_);

            if (dist < min_dist) {
                min_dist = dist;
                min_cid = cid;
            }
        }

        // atomic update of the accumulators
        atomicAdd(&d_xa[min_cid], x);
        atomicAdd(&d_ya[min_cid], y);
        atomicAdd(&d_ca[min_cid], 1);
    }
}

void gen_samples(float* s, float* h_cx, float* h_cy, u32 k, u32 n) {
    srand(10);

    // [(x, y), (x, y), ...]
    for (u32 i = 0; i < n; i++) {
        s[i] = (float)rand() / RAND_MAX;
    }

    for (u32 i = 0; i < k; i++) {
        h_cx[i] = s[i * 2];
        h_cy[i] = s[i * 2 + 1];
    }
}

int main(int argc, char** argv) {
    int n = atoi(argv[1]);
    int k = atoi(argv[2]);

    int tpb = 8; // Block Size (Threads Per Block) 128 64 32

    float* h_s = (float*)malloc(n * 2 * sizeof(float));
    float* h_cx = (float*)malloc(k * sizeof(float));
    float* h_cy = (float*)malloc(k * sizeof(float));

    gen_samples(h_s, h_cx, h_cy, k, n * 2);

    // print the first K samples
    //for (int i = 0; i < k; i++)
    //    printf("Centroid %d: (%f, %f)\n", i, h_cx[i], h_cy[i]);

    float* d_s; // samples
    float* d_cx; // centroid x
    float* d_cy; // centroid y
    float* d_xa; // accumulator for x
    float* d_ya; // accumulator for y
    u32* d_ca;  // accumulator for count

    cuda_err_check(cudaMalloc(&d_s, n * 2 * sizeof(float)));
    cuda_err_check(cudaMalloc(&d_cx, k * sizeof(float)));
    cuda_err_check(cudaMalloc(&d_cy, k * sizeof(float)));
    cuda_err_check(cudaMalloc(&d_xa, k * sizeof(float)));
    cuda_err_check(cudaMalloc(&d_ya, k * sizeof(float)));
    cuda_err_check(cudaMalloc(&d_ca, k * sizeof(u32)));

    cuda_err_check(cudaMemcpy(d_s, h_s, n * 2 * sizeof(float), cudaMemcpyHostToDevice));
    cuda_err_check(cudaMemcpy(d_cx, h_cx, k * sizeof(float), cudaMemcpyHostToDevice));
    cuda_err_check(cudaMemcpy(d_cy, h_cy, k * sizeof(float), cudaMemcpyHostToDevice));

    u32 gsz = ceil((float)n / (float)tpb);

    // it's cuda time
    cudaEvent_t start, stop;
    cudaEventCreate(&start);
    cudaEventCreate(&stop);
    cudaEventRecord(start);
    u32 iter_max = 20;

    for (int iter = 0; iter < iter_max; iter++) {
        d_clear_accumulators << <1, k >> > (d_xa, d_ya, d_ca);
        d_cluster_points << <gsz, tpb >> > (d_s, d_cx, d_cy, d_xa, d_ya, d_ca, n, k);
        cudaDeviceSynchronize();
        d_recalc_centroids << <1, k >> > (d_cx, d_cy, d_xa, d_ya, d_ca);
    }

    // allocate memory for the centroids_out
    float* cx_out = (float*)malloc(k * sizeof(float));
    float* cy_out = (float*)malloc(k * sizeof(float));

    cuda_err_check(cudaMemcpy(cx_out, d_cx, k * sizeof(float), cudaMemcpyDeviceToHost));
    cuda_err_check(cudaMemcpy(cy_out, d_cy, k * sizeof(float), cudaMemcpyDeviceToHost));

    u32* h_c_acc = (u32*)malloc(k * sizeof(u32));
    cuda_err_check(cudaMemcpy(h_c_acc, d_ca, k * sizeof(u32), cudaMemcpyDeviceToHost));

    cudaEventRecord(stop);
    cudaEventSynchronize(stop);
    float milliseconds = 0;
    cudaEventElapsedTime(&milliseconds, start, stop);
    printf("Time taken: %f ms (%f s)\n", milliseconds, milliseconds / 1000.0f);

    // Print the results
    printf("N = %d, K = %d\n", n, k);
    for (int i = 0; i < k; i++)
        printf("Centroid %d: (%f, %f) : Size: %d\n", i, cx_out[i], cy_out[i], h_c_acc[i]);
    printf("Iterations: %d\n", iter_max);

    cudaFree(d_s);
    cudaFree(d_cx);
    cudaFree(d_cy);
    cudaFree(d_xa);
    cudaFree(d_ya);
    cudaFree(d_ca);

    free(h_s);
    free(h_cx);
    free(h_cy);
    free(cx_out);
    free(cy_out);
    free(h_c_acc);
}