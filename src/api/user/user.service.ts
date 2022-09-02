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

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user[0];
  }
  async findAllPage(perPage: number, pageNumber: number) {
    return this.userRepository.getAllPageUser(perPage, pageNumber);
  }
  async updateByUserId(userId: number, updateUserDto: UpdateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(updateUserDto.password, salt);
    const userFound = await this.userRepository.findOneByCondition(userId);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const userWasUpdated = await this.userRepository.update(userFound.id, { ...updateUserDto, password: hashPassword });

    return userWasUpdated;
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const checkEmail = data.email;
    if (!checkEmail) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(data.password, salt);
    const code = uuid();
    const expriseIn = Date.now() + 3600; //1h'
    this.userRepository.create({
      ...data,
      password: hashPassword,
      code: code,
      expriseIn: String(expriseIn),
    });
    const newUser = await this.userRepository.save({
      ...data,
      password: hashPassword,
      code: code,
      expriseIn: String(expriseIn),
    });
    return newUser;
  }

  async getAllUser(): Promise<UserEntity> {
    return this.userRepository.getAll();
  }
  async getOneUser(id: number) {
    const userFound = await this.userRepository.findOneByCondition(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return userFound;
  }
  async deleteUser(id: number) {
    const userFound = await this.userRepository.findOneByCondition(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.userRepository.delete(id);
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.userRepository.listSearch(name);
  }
  async verifyEmail(code: string) {
    return this.userRepository.getUserByCode(code);
  }
}
