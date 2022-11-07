import { Controller, Get, NotFoundException } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe() {
    const user = await this.userService.getUser('2')

    if(!user) throw new NotFoundException();

    return user;
  }

  @Get() 
  getUsers() {
    return this.userService.getUsers()
  }
}
