import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class APIKeyAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isExternalRoute = new Reflector().get<boolean | undefined>('__is_external_route__', context.getHandler());

    if (isExternalRoute) {
      return true;
    }

    if (request.headers['api-key'] !== process.env['API_KEY']) {
      throw new ForbiddenException(request.headers['api-key'] ? 'Invalid API key!' : 'API key was not sent!');
    }

    return true;
  }
}
