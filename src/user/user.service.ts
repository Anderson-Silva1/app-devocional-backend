import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getAllUsers({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    console.log('Limit:', limit, 'Offset:', offset);
    return this.userRepository.find({ take: limit, skip: offset });
  }

  getUserId(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  createUser(dto: CreateUserDto) {
    return dto;
  }

  updateUser(id: string, dto: UpdateUserDto) {
    return { id, dto };
  }

  deleteUser(id: string) {
    return id;
  }
}
