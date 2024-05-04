export const sendErrRes = (res, message, statusCode) => {
  res.status(statusCode).json({ message });
};
