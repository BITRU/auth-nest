import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
// import { CaslAbilityFactory } from 'src/common/ability/casl-ability.factory';
// import { GetCurrentUser } from 'src/common/decorators';

// import { Public } from '../common/decorators';
import { AdminAuthService } from './admin.service';
import { BlockUserActiveTokensDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthAdminController {
  constructor(
    private adminAuthService: AdminAuthService,
    // private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  // @Public()
  @Post('blacklist')
  @HttpCode(HttpStatus.OK)
  blacklist(
    @Body() dto: BlockUserActiveTokensDto,
    // @GetCurrentUser() user: User,
  ) {
    // const ability = this.caslAbilityFactory.defineAbility()
    // return user;
    // return this.adminAuthService.blacklist(dto);
  }
}
