import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import getConfig from '../../../config/db.config'; 
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('দয়া করে প্রথমে লগইন করুন!');
    }

    try {
      const config = getConfig();
      const secretKey = config.jwt.secret || 'MY_SUPER_SECRET_KEY_123';

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      
      request['user'] = payload;

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      const hasRole = requiredRoles.includes(payload.role);
      
      if (!hasRole) {
        throw new ForbiddenException('আপনার এই এপিআই অ্যাক্সেস করার অনুমতি নেই!');
      }

    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('টোকেনটির মেয়াদ শেষ অথবা অবৈধ!');
    }
    
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}