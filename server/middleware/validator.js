import { sendErrRes } from "../utils/helper.js";

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(
        { ...req.body },
        { strict: true, abortEarly: true }
      );
      next();
    } catch (error) {
      if (error) {
        sendErrRes(res, error.message, 422);
      } else {
        next(error);
      }
    }
  };
};

export default validate;
