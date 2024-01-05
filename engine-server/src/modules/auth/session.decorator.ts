/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserSession } from './auth.utils';

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserSession => {
    const request = ctx.switchToHttp().getRequest();
    return request.session as UserSession;
  },
);
