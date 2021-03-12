import * as bcrypt from 'bcryptjs';
import { User } from './User.entity';

describe('User entity', () => {
  let user: User;

  beforeAll(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('12345678');
      expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password in invalid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      // expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
