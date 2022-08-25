import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  // Res,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/share/auth/guards/jwt.guard';
import { SWAGGER_RESPONSE } from '../entity/entity.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOkResponse(SWAGGER_RESPONSE.HEALTH_CHECK)
  @Get()
  findAllPage(@Query('perPage') perPage = 5, @Query('pageNumber') pageNumber = 1) {
    return this.userService.findAllPage(+perPage, +pageNumber);
  }
  @Get('id/:id')
  getOne(@Param('id') id: string) {
    return this.userService.getOneUser(id);
  }
  @Get('search')
  listSearch(@Query() query: any) {
    return this.userService.listSearch(query);
  }
  @Post('create')
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userService.updateByUserId(id, updateUserDto);
  }
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() request) {
    return {
      req: request.user.id,
    };
  }
}
