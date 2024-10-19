import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateReqDto } from './dto/user-create.req.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() reqDto: UserCreateReqDto) {
    return this.usersService.create({
      ...reqDto,
    });
  }
}
