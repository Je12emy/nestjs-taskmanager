import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret, // Will be changed
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // use jwt tokens to authenticated the user
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
