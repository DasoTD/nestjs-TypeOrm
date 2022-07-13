/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/auth.entity';
import { UserRepository } from '../user.repository';
@Injectable()
export class Jwtstrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository)
    private userPository: UserRepository,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: string; username: string }): Promise<User> {
    const user: User = await this.userPository.findOne({
      where: {
        id: payload.sub,
      },
    });
    //console.log(payload);
    delete user.password;
    if (!user){
        throw new UnauthorizedException();
    }
    return user;
  }
}
