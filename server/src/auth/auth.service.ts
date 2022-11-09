import { Injectable, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "./interface";

@Injectable() 
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  generateJwtAcessToken(id: string, email: string) {
    const payload: TokenPayload = { sub: id, email}
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    });

    return { 
      access_token,
      expires_in: Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'))
    }
  }
  
  generateCookieWithJwtRefreshToken(id: string, email: string) {
    const payload: TokenPayload = { sub: id, email };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`

    return { token, cookie };
  }

  generateCookieForLogout() {
    return `Refresh=; HttpOnly; Path=/; Max-Age=0`;
  }

  async googleValidate(token: string) {
    try {
      const createUserDto = await this.parseGoogleToken(token);

      const user = await this.userService.getUser(createUserDto.id);

      if(!user) {
        const newUser = await this.userService.create(createUserDto);

        return newUser;
      }

      const {id, ...updateUserDto}: {id: string} & UpdateUserDto = createUserDto;

      const updatedUser = await this.userService.update(id, updateUserDto);

      return updatedUser;
    } catch (error) {
      console.log(error)
      throw new HttpException('invalid token', 401)
    }
  }

  async parseGoogleToken(token: string): Promise<CreateUserDto> {
    const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: this.configService.get('GOOGLE_CLIENT_ID')
    });

    const { email, name, picture, sub } = ticket.getPayload()

    return { email, name, picture, id: sub }
  }
}
