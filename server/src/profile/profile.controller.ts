import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { SaveProfileDto } from "./dto/save-profile.dto";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
  constructor (private profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return await this.profileService.getProfile(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async saveProfile(@Body() saveProfileDto: SaveProfileDto) {
    return await this.profileService.save('2', saveProfileDto);
  }
}
