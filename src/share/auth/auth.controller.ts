import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/api/user/dto/create-user.dto';
import { AUTH_SWAGGER_RESPONSE } from './auth.constant';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<LoginResponseDto> {
    return this.authService.register();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }
}
