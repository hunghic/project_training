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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../share/auth/decorator/role.decorator';
import { RoleGuard } from '../..//share/auth/guards/role.guard';
import { JwtAuthGuard } from '../../share/auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role.enum';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { SWAGGER_RESPONSE } from './user.constant';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOkResponse(SWAGGER_RESPONSE.HEALTH_CHECK)
  @Roles(Role.ADMIN)
  @Get()
  findAllPage(@Query('perPage') perPage = 5, @Query('pageNumber') pageNumber = 1) {
    return this.userService.findAllPage(+perPage, +pageNumber);
  }
  @Roles(Role.ADMIN)
  @Get('id/:id')
  getOne(@Param('id') id: string) {
    return this.userService.getOneUser(+id);
  }
  @Roles(Role.ADMIN)
  @Get('search')
  listSearch(@Query() query: any) {
    return this.userService.listSearch(query);
  }
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(dto);
  }
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userService.updateByUserId(+id, updateUserDto);
  }
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  @ApiBearerAuth()
  @Get('/profile')
  profile(@Req() request) {
    return {
      req: request.user,
    };
  }
}
