import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

import { ATDataDto, AuthDto, RegisterDto } from './dto';
import { JwtPayload, Tokens, UserAgent } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: RegisterDto): Promise<boolean> {
    const hash = await argon.hash(dto.password);

    await this.prisma.user
      .create({
        data: {
          username: dto.username,
          password: hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    return true;
  }

  async signinLocal(dto: AuthDto, ua: UserAgent): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user, ua);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.jwtrefresh.deleteMany({
      where: {
        user_id: userId,
      },
    });
    return true;
  }

  async refreshTokens(
    userId: string,
    rt: string,
    ua: UserAgent,
  ): Promise<Tokens> {
    const user: ATDataDto = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user, ua);
    return tokens;
  }

  async getTokens(user: ATDataDto, ua: UserAgent): Promise<Tokens> {
    const at = await this.getAT(user.id, user.username);
    const rt = await this.getRT(user.id, ua, at);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async getAT(userId: string, username: string) {
    const jwtPayload: JwtPayload = {
      uid: userId,
      username: username,
    };

    const at = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: this.config.get<string>('AT_TTL'),
    });

    return at;
  }

  async getRT(userId: string, ua: UserAgent, at: string) {
    const rtRecordId = await this.prisma.jwtrefresh.findFirst({
      where: { user_id: userId, ip: ua.ip, ua: ua.ua.ua },
    });

    const rtRecord = await this.prisma.jwtrefresh.upsert({
      create: {
        user_id: userId,
        ip: ua.ip,
        ua: ua.ua.ua,
        at: at,
      },
      update: {
        at: at,
      },
      where: {
        id: rtRecordId != null ? rtRecordId.id : 'notFound',
      },
    });

    const jwtPayload = {
      rtId: rtRecord.id,
    };

    const rt = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('RT_SECRET'),
      expiresIn: this.config.get<string>('RT_TTL'),
    });

    return rt;
  }
}
