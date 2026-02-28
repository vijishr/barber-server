// 404 handler
const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
}

// General error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}

module.exports = {
  notFound,
  errorHandler,
}

