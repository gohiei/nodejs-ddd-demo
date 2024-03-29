import { UUID } from '@lib/dddcore/utility/index';
import { User } from './user';

describe('User entity', () => {
  describe('create', () => {
    it('should return user entity', async () => {
      const user = await User.create('test1', 'password1', 123);

      expect(user.getUsername()).toBe('test1');
      expect(user.getPassword()).toBe('password1');
      expect(user.getUserID()).toBe(123);
      expect(user.getID()).not.toBeNull();
      expect(user.getID().toString().length).toBeGreaterThan(1);
      expect(user.getUserPassword()).not.toBeNull();
    });
  });

  describe('build', () => {
    it('should return user entity', () => {
      const id = UUID.new().toString();
      const user = User.build({
        id,
        username: 'test2',
        password: 'password2',
        userID: 321,
      });

      expect(user.getID().toString()).toBe(id);
      expect(user.getUsername()).toBe('test2');
      expect(user.getPassword()).toBe('password2');
      expect(user.getUserID()).toBe(321);
    });
  });

  describe('rename', () => {
    it('should return user entity', async () => {
      const user = await User.create('test3', 'password3');

      user.rename('test4');

      expect(user.getUsername()).toBe('test4');
    });
  });

  describe('changePassword', () => {
    it('should return user entity', async () => {
      const user = await User.create('test4', 'password4');
      const up = user.getUserPassword();

      expect(await up.isValidPassword('password4')).toBeTruthy();
      expect(user.getPastUserPassword()).toBeUndefined;

      await user.changePassword('7890');

      expect(await up.isValidPassword('password4')).toBeFalsy();
      expect(await up.isValidPassword('7890')).toBeTruthy();
      expect(user.getPastUserPassword()).toBeDefined();
    });
  });
});
