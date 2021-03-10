import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './User.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(AuthCredentialsDto: AuthCredentialsDto) {
    const username = await this.userRepository.validateUserPassword(AuthCredentialsDto);
    if (!username) {
        throw new UnauthorizedException('Invalid credentials');
    }
    console.log(username);
    
  }
}
