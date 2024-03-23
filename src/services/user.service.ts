import { IUser } from "../database/model/user.model";
import UserModel from "../database/schema/user.schema";
import { UserResponseDTO } from "../shared/DTO/user.dto";
import { NotFoundException } from "../shared/exceptions/http.exceptions";

// POST api/v1/users
export const createUser = async (userData: IUser) => {
  const newUser = new UserModel();
  newUser.username = userData.username;
  newUser.email = userData.email;
  newUser.password = userData.password;

  await newUser.save();
  const userDTO = UserResponseDTO.toResponse(newUser);

  return userDTO;
};

// GET /api/v1/users/:id
export const retrieveUserById = async (
  id: string
): Promise<UserResponseDTO> => {
  const existingUser = await UserModel.findById(id);

  if (!existingUser) {
    throw new NotFoundException(`User with id: ${id} was not found!`);
  }

  const userDTO = UserResponseDTO.toResponse(existingUser);
  return userDTO;
};

// GET /api/v1/users
export const retrieveUsers = async (): Promise<UserResponseDTO[]> => {
  const users = await UserModel.find({});

  // map list of Mongoose users to userDTO
  const usersDTO = users.map((user) => UserResponseDTO.toResponse(user));

  return usersDTO;
};
