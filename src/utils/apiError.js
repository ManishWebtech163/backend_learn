// class ApiError extends Error {
//   constructor(
//     statusCode,
//     message = "Somthing went wrong",
//     errors = [],
//     stack = "",
//   ) {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = null;
//     this.message = message;
//     this.success = false;
//     this.errors = errors;
//     // -
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
// export { ApiError };

const createApiError = (
  statusCode,
  message = "Something went wrong",
  errors = [],
  stack = "",
) => {
  return {
    statusCode: statusCode,
    data: null,
    message: message,
    success: false,
    errors: errors,
    stack: stack || new Error().stack,
  };
};

export { createApiError };
