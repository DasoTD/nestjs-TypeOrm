/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from './entities/auth.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createAuthDto : CreateAuthDto): Promise<User> {
        const { username, password } = createAuthDto;
        const user = await this.create({username, password})
        await this.save(user);
        return user;
    }
}
