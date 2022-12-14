import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from '../interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET")
    })
  }

  validate(payload: TokenPayload) {
    return {id: payload.sub, email: payload.email}
  }
}
