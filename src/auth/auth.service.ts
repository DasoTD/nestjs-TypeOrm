import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/auth.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userPository: UserRepository,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  signUp(createAuthDto: CreateAuthDto): Promise<User> {
    return this.userPository.createUser(createAuthDto); // 'This action adds a new auth';
  }

  async signIn(
    createAuthDto: CreateAuthDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = createAuthDto;
    const user = await this.userPository.findOne({
      where: {
        username,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.signToken(user.id, user.username);
    } else {
      throw new UnauthorizedException('please check your login credentials');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async signToken(
    userId: string,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };
    const secret = this.config.get('jWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
