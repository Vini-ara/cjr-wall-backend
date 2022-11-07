import { Profile, Department } from "@prisma/client";
import { 
  IsDate, 
  IsString, 
  IsEnum, 
  IsNotEmpty, 
  IsNumber 
} from "class-validator"; 
import { TransformDate } from "../decorators/transform-data.decorator";
import { TransformSetHttpsPrefix } from "../decorators/transform-link.decorator";

export class ProfileEntity implements Profile {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Department)
  department: Department;

  @TransformSetHttpsPrefix()
  @IsString()
  instagram: string;

  @TransformSetHttpsPrefix()
  @IsString()
  linkedin: string;

  @TransformSetHttpsPrefix()
  @IsString()
  twitter: string;

  @TransformSetHttpsPrefix()
  @IsString()
  github: string;

  @IsString()
  content: string;

  @TransformDate()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @TransformDate()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}

