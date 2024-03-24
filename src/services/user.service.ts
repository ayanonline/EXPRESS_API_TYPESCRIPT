import to from "await-to-js";
import { IUser } from "../database/model/user.model";
import UserModel from "../database/schema/user.schema";
import { UserResponseDTO } from "../shared/DTO/user.dto";
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "../shared/exceptions/http.exceptions";

import { IMongooseError } from "../shared/extensions/errors.extension";
import {
  MongooseErrorCodes,
  MongooseErrors,
} from "../shared/enums/db/mongodb-errors.unum";
import { ErrorMessages } from "../shared/enums/messages/error-messages.enum";

// POST api/v1/users
export const createUser = async (userData: IUser) => {
  const newUser = new UserModel();
  newUser.username = userData.username;
  newUser.email = userData.email;
  newUser.password = userData.password;

  const [error, data] = await to(newUser.save());
  if (error && MongooseErrors.MongoServerError) {
    const mongooseError = error as IMongooseError;

    if (mongooseError.code === MongooseErrorCodes.UniqueConstraintFail) {
      throw new ConflictException(ErrorMessages.DuplicateEntryFail);
    } else {
      throw new InternalServerErrorException(ErrorMessages.CreateFail);
    }
  }
  const userDTO = UserResponseDTO.toResponse(newUser);

  return userDTO;
};

// GET /api/v1/users/:id
export const retrieveUserById = async (
  id: string
): Promise<UserResponseDTO> => {
  const [error, existingUser] = await to(UserModel.findById(id));

  if (!existingUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  if (error) {
    throw new InternalServerErrorException(ErrorMessages.GetFail);
  }

  const userDTO = UserResponseDTO.toResponse(existingUser);
  return userDTO;
};

// GET /api/v1/users
export const retrieveUsers = async (): Promise<UserResponseDTO[]> => {
  const [error, users] = await to(UserModel.find({}));

  if (error) throw new InternalServerErrorException(ErrorMessages.GetFail);

  // map list of Mongoose users to userDTO
  const usersDTO = users.map((user) => UserResponseDTO.toResponse(user));

  return usersDTO;
};
