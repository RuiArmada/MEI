#ifndef BUILTIN_GCC_EXPR_H
#define BUILTIN_GCC_EXPR_H

#define likely(expr) __builtin_expect(!!(expr), 1)
#define unlikely(expr) __builtin_expect(!!(expr), 0)
// disable some warnings, used for development
#define unused __attribute__((unused))

#endif