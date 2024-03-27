import { Request, Response, NextFunction } from "express";
import { IHTTPError } from "../../shared/extensions/errors.extension";
import { ErrorMessages } from "../../shared/enums/messages/error-messages.enum";

export const errorHandler = (
  error: IHTTPError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || ErrorMessages.Generic;

  return res.status(statusCode).send({ statusCode, message });
};
