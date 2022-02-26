import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  Public,
  GetCurrentUserId,
  GetRefreshData,
  GetCurrentUserAgent,
} from '../common/decorators';
import { RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto';
import { Tokens, UserAgent } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: RegisterDto): Promise<boolean> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(
    @GetCurrentUserAgent() ua: UserAgent,
    @Body() dto: AuthDto,
  ): Promise<Tokens> {
    return this.authService.signinLocal(dto, ua);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetRefreshData('rtId') rtId: string,
    @GetRefreshData('userId') userId: string,
    @GetCurrentUserAgent() ua: UserAgent,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, rtId, ua);
  }
}
