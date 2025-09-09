const asyncWrapper = (aysncfn) => {
  return (req, res, next) => {
    aysncfn(req, res, next).catch(next); // Catch errors by catch and forward to Express error handler
    // equivalent to `.catch(err => next(err))`
  };
};

module.exports = asyncWrapper;
// File: backend/src/server.js