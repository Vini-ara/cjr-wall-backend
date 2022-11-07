import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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
}
