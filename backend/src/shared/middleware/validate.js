const AppError = require('../utils/AppError');

const validate = schema => (req, res, next) => {
  try {
    const { body, query, params } = req;
    const result = schema.parse({ body, query, params });
    
    // Assign parsed data back to req to use transformed values if any
    if (result.body) req.body = result.body;
    if (result.query) req.query = result.query;
    if (result.params) req.params = result.params;
    
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      next(new AppError(errorMessage, 400));
    } else {
      next(error);
    }
  }
};

module.exports = validate;
// const AppError = require('../utils/AppError');

// const validate = (schema) => (req, res, next) => {
//   try {
//     req.body = schema.parse(req.body);
//     next();
//   } catch (error) {
//     if (error.errors) {
//       const errorMessage = error.errors.map(e => e.message).join(', ');
//       next(new AppError(errorMessage, 400));
//     } else {
//       next(error);
//     }
//   }
// };

// module.exports = validate;

