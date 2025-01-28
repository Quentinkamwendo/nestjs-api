import { Controller, Get } from '@nestjs/common';
// import { Crud } from '@nestjsx/crud';
import { UsersService } from './users.service';
import { Users } from './users.entity';

// @RouteMetadata()
// @Crud({
//     model:{type:UsersEntity},
//     params:{
//     }
// })
@Controller()
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('users')
  getUsers() {
    return this.service.getUsers();
  }

  @Get('district')
  getDataFromApi() {
    return this.service.getDataFromApi();
  }

  @Get('combine')
  combinedData() {
    return this.service.getCombinedData();
  }
}
