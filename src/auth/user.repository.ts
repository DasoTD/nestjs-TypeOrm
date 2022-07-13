/* eslint-disable prettier/prettier */
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/auth.entity';
import * as brcypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createAuthDto : CreateAuthDto): Promise<User> {
        try {
            const { username, password } = createAuthDto;

            const salt = await brcypt.genSalt()
            const hash = await brcypt.hash(password, salt);
            const user =  this.create({username, password: hash})
            await this.save(user);
            return user;
        } catch (error: any) {
            if(error.code === '23505'){
                throw new ConflictException("username already exist")
            }
            console.log(error.code)
            throw new InternalServerErrorException 
        }
        
    }
}
