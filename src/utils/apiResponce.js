// class APiResponce {
//   constructor(statusCode, data, message = "Success", data) {
//     this.statusCode = statusCode < 400;
//     this.data = data;
//     this.message = message;
//     this.success = true;
//   }
// }
// export { APiResponce };

const createApiResponse = (statusCode, data, message = "Success") => {
  return {
    statusCode: statusCode < 400,
    data: data,
    message: message,
    success: true,
  };
};

export { createApiResponse };
