import Joi from "joi";

export const createUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().required(),

  repeat_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords must match" }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

export const updateUserValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
});

export const changePasswordValidationSchema = Joi.object({
  old_password: Joi.string().required(),

  new_password: Joi.string().required(),

  repeat_password: Joi.any()
    .valid(Joi.ref("new_password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
    }),
});

// MongoDB Object_ID Validator
export const getUserIdValidationSchema = Joi.object({
  id: Joi.string().hex().length(24),
});
