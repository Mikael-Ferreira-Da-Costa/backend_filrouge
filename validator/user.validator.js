import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(4).required().messages({
    "string.empty": "Username required",
    "string.min": "Min 3 characters required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Email required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Min 6 characters required",
    "any.required": "Password required",
  }),
});

export default userSchema;
