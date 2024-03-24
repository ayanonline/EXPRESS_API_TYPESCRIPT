import { Router, Request, Response, NextFunction } from "express";
import { IUser } from "../database/model/user.model";
import UserModel from "../database/schema/user.schema";
import {
  changePasswordValidator,
  createUserValidator,
  getUserByIdValidator,
} from "../shared/middlewares/user-validator.middleware";

import { IHTTPError } from "../shared/extensions/errors.extension";
import * as userService from "../services/user.service";
import asyncHanlder from "express-async-handler";

const controller = Router();

controller
  .post(
    "/",
    createUserValidator,
    asyncHanlder(async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await userService.createUser(req.body);
      res.status(201).send(newUser);
    })
  )

  .get(
    "/",
    asyncHanlder(async (req: Request, res: Response) => {
      const users = await userService.retrieveUsers();
      res.send(users);
    })
  )

  .get("/:id", getUserByIdValidator, async (req: Request, res: Response) => {
    try {
      const existingUser = await userService.retrieveUserById(req.params.id);
      res.send(existingUser);
    } catch (ex) {
      const err = ex as IHTTPError;
      const statusCode = err.statusCode || 500;
      res.status(statusCode).send({ message: err.message });
    }
  })

  .patch("/:id", getUserByIdValidator, async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .send({ message: 'Required parameter "id" is missing!' });
    }

    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      return res
        .status(404)
        .send({ message: `User with id: ${id} was not found.` });
    }

    const changes: Partial<IUser> = req.body;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...changes } },
      { new: true }
    );

    res.send(updatedUser);
  })

  .delete("/:id", getUserByIdValidator, async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .send({ message: 'Required parameter "id" is missing!' });
    }

    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      return res
        .status(404)
        .send({ message: `User with id: ${id} was not found.` });
    }

    await UserModel.findByIdAndDelete({ _id: id });

    res.send({ message: "User removed!" });
  })

  .patch(
    "/change-password/:id",
    getUserByIdValidator,
    changePasswordValidator,
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: id },
          { $set: { password: req.body.new_password } },
          { new: true }
        );

        if (!updatedUser) {
          return res
            .status(404)
            .send({ message: `User with id: ${id} was not found.` });
        }

        res.send(updatedUser);
      } catch (e: unknown) {
        res.status(500).send({ message: "Unable to update data in DB!" });
      }
    }
  );

export default controller;
