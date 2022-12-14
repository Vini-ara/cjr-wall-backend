import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserEntity implements User {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string; 

  @IsNotEmpty()
  picture: string;

  @IsString()
  currentRefreshToken: string;
}
