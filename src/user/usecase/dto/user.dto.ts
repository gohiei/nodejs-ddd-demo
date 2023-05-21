import { User } from '../../entity/user';

export interface UserDTO {
  readonly id: string;
  readonly username: string;
}

export function UserDTOBuildFrom(user: User): UserDTO {
  const dto = { id: user.getID(), username: user.getUsername() };
  return dto;
}
