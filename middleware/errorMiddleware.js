const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    // Hide stack trace in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
