import { User } from './../../auth/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // console.log(user)

    return { id: user.uid, accessLevel: 'basic' };
  },
);
