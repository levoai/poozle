/** Copyright (c) 2023, Poozle, all rights reserved. **/

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserSession } from './auth.utils';

@Injectable()
export class MasterGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest();

    // this for users to call from their APIs
    let jwt = request.headers['authorization'];
    jwt = jwt === undefined ? undefined : jwt.split('Bearer ')[1];

    // This is to allow API calls from temporal workflows
    if (jwt && jwt === process.env.MASTER_TOKEN) {
      request.session = UserSession.createFromParameters('master', jwt);
      return true;
    }

    throw new UnauthorizedException({
      message: 'Unauthorised',
    });
  }
}
