import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private mailService: MailerService) {}

  async getByUserId(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition({ id });
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user;
  }
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user[0];
  }
  async findAllPage(perPage: number, pageNumber: number) {
    return this.userRepository.getAllPage(perPage, pageNumber);
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
    const code = uuid();
    const expriseIn = Date.now() + 3600; //1h'
    const newUser = this.userRepository.save({
      ...data,
      password: hashPassword,
      code: code,
      expriseIn: String(expriseIn),
    });
    if (!newUser) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    return newUser;
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
  async verifyEmail(code: string) {
    return this.userRepository.getUserByCode(code);
  }
}
