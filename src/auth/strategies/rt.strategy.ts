import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayload, JwtPayloadRtData, UserAgent } from '../types';

import * as request_info from 'request-info';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      secretOrKey: config.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    refreshToken: JwtRefreshPayload,
  ): Promise<JwtPayloadRtData> {
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    const ua: UserAgent = request_info(req);

    const rtRecordId = await this.prisma.jwtrefresh.findFirst({
      where: { id: refreshToken.rtId, ip: ua.ip, ua: ua.ua.ua },
    });

    if (!rtRecordId) throw new ForbiddenException('Refresh token not found');

    return { rtId: rtRecordId.id, userId: rtRecordId.user_id };
  }
}
