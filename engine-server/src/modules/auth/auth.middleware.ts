/* eslint-disable @typescript-eslint/no-explicit-any */
/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: any;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: Request, res: any, next: () => void) {
    if (!!process.env.SUPERTOKEN_CONNECTION_URI) {
      return this.supertokensMiddleware(req, res, next);
    }
    next();  
  }
}
