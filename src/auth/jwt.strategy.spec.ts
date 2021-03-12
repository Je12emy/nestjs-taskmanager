import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './User.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('jwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'testUser';
      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate({ username: 'testUser' });

      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'testUser',
      });

      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'testUser' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
