import { Exception } from '../../../../../libs/dddcore/src';

export const PasswordNotMatchError = Exception.New(
  '10006',
  'New password and confirm password are differenet',
);

export const DisabledPasswordUserError = Exception.New(
  '10007',
  'DisabledPassword user cannot change password',
);

export const WrongOldPasswordError = Exception.New(
  '10008',
  'Old password is not corrent',
);

export const SamePasswordError = Exception.New(
  '10009',
  'New password cannot be the same as old password',
);

export const SamePasswordError10 = Exception.New(
  '10010',
  'New password cannot be the same as old password',
);
