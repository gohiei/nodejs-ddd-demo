import { User } from '../../entity/user';

export interface UserDTO {
  readonly id: string;
  readonly username: string;
  readonly user_id: number;
}

export function UserDTOBuildFrom(user: User): UserDTO {
  const dto = {
    id: user.getID(),
    username: user.getUsername(),
    user_id: user.getUserID(),
  };
  return dto;
}
