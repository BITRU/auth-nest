import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as request_info from 'request-info';

import { UserAgent } from '../../auth/types';

export const GetCurrentUserAgent = createParamDecorator(
  (_: undefined, context: ExecutionContext): UserAgent => {
    const request = context.switchToHttp().getRequest();

    const ua: UserAgent = request_info(request);

    return ua;
  },
);
