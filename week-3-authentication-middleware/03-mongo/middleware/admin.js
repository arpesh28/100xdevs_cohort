const zod = require("zod");

const getErrors = (errors) => {
  return errors?.map((err) => ({
    [err.path[0]]: err.message,
  }));
};

// Middleware for handling auth
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
}

const validateAdminSignUp = (adminData) => {
  const schema = zod.object({
    username: zod.string(),
    password: zod.string(),
  });
  const validate = schema.safeParse(adminData);
  if (validate.success) return false;
  return getErrors(validate?.error?.errors);
};

module.exports = { adminMiddleware, validateAdminSignUp };
