import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';

const publicUserFields =  {
  id: true,
  name: true,
  email: true,
  picture: true
}

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: publicUserFields,
    });

    return user;
  }

  async getUsers() {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        picture: true,
        profile: {
          select: {
            department: true,
          }
        }
      }
    });

    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        profile: {
          create: {
            content: `### Bem vindo ao CJR wall!\n ${createUserDto.name}`
          }
        }
      },
      select: publicUserFields,
    })

    return user; 
  }

  async update(id: string,updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: {
        id
      },
      data: updateUserDto,
      select: publicUserFields 
    });

    return user;
  }  

  async setRefreshToken(id: string, currentRefreshToken: string) {
    const currentRefreshTokenHash = await bcrypt.hash(
      currentRefreshToken,
      await bcrypt.genSalt(),
    );

    return await this.prismaService.user.update({
      where: { id },
      data: { currentRefreshToken: currentRefreshTokenHash },
      select: { id: true, email: true }
    });
  }

  async verifyRefreshToken(id: string, refreshToken: string) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id },
    })

    if(!user?.currentRefreshToken ||
      !(await bcrypt.compare(refreshToken, user.currentRefreshToken))
    ) {
      throw new UnauthorizedException();
    }

    return {id: user.id, email: user.email}
  }

  async removeRefreshToken(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: { currentRefreshToken: null },
      select: { id: true, email: true },
    });
  }
}
