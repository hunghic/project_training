import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ERROR } from 'src/share/common/error-code.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByUserId(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition({ userId });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }

  async updateByUserId(userId: string, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOneByCondition(userId);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.userRepository.update(userFound.id, updateUserDto);

    return this.userRepository.findOneByCondition({ id: userFound.id });
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(data.password, salt);
    const newUser = this.userRepository.create({ ...data, password: hashPassword });
    const createUser = await this.userRepository.save(newUser);
    if (!newUser) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return createUser;
  }

  async getAllUser(): Promise<UserEntity> {
    return this.userRepository.getAll();
  }
  async getOneUser(id: string) {
    const userFound = await this.userRepository.findOneByCondition(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return this.userRepository.findOneByCondition(id);
  }
  async deleteUser(id: string) {
    const userFound = await this.userRepository.delete(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.userRepository.listSearch(name);
  }
}
