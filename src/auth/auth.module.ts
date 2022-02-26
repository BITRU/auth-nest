import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthAdminController } from './admin.controller';

import { AuthService } from './auth.service';
import { AdminAuthService } from './admin.service';
import { AtStrategy, RtStrategy } from './strategies';
import { CaslModule } from 'src/common/ability/casl.module';

@Module({
  imports: [JwtModule.register({}), CaslModule],
  controllers: [AuthController, AuthAdminController],
  providers: [AuthService, AdminAuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
