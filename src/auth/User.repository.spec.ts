import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './User.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

const mockCredencitalsDto = { username: 'testUsername', password: 'secret' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('Signup', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfullt sign up the user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredencitalsDto)).resolves.not.toThrow();
    });

    it('throws a conflic exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredencitalsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '12345' });
      expect(userRepository.signUp(mockCredencitalsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new User();
      user.username = 'Test username';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is succesfull', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredencitalsDto,
      );
      expect(result).toEqual('Test username');
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(
        mockCredencitalsDto,
      );
      expect(user.validatePassword).not.toHaveBeenCalled(); // Not called since it throws
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredencitalsDto,
      );
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('call bcrypt.js to generate hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(
        'testPassword',
        'testSalt',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
      expect(result).toEqual('testHash');
    });
  });
});
