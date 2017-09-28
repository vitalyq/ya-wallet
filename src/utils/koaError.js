module.exports = (status, msg, properties) => {
  const error = Error(msg);
  error.status = status;
  Object.assign(error, properties);
  return error;
};
