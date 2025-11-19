const ApiError = require("../utils/apiError");

function validate(schema) {
  return (req, res, next) => {
    // Create safe copies (not references)
    const safeBody = { ...req.body };
    const safeQuery = { ...req.query };
    const safeParams = { ...req.params };

    const toValidate = {
      body: safeBody,
      query: safeQuery,
      params: safeParams,
    };

    const { error, value } = schema.validate(toValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new ApiError(400, "Validation failed", details));
    }

    req.validated = value;
    next();
  };
}

module.exports = validate;
