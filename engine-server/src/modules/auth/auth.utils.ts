/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { SessionContainer } from 'supertokens-node/recipe/session';

export class UserSession {
  constructor(private userId: string, private jwt: string) {}
  public static createFromSession(session: SessionContainer) {
    return new UserSession(session.getUserId(), session.getAccessToken());
  }
  public static createFromParameters(userId: string, jwt: string) {
    return new UserSession(userId, jwt);
  }

  public getUserId() {
    return this.userId;
  }

  public getJwt() {
    return this.jwt;
  }
}