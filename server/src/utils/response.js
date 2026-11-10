export function success(res, data = {}, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function failure(res, code, message, statusCode = 400, fields = undefined) {
  const error = { code, message };
  if (fields) {
    error.fields = fields;
  }
  return res.status(statusCode).json({
    success: false,
    error,
  });
}
