import { UUID } from '../../dddcore/uuid';
import { User } from './user';

describe('User entity', () => {
  describe('create', () => {
    it('should return user entity', () => {
      const user = User.create('test1', 'password1');

      expect(user.getUsername()).toBe('test1');
      expect(user.getPassword()).toBe('password1');
      expect(user.getID()).not.toBeNull();
      expect(user.getID().toString().length).toBeGreaterThan(1);
    });
  });

  describe('build', () => {
    it('should return user entity', () => {
      const id = UUID.new().toString();
      const user = User.build(id, 'test2', 'password2');

      expect(user.getID().toString()).toBe(id);
      expect(user.getUsername()).toBe('test2');
      expect(user.getPassword()).toBe('password2');
    });
  });

  describe('rename', () => {
    it('should return user entity', () => {
      const user = User.create('test3', 'password3');

      user.rename('test4');

      expect(user.getUsername()).toBe('test4');
    });
  });
});
