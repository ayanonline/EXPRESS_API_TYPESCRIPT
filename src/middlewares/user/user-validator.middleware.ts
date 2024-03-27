import { Request, Response, NextFunction } from "express";

import to from "await-to-js";

import asyncHanlder from "express-async-handler";
import {
  changePasswordValidationSchema,
  createUserValidationSchema,
  getUserIdValidationSchema,
  updateUserValidationSchema,
} from "../../shared/validators/user.validator";
import { BadRequestException } from "../../shared/exceptions/http.exceptions";

export const createUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Missing request body!" });
    }

    // the validateAsync method is built into Joi
    await createUserValidationSchema.validateAsync(req.body);

    next();
  } catch (e: any) {
    // if validation fails we send the message generated by Joi
    res.status(400).send({ message: e.message });
  }
};

export const updateUserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params?.id) {
      return res
        .status(400)
        .send({ message: 'Required parameter "id" is missing!' });
    }

    if (!req.body) {
      return res.status(400).send({ message: "Missing request body!" });
    }

    if (req.body.password || req.body.new_password) {
      return res.status(400).send({ message: "Invalid change requested!" });
    }

    await updateUserValidationSchema.validateAsync(req.body);

    next();
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
};

export const changePasswordValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      return res.status(400).send({ message: "Missing request body!" });
    }

    await changePasswordValidationSchema.validateAsync(req.body);

    next();
  } catch (e: any) {
    res.status(400).send({ message: e.message });
  }
};

export const getUserByIdValidator = asyncHanlder(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params?.id) {
      throw new BadRequestException('Required parameter "id" is missing!');
    }

    const [error] = await to(
      getUserIdValidationSchema.validateAsync(req.params)
    );

    if (error) throw new BadRequestException(error.message);

    next();
  }
);