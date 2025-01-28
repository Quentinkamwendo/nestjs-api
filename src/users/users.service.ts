import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { forkJoin, map, Observable } from 'rxjs';
// const endpoint = 'https://dev.mubas.ac.mw'
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private users: Repository<Users>,
    private httpService: HttpService,
  ) {}

  async getUsers(): Promise<Users[]> {
    return this.users.find();
  }

  getDataFromApi(): Observable<any> {
    const url = 'https://dev.mubas.ac.mw';
    return this.httpService.get(url).pipe(map((res) => res.data));
  }

  getCombinedData(): Observable<any> {
    const allUsers = this.httpService.get('http://localhost:3000/users');
    const districts = this.httpService.get('http://localhost:3000/district');

    return forkJoin([allUsers, districts]).pipe(
      map(([res1, res2]) => {
        const data1 = res1.data;
        const data2 = res2.data;

        return data1.map((item1, index) => ({
          ...item1,
          ...data2[index],
        }));
      }),
    );
  }

  // combineDataFromApiAndGetUsers() {
  //     return this.getDataFromApi().subscribe(map(res => {
  //         this.users.save(res)
  //     }))
  // }
}
