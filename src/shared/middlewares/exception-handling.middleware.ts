import { Request, Response, NextFunction } from "express";
import { IHTTPError } from "../extensions/errors.extension";
import { ErrorMessages } from "../enums/messages/error-messages.enum";

export const exceptionHandler = (
  error: IHTTPError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || ErrorMessages.Generic;

  return res.status(statusCode).send({ statusCode, message });
};
